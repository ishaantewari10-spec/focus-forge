'use client';

import React from 'react';
import { ResourceLinks } from '../../components/dashboard/ResourceLinks';

export default function ResourcesPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-120px)]">
            <div>
                <h1 className="text-3xl font-bold text-white">Resources</h1>
                <p className="text-slate-400 mt-2">Your important study bookmarks.</p>
            </div>
            <ResourceLinks />
        </div>
    );
}
