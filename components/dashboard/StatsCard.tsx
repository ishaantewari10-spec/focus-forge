import React from 'react';
import { Card } from '../ui/Card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, trendUp }) => {
    return (
        <Card className="hover:border-blue-500/30 transition-colors">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
                    {trend && (
                        <p className={`text-sm mt-2 flex items-center ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
                            <span>{trendUp ? '+' : ''}{trend}</span>
                            <span className="ml-1 text-slate-500">vs last week</span>
                        </p>
                    )}
                </div>
                <div className="p-3 rounded-xl bg-slate-800 text-blue-400">
                    <Icon size={24} />
                </div>
            </div>
        </Card>
    );
};
