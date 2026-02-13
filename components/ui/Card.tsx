import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/30 group ${className}`}>
            {title && <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-100 transition-colors">{title}</h3>}
            {children}
        </div>
    );
};
