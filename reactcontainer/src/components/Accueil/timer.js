import React, { useState, useEffect } from "react";

function TimeCounter({ hoursDifference }) {
  // Split and parse the provided hoursDifference into hours, minutes, and seconds
  const [hours, minutes, seconds] = hoursDifference.split(":").map(Number);

  // Calculate the total seconds from the provided time
  const initialTotalSeconds = hours * 3600 + minutes * 60 + seconds;

  const [totalSeconds, setTotalSeconds] = useState(initialTotalSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      // Increment the total seconds by one second
      setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return <h2 > Depuis : {formatTime(totalSeconds)}</h2>;
}

export default TimeCounter;
