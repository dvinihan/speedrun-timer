import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import styled from "styled-components";
import { useAppContext } from "../context/AppContext";
import { getNextSegmentId } from "../helpers";
import { LargeButton, MediumButton } from "../styles/Buttons";
import { Run } from "../types/Run";
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
  const [runId, setRunId] = useState<number | undefined>();
  const [accruedTime, setAccruedTime] = useState(0);

  const { data: segments = [] } = useQuery<Segment[]>("segments", async () => {
    const { data } = await axios.get("/api/segments");
    return data;
  });
  const { data: runs = [] } = useQuery<Run[]>("runs", async () => {
    const { data } = await axios.get("/api/runs");
    return data;
  });

  useEffect(() => {
    if (runs.length === 0) {
      return;
    }

    const latestRunId = Math.max(...runs.map((r) => r.id));
    if (!latestRunId) {
      return;
    }
    setRunId(latestRunId);

    const latestRun = runs.find((r) => r.id === latestRunId)!;

    const latestSegmentId = Math.max(...latestRun.segments.map((s) => s.id));
    if (!latestSegmentId) {
      return;
    }

    const latestSegment = latestRun.segments.find(
      (s) => s.id === latestSegmentId
    )!;

    setAccruedTime(latestSegment.accruedTime);

    const nextSegmentId = getNextSegmentId(segments, latestSegmentId);
    setCurrentSegmentId(nextSegmentId);
  }, [runs, segments, setCurrentSegmentId]);

  const isOnLastSegment = useMemo(() => {
    const maxId = Math.max(...segments.map((s) => s.id));
    return maxId === currentSegmentId;
  }, [currentSegmentId, segments]);

  const { mutate: performSplit } = useMutation(
    "split",
    async () => {
      const { data } = await axios.post("/api/split", {
        segmentId: currentSegmentId,
        accruedTime,
        runId,
      });
      return data;
    },
    {
      onSuccess: ({ runId: newRunId }) => {
        if (!isOnLastSegment) {
          const nextSegmentId = getNextSegmentId(segments, currentSegmentId);
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
        setAccruedTime((time) => time + 10);
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
    setAccruedTime(0);
    setCurrentSegmentId(segments[0].id);
  };

  const resume = () => {
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setAccruedTime(0);
    setRunId(undefined);
  };

  const split = () => {
    performSplit();
  };

  const finish = () => {
    performSplit();
    setIsRunning(false);
    setAccruedTime(0);
    setRunId(undefined);
  };

  return (
    <VerticalDiv>
      <HorizontalDiv>
        {isRunning ? (
          <StopButton onClick={stop}>Stop</StopButton>
        ) : (
          <StartButton onClick={accruedTime ? resume : start}>
            Start
          </StartButton>
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
        <span>
          {("0" + Math.floor((accruedTime / 3600000) % 60)).slice(-2)}
        </span>
        :<span>{("0" + Math.floor((accruedTime / 60000) % 60)).slice(-2)}</span>
        :<span>{("0" + Math.floor((accruedTime / 1000) % 60)).slice(-2)}</span>:
        <span>{Math.floor(accruedTime / 100) % 10}</span>
      </Time>
      <MediumButton disabled={isRunning} onClick={reset}>
        Reset
      </MediumButton>
    </VerticalDiv>
  );
};
