'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Link2, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ResourceLink {
    id: string;
    title: string;
    url: string;
}

export const ResourceLinks = () => {
    const [links, setLinks] = useLocalStorage<ResourceLink[]>('focus-forge-resources', []);
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const addLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newUrl.trim()) return;

        // Simple URL validation/correction
        let formattedUrl = newUrl.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
            formattedUrl = 'https://' + formattedUrl;
        }

        const newLink: ResourceLink = {
            id: Math.random().toString(),
            title: newTitle.trim(),
            url: formattedUrl
        };

        setLinks([...links, newLink]);
        setNewTitle('');
        setNewUrl('');
        setIsAdding(false);
    };

    const removeLink = (id: string) => {
        setLinks(links.filter(l => l.id !== id));
    };

    return (
        <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <Link2 className="text-indigo-400" size={20} />
                    Important Resources
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAdding(!isAdding)}
                    className="h-8 w-8 p-0 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                    <Plus size={16} className={`transition-transform duration-300 ${isAdding ? 'rotate-45' : ''}`} />
                </Button>
            </div>

            {isAdding && (
                <form onSubmit={addLink} className="mb-4 space-y-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800 animate-in fade-in slide-in-from-top-2">
                    <Input
                        placeholder="Title (e.g. Math Notes)"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        autoFocus
                        className="h-8 text-sm"
                    />
                    <Input
                        placeholder="URL (e.g. google.com)"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        className="h-8 text-sm"
                    />
                    <Button type="submit" size="sm" className="w-full h-8 text-xs">
                        Add Resource
                    </Button>
                </form>
            )}

            <div className="space-y-2 flex-1 overflow-y-auto max-h-[300px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
                {links.length === 0 && !isAdding && (
                    <div className="text-center py-6 text-slate-500 text-sm italic">
                        No resources saved yet.
                    </div>
                )}

                {links.map((link) => (
                    <div key={link.id} className="group flex items-center justify-between p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all">
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 flex-1 min-w-0"
                        >
                            <div className="bg-indigo-500/20 p-1.5 rounded-md text-indigo-400">
                                <ExternalLink size={14} />
                            </div>
                            <span className="text-sm font-medium text-slate-300 truncate group-hover:text-white transition-colors">
                                {link.title}
                            </span>
                        </a>
                        <button
                            onClick={() => removeLink(link.id)}
                            className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
};
