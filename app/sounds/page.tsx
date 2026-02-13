'use client';

import React from 'react';
import { FocusSounds } from '../../components/dashboard/FocusSounds';

export default function SoundsPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-120px)]">
            <div>
                <h1 className="text-3xl font-bold text-white">Focus Sounds</h1>
                <p className="text-slate-400 mt-2">Ambient noise to help you concentrate.</p>
            </div>
            <FocusSounds />
        </div>
    );
}
