import React from 'react';
import { Card } from '../ui/Card';
import { StudySession } from '../../utils/planner-logic';
import { motion } from 'framer-motion';
import { Clock, Coffee, BookOpen, CheckCircle } from 'lucide-react';

interface TimelineProps {
    plan: StudySession[];
}

export const Timeline: React.FC<TimelineProps> = ({ plan }) => {
    if (plan.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Your AI Schedule</h3>
            <div className="relative pl-8 border-l-2 border-slate-800 space-y-8">
                {plan.map((session, index) => {
                    const isBreak = session.type === 'break';
                    const isRevision = session.type === 'revision';

                    return (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            {/* Timeline Dot */}
                            <div className={`absolute -left-[41px] w-5 h-5 rounded-full border-4 border-slate-900 ${isBreak ? 'bg-green-500' : isRevision ? 'bg-purple-500' : 'bg-blue-500'
                                }`} />

                            <Card className={`p-4 ${isBreak ? 'bg-green-500/10 border-green-500/20' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                                {session.startTime} - {session.endTime}
                                            </span>
                                        </div>
                                        <h4 className={`font-bold ${isBreak ? 'text-green-400' : 'text-white'}`}>
                                            {session.topicName}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                                            <Clock size={14} />
                                            {session.durationMinutes} minutes
                                        </div>
                                    </div>
                                    <div className={`p-2 rounded-lg ${isBreak ? 'bg-green-500/20 text-green-400' :
                                        isRevision ? 'bg-purple-500/20 text-purple-400' :
                                            'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {isBreak ? <Coffee size={20} /> : isRevision ? <CheckCircle size={20} /> : <BookOpen size={20} />}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
