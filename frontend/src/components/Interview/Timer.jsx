import React, { useState, useEffect, useRef } from 'react';
import { formatTime } from '../../utils/helpers';

function Timer({ timeRemaining, timeLimit, onUpdate }) {
  const [remaining, setRemaining] = useState(timeLimit);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemaining(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const newTime = Math.max(0, prev - 1);
        onUpdate(timeLimit - newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [timeLimit, onUpdate]);

  const isWarning = remaining < 10;

  return (
    <span className={`timer ${isWarning ? 'warning' : ''}`}>
      ⏱ {formatTime(remaining)} / {formatTime(timeLimit)}
    </span>
  );
}

export default Timer;