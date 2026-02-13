'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Play, Pause, RotateCcw, Crosshair } from 'lucide-react';
import { Button } from '../ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const FocusTimer = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');
    const [studyTime, setStudyTime] = useLocalStorage<number>('focus-forge-study-time', 0);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editTime, setEditTime] = useState(25);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
                if (mode === 'focus') {
                    // Increment study time by 1 second (1/60th of a minute)
                    setStudyTime((prev) => prev + (1 / 60));
                }
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound here ideally
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, mode, setStudyTime]);

    const toggleTimer = () => {
        if (isEditing) saveTime();
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsEditing(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const switchMode = () => {
        const newMode = mode === 'focus' ? 'break' : 'focus';
        setMode(newMode);
        setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
        setIsActive(false);
        setIsEditing(false);
    };

    const saveTime = () => {
        setIsEditing(false);
        const newTime = Math.max(1, Math.min(180, editTime)); // Clamp between 1 and 180 mins
        setTimeLeft(newTime * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate max time based on default or user edit
    const totalTime = isEditing ? editTime * 60 : (mode === 'focus' ? 25 * 60 : 5 * 60);
    // Use the max of totalTime and timeLeft to avoid progress bar jumping if timeLeft > totalTime temporarily
    const maxDuration = Math.max(totalTime, timeLeft);
    const progress = (maxDuration - timeLeft) / maxDuration * 100;

    return (
        <Card className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Crosshair size={120} />
            </div>

            <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
                <div className="text-center group-timer">
                    <h3 className="text-lg font-medium text-slate-300 mb-1 uppercase tracking-wider">
                        {mode === 'focus' ? 'Focus Mode' : 'Break Time'}
                    </h3>

                    {isEditing ? (
                        <div className="flex items-center justify-center gap-2 mb-4 h-[60px]">
                            <input
                                type="number"
                                value={editTime}
                                onChange={(e) => setEditTime(parseInt(e.target.value) || 0)}
                                className="text-4xl font-bold bg-slate-800 text-white w-24 text-center rounded-lg border border-slate-600 focus:border-blue-500 outline-none py-1"
                                autoFocus
                                onBlur={saveTime}
                                onKeyDown={(e) => e.key === 'Enter' && saveTime()}
                            />
                            <span className="text-xl text-slate-400">min</span>
                        </div>
                    ) : (
                        <div
                            onClick={() => {
                                if (!isActive) {
                                    setIsEditing(true);
                                    setEditTime(Math.floor(timeLeft / 60));
                                }
                            }}
                            className={`text-6xl font-bold font-mono tracking-tighter tabular-nums bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 cursor-pointer hover:opacity-80 transition-opacity ${isActive ? 'pointer-events-none' : ''}`}
                            title="Click to edit time"
                        >
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>

                {/* Circular Progress (Simplified as a bar for now to ensure robustness) */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-linear ${mode === 'focus' ? 'bg-blue-500' : 'bg-green-500'}`}
                        style={{ width: `${100 - progress}%` }}
                    />
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={toggleTimer}
                        className={`w-14 h-14 rounded-full flex items-center justify-center ${isActive ? 'bg-amber-500/20 text-amber-500 border-amber-500/50' : 'bg-blue-500 text-white'}`}
                    >
                        {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </Button>

                    <Button
                        onClick={resetTimer}
                        variant="secondary"
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                    >
                        <RotateCcw size={20} />
                    </Button>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={switchMode}
                        className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-4"
                    >
                        Switch to {mode === 'focus' ? 'Break' : 'Focus'}
                    </button>
                </div>
            </div>
        </Card>
    );
};
