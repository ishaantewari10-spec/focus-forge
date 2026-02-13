'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Calendar, CheckSquare, Settings, StickyNote, Volume2, Link2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Sidebar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
        { icon: Calendar, label: 'Study Planner', href: '/planner' },
        { icon: CheckSquare, label: 'Tasks & Habits', href: '/tasks' },
        { icon: StickyNote, label: 'Notes', href: '/notes' },
        { icon: Volume2, label: 'Focus Sounds', href: '/sounds' },
        { icon: Link2, label: 'Resources', href: '/resources' },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full p-6">
            <div className="flex items-center gap-3 mb-12">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">F</span>
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    FocusForge
                </h1>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                            <div
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer group ${isActive
                                    ? 'bg-blue-600/10 text-blue-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 w-1 h-8 bg-blue-500 rounded-r-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="pt-6 border-t border-slate-800 space-y-2">
                <Link href="/settings">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
                        <Settings size={20} />
                        <span className="font-medium">Settings</span>
                    </button>
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-slate-800 rounded-lg text-white shadow-lg"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col h-screen w-64 bg-slate-900 border-r border-slate-800 fixed left-0 top-0 overflow-y-auto">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="md:hidden fixed left-0 top-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50 overflow-y-auto"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
