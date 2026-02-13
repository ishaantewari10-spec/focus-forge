'use client';

import React, { useState, useEffect } from 'react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { QuoteWidget } from '../components/dashboard/QuoteWidget';
import { FocusTimer } from '../components/dashboard/FocusTimer';
import { Clock, CheckCircle, Flame } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Task {
  id: string;
  title: string;
  category: 'Study' | 'Gym' | 'Personal';
  completed: boolean;
}

export default function Dashboard() {
  const [tasks] = useLocalStorage<Task[]>('focus-forge-tasks', []);
  const [studyTime] = useLocalStorage<number>('focus-forge-study-time', 0); // stored in minutes
  // Simple streak logic: just a persisted number for now, in a real app would check dates
  const [streak] = useLocalStorage<number>('focus-forge-streak', 0);
  const [username] = useLocalStorage<string>('focus-forge-username', 'Student');

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 12) setGreeting('Good Morning');
      else if (hour >= 12 && hour < 16) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };

    updateGreeting();
    // Update every minute (60000ms) to ensure it stays accurate
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const tasksCompleted = tasks.filter(t => t.completed).length;
  const studyHours = (studyTime / 60).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      {/* Ambient background glow for 'Cool' factor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 grid gap-1">
        <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 animate-gradient-x">
            {greeting},
          </span>{' '}
          {username}
        </h1>
        <p className="text-slate-400 text-lg">Ready to forge your focus today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <StatsCard
          title="Study Hours"
          value={`${studyHours}h`}
          icon={Clock}
          trend="+1.5h"
          trendUp={true}
        />
        <StatsCard
          title="Tasks Completed"
          value={tasksCompleted}
          icon={CheckCircle}
          trend={`${tasks.length > 0 ? Math.round((tasksCompleted / tasks.length) * 100) : 0}%`}
          trendUp={true}
        />
        <StatsCard
          title="Day Streak"
          value={streak}
          icon={Flame}
          trend="Keep it up!"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <div className="space-y-6">
          <QuoteWidget />
          <FocusTimer />
        </div>
      </div>
    </div>
  );
}
