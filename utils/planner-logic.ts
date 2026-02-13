export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Topic {
    id: string;
    name: string;
    difficulty: Difficulty;
}

export interface StudySession {
    id: string;
    topicId: string; // 'break' or 'revision' for non-study blocks
    topicName: string;
    durationMinutes: number;
    type: 'study' | 'break' | 'revision';
    startTime: string; // HH:MM (24h)
    endTime: string;   // HH:MM (24h)
}

export const generateStudyPlan = (totalHours: number, topics: Topic[], startTimeStr: string = '09:00'): StudySession[] => {
    if (topics.length === 0 || totalHours <= 0) return [];

    const totalMinutes = totalHours * 60;
    const plan: StudySession[] = [];

    // Parse start time
    const [startHour, startMinute] = startTimeStr.split(':').map(Number);
    let currentTime = new Date();
    currentTime.setHours(startHour, startMinute, 0, 0);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Reserve time for revision at the end (approx 10-15% of total time, capped at 30 mins)
    const revisionMinutes = Math.min(30, Math.floor(totalMinutes * 0.15));
    const availableStudyMinutes = totalMinutes - revisionMinutes;

    // Calculate weights based on difficulty
    const weights: Record<Difficulty, number> = {
        Hard: 2.0,
        Medium: 1.5,
        Easy: 1.0,
    };

    const totalWeight = topics.reduce((sum, topic) => sum + weights[topic.difficulty], 0);

    // Distribute time per topic
    const topicAllocations = topics.map(topic => ({
        topic,
        minutes: Math.floor((weights[topic.difficulty] / totalWeight) * availableStudyMinutes)
    }));

    // Sort: Hard topics first
    topicAllocations.sort((a, b) => weights[b.topic.difficulty] - weights[a.topic.difficulty]);

    let currentAllocationIndex = 0;

    // Helper to generate unique IDs
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const addSession = (type: 'study' | 'break' | 'revision', topicId: string, topicName: string, duration: number) => {
        const sessionStart = new Date(currentTime);
        currentTime.setMinutes(currentTime.getMinutes() + duration);
        const sessionEnd = new Date(currentTime);

        plan.push({
            id: generateId(),
            topicId,
            topicName,
            durationMinutes: duration,
            type,
            startTime: formatTime(sessionStart),
            endTime: formatTime(sessionEnd)
        });
    };

    topicAllocations.forEach((allocation) => {
        let remainingTopicMinutes = allocation.minutes;

        while (remainingTopicMinutes > 0) {
            // Determine session length (max 45-60 mins)
            const sessionLength = Math.min(remainingTopicMinutes, 60);

            addSession('study', allocation.topic.id, allocation.topic.name, sessionLength);

            remainingTopicMinutes -= sessionLength;

            // Add a break if there is more study to do
            // Also add a break if this is the last study block but we have revision coming up
            const isLastBlockOfTopic = remainingTopicMinutes <= 0;
            const isLastTopic = currentAllocationIndex === topicAllocations.length - 1;
            const hasRevision = revisionMinutes > 0;

            if (!isLastBlockOfTopic || !isLastTopic || (isLastTopic && hasRevision)) {
                addSession('break', 'break', 'Break', 10);
            }
        }
        currentAllocationIndex++;
    });

    // Add Revision Session
    if (revisionMinutes > 0) {
        addSession('revision', 'revision', 'Revision & Review', revisionMinutes);
    }

    return plan;
};
