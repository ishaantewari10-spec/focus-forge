'use client';

import React from 'react';
import { TaskTracker } from '../../components/tasks/TaskTracker';

export default function TasksPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white">Tasks & Habits</h1>
                <p className="text-slate-400 mt-2">Track your daily goals and build consistency.</p>
            </div>

            <TaskTracker />
        </div>
    );
}
