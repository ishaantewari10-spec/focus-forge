'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Plus, Trash2, Sparkles, Clock, BookOpen, Layers } from 'lucide-react';
import { Topic, Difficulty } from '../../utils/planner-logic';

interface PlannerFormProps {
    onGenerate: (hours: number, topics: Topic[], startTime: string) => void;
    isGenerating?: boolean;
}

export const PlannerForm: React.FC<PlannerFormProps> = ({ onGenerate, isGenerating }) => {
    const [hours, setHours] = useState<number>(2);
    const [startTime, setStartTime] = useState<string>('09:00');
    const [topics, setTopics] = useState<Topic[]>([]);

    // Interim state for the new topic being added
    const [newTopicName, setNewTopicName] = useState('');
    const [newTopicDifficulty, setNewTopicDifficulty] = useState<Difficulty>('Medium');

    const handleAddTopic = () => {
        if (!newTopicName.trim()) return;
        if (topics.length >= 10) return;

        const newTopic: Topic = {
            id: Math.random().toString(),
            name: newTopicName.trim(),
            difficulty: newTopicDifficulty
        };

        setTopics([...topics, newTopic]);
        setNewTopicName(''); // Reset input
        setNewTopicDifficulty('Medium');
    };

    const removeTopic = (id: string) => {
        setTopics(topics.filter(t => t.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (topics.length === 0) return;
        onGenerate(hours, topics, startTime);
    };

    return (
        <Card className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen className="text-blue-400" size={24} />
                    Plan Session
                </h2>
                <p className="text-slate-400 text-sm mt-1">Configure your available time and subjects.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 flex-1 flex flex-col">
                {/* Time Selection */}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <label className="flex items-center text-sm font-medium text-slate-300 mb-4">
                        <Clock size={16} className="mr-2 text-blue-400" />
                        Available Time
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="1"
                            max="12"
                            step="0.5"
                            value={hours}
                            onChange={(e) => setHours(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 min-w-[100px] overflow-hidden">
                            <input
                                type="number"
                                min="0.5"
                                max="24"
                                step="0.5"
                                value={hours}
                                onChange={(e) => setHours(Math.max(0.5, parseFloat(e.target.value) || 0))}
                                className="w-full bg-transparent text-white font-bold p-2 text-center focus:outline-none"
                            />
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider pr-3">Hrs</span>
                        </div>
                    </div>
                </div>

                {/* Start Time Selection */}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <label className="flex items-center text-sm font-medium text-slate-300 mb-4">
                        <Clock size={16} className="mr-2 text-green-400" />
                        Start Time (24h)
                    </label>
                    <div className="flex items-center gap-4">
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-blue-500 font-mono text-lg"
                        />
                    </div>
                </div>

                {/* Add Topic Section */}
                <div className="space-y-4">
                    <label className="flex items-center text-sm font-medium text-slate-300">
                        <Layers size={16} className="mr-2 text-purple-400" />
                        Add Subjects (Max 10)
                    </label>

                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    placeholder="Subject Name (e.g. Math)"
                                    value={newTopicName}
                                    onChange={(e) => setNewTopicName(e.target.value)}
                                    // Allow pressing Enter to add
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddTopic();
                                        }
                                    }}
                                />
                            </div>
                            <div className="w-[110px]">
                                <Select
                                    value={newTopicDifficulty}
                                    onChange={(e) => setNewTopicDifficulty(e.target.value as Difficulty)}
                                    options={[
                                        { label: 'Easy', value: 'Easy' },
                                        { label: 'Medium', value: 'Medium' },
                                        { label: 'Hard', value: 'Hard' },
                                    ]}
                                />
                            </div>
                        </div>
                        <Button
                            type="button"
                            onClick={handleAddTopic}
                            disabled={!newTopicName.trim() || topics.length >= 10}
                            className="w-full"
                            variant="secondary"
                        >
                            <Plus size={18} className="mr-2" />
                            Add to List
                        </Button>
                    </div>
                </div>

                {/* Topics List */}
                <div className="flex-1 min-h-[150px]">
                    <div className="text-sm font-medium text-slate-400 mb-2 flex justify-between">
                        <span>Your List</span>
                        <span>{topics.length}/10</span>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {topics.length === 0 && (
                            <div className="text-center py-8 text-slate-600 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                                <p>No subjects added yet.</p>
                            </div>
                        )}

                        {topics.map((topic) => (
                            <div key={topic.id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-slate-700 group hover:border-slate-600 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${topic.difficulty === 'Hard' ? 'bg-red-400' :
                                        topic.difficulty === 'Medium' ? 'bg-amber-400' : 'bg-green-400'
                                        }`} />
                                    <span className="font-medium text-slate-200">{topic.name}</span>
                                    <span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full">
                                        {topic.difficulty}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeTopic(topic.id)}
                                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full py-6 text-lg shadow-lg shadow-blue-500/20"
                    isLoading={isGenerating}
                    disabled={topics.length === 0}
                >
                    <Sparkles size={20} className="mr-2" />
                    Generate AI Plan
                </Button>
            </form>
        </Card>
    );
};
