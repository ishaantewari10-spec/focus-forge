'use client';

import React, { useState } from 'react';
import { PlannerForm } from '../../components/planner/PlannerForm';
import { Timeline } from '../../components/planner/Timeline';
import { generateStudyPlan, Topic, StudySession } from '../../utils/planner-logic';

export default function PlannerPage() {
    const [plan, setPlan] = useState<StudySession[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = (hours: number, topics: Topic[], startTime: string) => {
        setIsGenerating(true);
        // Simulate AI "thinking" time for effect
        setTimeout(() => {
            const newPlan = generateStudyPlan(hours, topics, startTime);
            setPlan(newPlan);
            setIsGenerating(false);
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white">AI Study Planner</h1>
                <p className="text-slate-400 mt-2">Let our AI optimize your schedule for maximum retention.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <PlannerForm onGenerate={handleGenerate} isGenerating={isGenerating} />
                </div>
                <div className="lg:col-span-2">
                    {plan.length > 0 ? (
                        <Timeline plan={plan} />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500">
                            <p>Enter your available time and topics to generate a plan.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
