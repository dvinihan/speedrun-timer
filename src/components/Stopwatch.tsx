import axios, { AxiosResponse } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import styled from "styled-components";
import { SplitData, SplitRequestBody } from "../../pages/api/split";
import { useAppContext } from "../context/AppContext";
import { getDisplayTime, getNextSegmentId } from "../helpers";
import { useCurrentSegment } from "../hooks/useCurrentSegment";
import { useCurrentSegmentId } from "../hooks/useCurrentSegmentId";
import { useLatestRunSegment } from "../hooks/useLatestRunSegment";
import { useRunId } from "../hooks/useRunId";
import { useRunSegmentsQuery } from "../hooks/useRunSegmentsQuery";
import { useSegments } from "../hooks/useSegments";
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
  const { isRunning, setIsRunning } = useAppContext()!;
  const [runningTime, setRunningTime] = useState(0);
  const [startedAtTime, setStartedAtTime] = useState(0);

  const runId = useRunId();
  const latestRunSegment = useLatestRunSegment();
  const currentSegmentId = useCurrentSegmentId();
  const currentSegment = useCurrentSegment();

  const segments = useSegments();
  const { refetch: refetchRunSegments } = useRunSegmentsQuery({
    onSuccess: (data) => {
      if (data) {
        const { totalTime } = data;
        if (!runningTime) {
          setRunningTime(totalTime);
        }
      }
    },
  });

  // timer
  useEffect(() => {
    let interval: NodeJS.Timer | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setRunningTime(Date.now() - startedAtTime + runningTime);
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // we can't include runningTime or the timer will tick too quickly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, startedAtTime]);

  const { mutate: performSplit } = useMutation(
    "split",
    async ({ isCompleted }: { isCompleted: boolean }) => {
      const { data } = await axios.post<
        SplitData,
        AxiosResponse<SplitData>,
        SplitRequestBody
      >("/api/split", {
        runId,
        segmentId: currentSegmentId!,
        segmentTime:
          Date.now() - startedAtTime + (currentSegment?.segmentTime ?? 0),
        isCompleted,
      });
      return data;
    },
    {
      onSuccess: () => {
        refetchRunSegments();
      },
    }
  );

  const start = () => {
    setIsRunning(true);
    setStartedAtTime(Date.now());
  };

  const resume = () => {
    setIsRunning(true);
    setStartedAtTime(Date.now());
  };

  const stop = () => {
    setIsRunning(false);
    performSplit({ isCompleted: false });
  };

  const reset = () => {
    setIsRunning(false);
    setStartedAtTime(0);
    setRunningTime(0);
  };

  const split = () => {
    performSplit({ isCompleted: true });
  };

  const finish = () => {
    performSplit({ isCompleted: true });
    setIsRunning(false);
  };

  const isOnLastSegment = useMemo(() => {
    const lastSegment = segments.slice(-1)[0];
    return lastSegment ? lastSegment.id === currentSegmentId : false;
  }, [currentSegmentId, segments]);

  const isFinished = useMemo(
    () => !Boolean(currentSegmentId) && Boolean(latestRunSegment),
    [currentSegmentId, latestRunSegment]
  );

  return (
    <VerticalDiv>
      <HorizontalDiv>
        {isRunning ? (
          <StopButton onClick={stop}>Stop</StopButton>
        ) : (
          <StartButton
            disabled={isFinished}
            onClick={runningTime ? resume : start}
          >
            {runningTime ? "Resume" : "Start"}
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
      {isFinished && <Time>Done!</Time>}
      <Time>{getDisplayTime(runningTime)}</Time>
      {/* <MediumButton disabled={isRunning} onClick={reset}>
        Reset
      </MediumButton> */}
    </VerticalDiv>
  );
};
