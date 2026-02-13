'use client';

import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Download, Trash2, Target, User } from 'lucide-react';

export default function SettingsPage() {
    const [username, setUsername] = useLocalStorage<string>('focus-forge-username', 'Student');
    const [goal, setGoal] = useLocalStorage<number>('focus-forge-daily-goal', 4);
    const [tasks] = useLocalStorage('focus-forge-tasks', []);
    const [studyTime] = useLocalStorage('focus-forge-study-time', 0);
    const [streak] = useLocalStorage('focus-forge-streak', 0);

    const handleResetData = () => {
        if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const handleExportData = () => {
        const data = {
            username,
            goal,
            tasks,
            studyTime,
            streak,
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `focus-forge-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-slate-400 mt-2">Manage your preferences and data.</p>
            </div>

            <Card>
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <User size={20} className="text-blue-400" />
                        Profile & Goals
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Enter your name"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">This name will be displayed on your dashboard.</p>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                        <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                            <Target size={16} className="text-green-400" />
                            Daily Study Goal (Hours)
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="1"
                                max="12"
                                step="0.5"
                                value={goal}
                                onChange={(e) => setGoal(parseFloat(e.target.value))}
                                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex items-center justify-center bg-slate-800 w-16 h-10 rounded-lg border border-slate-700">
                                <span className="font-mono text-lg font-bold text-white">{goal}h</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="border-slate-800">
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Download size={20} className="text-purple-400" />
                        Data Management
                    </h3>

                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-medium text-white mb-1">Export Data</h4>
                            <p className="text-sm text-slate-400">
                                Download a JSON backup of all your progress.
                            </p>
                        </div>
                        <Button onClick={handleExportData} variant="secondary" size="sm" className="whitespace-nowrap">
                            Download Backup
                        </Button>
                    </div>

                    <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h4 className="font-medium text-red-400 mb-1 flex items-center gap-2">
                                <Trash2 size={16} />
                                Danger Zone
                            </h4>
                            <p className="text-sm text-slate-500">
                                Permanently remove all local data.
                            </p>
                        </div>
                        <Button
                            onClick={handleResetData}
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 whitespace-nowrap"
                        >
                            Reset All Data
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="text-center text-slate-600 text-xs">
                <p>FocusForge v1.1.0 • Built for Students</p>
            </div>
        </div>
    );
}
