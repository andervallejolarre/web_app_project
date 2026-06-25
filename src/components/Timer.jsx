import React from 'react'
import { useState, useEffect } from 'react'

function Timer({ updated, onTimerReady }) {
    const [timeLeft, setTimeLeft] = useState(null);

    const formatTime = (ms) => {
        if (ms == null) return 'Loading...';
        if (ms <= 0) return '0h 0m';
        const totalMinutes = Math.floor(ms / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours}h ${minutes}m`;
    };

    useEffect(() => {
        if (!updated) return;

        const updateTimer = () => {
            const nextUpdateTime = Number(updated) + 24 * 60 * 60 * 1000;
            const millisLeft = nextUpdateTime - Date.now();
            setTimeLeft(millisLeft);
            
            if (millisLeft <= 0 && onTimerReady) {
                onTimerReady();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 60000);

        return () => clearInterval(interval);
    }, [updated, onTimerReady]);

    return (
        <div className="timerDisplay">
            <p><strong>Next update in: </strong>{formatTime(timeLeft)}</p>
        </div>
    );
}

export default Timer;
