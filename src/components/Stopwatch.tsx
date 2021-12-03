import { useEffect, useState } from "react";

export const Stopwatch = () => {
  const [startedAtTime, setStartedAtTime] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [cachedTime, setCachedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(Date.now() - startedAtTime + cachedTime);
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [cachedTime, isRunning, startedAtTime]);

  const start = () => {
    if (!isRunning) {
      setStartedAtTime(Date.now());
      setTime(cachedTime);
      setIsRunning(true);
    }
  };

  const pause = () => {
    setIsRunning(false);
    setCachedTime(time);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setStartedAtTime(0);
    setCachedTime(0);
  };

  return (
    <div>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={reset}>Reset</button>
      <div>
        <span>{("0" + Math.floor((time / 3600000) % 60)).slice(-2)}</span>:
        <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}</span>:
        <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>:
        <span>{("0" + ((time / 10) % 1000)).slice(-2)}</span>
      </div>
    </div>
  );
};
