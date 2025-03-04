import { useEffect, useState } from "react";

const useTimer = () => {
  const [seconds, setSeconds] = useState(59);
  useEffect(() => {
    let interval = undefined;
    if (seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [seconds]);

  const displayTime = () => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const formattedSec = sec < 10 ? `0${sec}` : sec;

    if (min > 0) {
      return `(${min}m ${formattedSec}s)`;
    } else {
      return `(${formattedSec}s)`;
    }
  };
  const resetTimer = () => setSeconds(59);
  const timerUp = () => seconds === 0;

  return { displayTime, resetTimer, timerUp };
};

export default useTimer;
