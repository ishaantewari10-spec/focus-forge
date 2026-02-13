'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Save, StickyNote } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const QuickNotes = () => {
    const [savedNotes, setSavedNotes] = useLocalStorage<string>('focus-forge-quick-notes', '');
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setNotes(savedNotes);
    }, [savedNotes]);

    const handleSave = () => {
        setIsSaving(true);
        setSavedNotes(notes);
        setTimeout(() => setIsSaving(false), 800);
    };

    return (
        <Card className="h-full flex flex-col relative group">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <StickyNote className="text-yellow-400" size={20} />
                    Quick Notes
                </h3>
                <button
                    onClick={handleSave}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${isSaving ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                >
                    <Save size={14} />
                    {isSaving ? 'Saved!' : 'Save'}
                </button>
            </div>

            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jot down thoughts, ideas, or reminders here..."
                className="flex-1 w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all text-sm leading-relaxed"
                spellCheck={false}
            />

            <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                Auto-saves locally
            </div>
        </Card>
    );
};
