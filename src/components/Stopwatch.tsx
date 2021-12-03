import axios from "axios";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { useAppContext } from "../context/AppContext";
import { LargeButton, MediumButton } from "../styles/Buttons";

const StartButton = styled(LargeButton)`
  background-color: lightgreen;
`;

const StopButton = styled(LargeButton)`
  background-color: salmon;
`;

const SplitButton = styled(LargeButton)`
  background-color: ${(props: { color?: string }) => props.color};
`;

const VerticalDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const HorizontalDiv = styled.div`
  display: flex;
`;

const Time = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px;
  font-size: xx-large;
`;

export const Stopwatch = () => {
  const { isRunning, setIsRunning, setCurrentSegmentId } = useAppContext()!;

  const [startedAtTime, setStartedAtTime] = useState(0);
  const [time, setTime] = useState(0);
  const [cachedTime, setCachedTime] = useState(0);

  const { data: segments = [] } = useQuery("segments", async () => {
    const { data } = await axios.get("/api/segments");
    return data;
  });

  const { mutate } = useMutation("split", async () => {
    await axios.post("/api/split", {});
  });

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
      setCurrentSegmentId(segments[0].id);
    }
  };

  const stop = () => {
    setIsRunning(false);
    setCachedTime(time);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setStartedAtTime(0);
    setCachedTime(0);
  };

  const split = () => {};

  return (
    <VerticalDiv>
      <HorizontalDiv>
        {isRunning ? (
          <StopButton onClick={stop}>Stop</StopButton>
        ) : (
          <StartButton onClick={start}>Start</StartButton>
        )}
        <SplitButton
          color={isRunning ? "lightgreen" : ""}
          disabled={!isRunning}
          onClick={split}
        >
          Split
        </SplitButton>
      </HorizontalDiv>
      <Time>
        <span>{("0" + Math.floor((time / 3600000) % 60)).slice(-2)}</span>:
        <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}</span>:
        <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}</span>:
        <span>{Math.floor(time / 100) % 10}</span>
      </Time>
      <MediumButton disabled={isRunning} onClick={reset}>
        Reset
      </MediumButton>
    </VerticalDiv>
  );
};
