import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Quote as QuoteIcon } from 'lucide-react';

const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
    { text: "Your future is created by what you do today, not tomorrow.", author: "Unknown" },
];

export const QuoteWidget = () => {
    const [quote, setQuote] = useState(quotes[0]);

    useEffect(() => {
        // Pick a random quote on mount (client-side only to match hydration)
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    return (
        <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20">
            <div className="flex gap-4">
                <QuoteIcon className="text-blue-400 shrink-0" size={32} />
                <div>
                    <p className="text-lg font-medium text-slate-200 italic">"{quote.text}"</p>
                    <p className="text-sm text-slate-400 mt-2">— {quote.author}</p>
                </div>
            </div>
        </Card>
    );
};
