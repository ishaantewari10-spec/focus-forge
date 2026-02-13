'use client';

import { useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export const StreakHandler = () => {
    const [streak, setStreak] = useLocalStorage<number>('focus-forge-streak', 0);
    const [lastVisit, setLastVisit] = useLocalStorage<string>('focus-forge-last-visit', '');

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];

        if (lastVisit !== today) {
            if (lastVisit) {
                const lastDate = new Date(lastVisit);
                const currentDate = new Date(today);
                const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    // Consecutive day
                    setStreak((prev) => prev + 1);
                } else if (diffDays > 1) {
                    // Missed a day or more, reset to 1
                    setStreak(1);
                } else {
                    // Same day (should be caught by initial check but just in case)
                }
            } else {
                // First visit ever
                setStreak(1);
            }
            setLastVisit(today);
        }
    }, [lastVisit, setLastVisit, setStreak]);

    return null; // Logic only component
};
