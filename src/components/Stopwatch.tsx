import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { useAppContext } from "../context/AppContext";
import { LargeButton, MediumButton } from "../styles/Buttons";
import { Segment } from "../types/Segment";

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
  const { isRunning, setIsRunning, currentSegmentId, setCurrentSegmentId } =
    useAppContext()!;

  const [startedAtTime, setStartedAtTime] = useState(0);
  const [time, setTime] = useState(0);
  const [accruedTime, setAccruedTime] = useState(0);
  const [runId, setRunId] = useState<number | undefined>();

  const { data: segments = [] } = useQuery<Segment[]>("segments", async () => {
    const { data } = await axios.get("/api/segments");
    return data;
  });

  const isOnLastSegment = useMemo(() => {
    const maxId = Math.max(...segments.map((s) => s.id));
    return maxId === currentSegmentId;
  }, [currentSegmentId, segments]);

  const { mutate: performSplit } = useMutation(
    "split",
    async () => {
      const { data } = await axios.post("/api/split", {
        segmentId: currentSegmentId,
        runningTime: time,
        runId,
      });
      return data;
    },
    {
      onSuccess: ({ runId: newRunId }) => {
        if (!isOnLastSegment) {
          const sortedSegments = segments.sort((s) => s.id);
          const currentSegmentIndex = sortedSegments.findIndex(
            (s) => s.id === currentSegmentId
          );
          const nextSegmentIndex = currentSegmentIndex + 1;
          const nextSegment = sortedSegments[nextSegmentIndex];
          const nextSegmentId = nextSegment.id;
          setCurrentSegmentId(nextSegmentId);

          if (!runId) {
            setRunId(newRunId);
          }
        }
      },
    }
  );

  useEffect(() => {
    let interval: NodeJS.Timer | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(Date.now() - startedAtTime + accruedTime);
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [accruedTime, isRunning, startedAtTime]);

  const start = () => {
    if (startedAtTime) {
      resume();
      return;
    }

    if (!isRunning) {
      setStartedAtTime(Date.now());
      setTime(accruedTime);
      setIsRunning(true);
      setCurrentSegmentId(segments[0].id);
    }
  };

  const resume = () => {
    setStartedAtTime(Date.now());
    setTime(accruedTime);
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    setAccruedTime(time);
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    setAccruedTime(0);
    setStartedAtTime(0);
    setRunId(undefined);
  };

  const split = () => {
    performSplit();
  };

  const finish = () => {
    performSplit();
    setIsRunning(false);
    setAccruedTime(0);
    setStartedAtTime(0);
    setRunId(undefined);
  };

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
          onClick={isOnLastSegment ? finish : split}
        >
          {isOnLastSegment ? "Finish" : "Split"}
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
