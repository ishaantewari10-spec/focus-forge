'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Volume2, VolumeX, CloudRain, Coffee, Wind, Speaker } from 'lucide-react';

type SoundType = 'rain' | 'coffee' | 'white_noise' | null;

export const FocusSounds = () => {
    const [activeSound, setActiveSound] = useState<SoundType>(null);
    const [volume, setVolume] = useState(0.5);
    const [error, setError] = useState<string | null>(null);

    // HTML Audio for file-based sounds
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Web Audio API for procedural White Noise
    const audioContextRef = useRef<AudioContext | null>(null);
    const whiteNoiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    // Robust, high-quality audio sources from Google's Sound Library
    const sounds = {
        rain: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
        coffee: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
        white_noise: null // Handled procedurally
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopAudio();
            stopWhiteNoise();
        };
    }, []);

    // Handle Volume Changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
        if (gainNodeRef.current) {
            // Web Audio volume is 0-1 gain (we can scale it down a bit as white noise is loud)
            gainNodeRef.current.gain.value = volume * 0.15;
        }
    }, [volume]);

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.src = '';
        }
    };

    const stopWhiteNoise = () => {
        if (whiteNoiseNodeRef.current) {
            try {
                whiteNoiseNodeRef.current.stop();
            } catch (e) {
                // Ignore if already stopped
            }
            whiteNoiseNodeRef.current.disconnect();
            whiteNoiseNodeRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.suspend();
        }
    };

    const playWhiteNoise = () => {
        // Initialize AudioContext if needed
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        // Create buffer
        const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.value = volume * 0.15; // Lower base volume for noise
        gainNodeRef.current = gainNode;

        noise.connect(gainNode);
        gainNode.connect(ctx.destination);

        noise.start();
        whiteNoiseNodeRef.current = noise;
    };

    const toggleSound = async (sound: SoundType) => {
        setError(null);

        // If clicking the active sound, stop everything
        if (activeSound === sound) {
            setActiveSound(null);
            stopAudio();
            stopWhiteNoise();
            return;
        }

        // Stop any currently playing sound first
        stopAudio();
        stopWhiteNoise();
        setActiveSound(sound);

        if (sound === 'white_noise') {
            try {
                playWhiteNoise();
            } catch (err) {
                console.error("White noise error:", err);
                setError("Could not generate white noise.");
                setActiveSound(null);
            }
        } else if (sound && sounds[sound]) {
            if (audioRef.current) {
                try {
                    audioRef.current.src = sounds[sound]!;
                    audioRef.current.loop = true;
                    audioRef.current.volume = volume;
                    await audioRef.current.play();
                } catch (err) {
                    console.error("Audio playback error:", err);
                    setError("Could not play audio. Check connection.");
                    setActiveSound(null);
                }
            }
        }
    };

    return (
        <Card className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    {activeSound ? <Volume2 className="text-blue-400" size={20} /> : <VolumeX className="text-slate-500" size={20} />}
                    Focus Sounds
                </h3>
            </div>

            {error && (
                <div className="mb-4 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-3 gap-2 mb-6">
                <button
                    onClick={() => toggleSound('rain')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border ${activeSound === 'rain' ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'}`}
                >
                    <CloudRain size={24} className="mb-2" />
                    <span className="text-xs font-medium">Rain</span>
                </button>

                <button
                    onClick={() => toggleSound('coffee')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border ${activeSound === 'coffee' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'}`}
                >
                    <Coffee size={24} className="mb-2" />
                    <span className="text-xs font-medium">Cafe</span>
                </button>

                <button
                    onClick={() => toggleSound('white_noise')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border ${activeSound === 'white_noise' ? 'bg-purple-500/20 text-purple-400 border-purple-500/50' : 'bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'}`}
                >
                    <Wind size={24} className="mb-2" />
                    <span className="text-xs font-medium">Noise</span>
                </button>
            </div>

            {/* Volume Control */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Speaker size={12} /> Volume</span>
                    <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
            </div>

            <audio ref={audioRef} className="hidden" crossOrigin="anonymous" />
        </Card>
    );
};
