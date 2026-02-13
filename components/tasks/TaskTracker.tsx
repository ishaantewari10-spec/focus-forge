import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Plus, Trash, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Task {
    id: string;
    title: string;
    category: 'Study' | 'Gym' | 'Personal';
    completed: boolean;
}

export const TaskTracker: React.FC = () => {
    const [tasks, setTasks] = useLocalStorage<Task[]>('focus-forge-tasks', []);
    const [streak, setStreak] = useLocalStorage<number>('focus-forge-streak', 0);
    const [lastActive, setLastActive] = useLocalStorage<string>('focus-forge-last-active', '');

    const [newTask, setNewTask] = useState('');
    const [category, setCategory] = useState<'Study' | 'Gym' | 'Personal'>('Study');

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        setTasks([...tasks, {
            id: Date.now().toString(),
            title: newTask,
            category,
            completed: false
        }]);
        setNewTask('');
    };

    const toggleTask = (id: string) => {
        const updatedTasks = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);

        // Check if we just completed a task
        const task = updatedTasks.find(t => t.id === id);
        if (task?.completed) {
            const today = new Date().toISOString().split('T')[0];

            if (lastActive !== today) {
                // Check if yesterday was active
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastActive === yesterdayStr) {
                    setStreak(s => s + 1);
                } else {
                    setStreak(1);
                }

                setLastActive(today);
            }
        }

        // Check if all completed
        if (updatedTasks.every(t => t.completed) && updatedTasks.length > 0) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100;

    return (
        <Card className="h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Daily Tasks</h3>
                <span className="text-sm text-slate-400">{completedCount}/{tasks.length} Completed</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <form onSubmit={addTask} className="flex gap-2 mb-6">
                <Input
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1"
                />
                <div className="w-32">
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        options={[
                            { label: 'Study', value: 'Study' },
                            { label: 'Gym', value: 'Gym' },
                            { label: 'Life', value: 'Personal' },
                        ]}
                    />
                </div>
                <Button type="submit" size="sm">
                    <Plus size={20} />
                </Button>
            </form>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {tasks.length === 0 && (
                    <p className="text-center text-slate-500 py-4">No tasks yet. Stay focused!</p>
                )}
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${task.completed
                            ? 'bg-slate-800/50 border-slate-800 opacity-50'
                            : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                            }`}
                    >
                        <button
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-600 hover:border-blue-500'
                                }`}
                        >
                            {task.completed && <Check size={14} className="text-white" />}
                        </button>
                        <div className="flex-1">
                            <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                {task.title}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${task.category === 'Study' ? 'bg-blue-500/20 text-blue-400' :
                                task.category === 'Gym' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-purple-500/20 text-purple-400'
                                }`}>
                                {task.category}
                            </span>
                        </div>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                            <Trash size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
};
