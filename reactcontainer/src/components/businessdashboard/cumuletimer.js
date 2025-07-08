import React, { useState, useEffect } from "react";

function TimeCounter({ startTime }) {
  const [time, setTime] = useState(getTimeDifference(startTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeDifference(startTime));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  function getTimeDifference(startTime) {
    const now = new Date();
    const startDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, parseInt(startTime), 0);
    const diff = now - startDateTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return <h2>{time}</h2>;
}

export default TimeCounter;
