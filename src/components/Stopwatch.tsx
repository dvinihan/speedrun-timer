import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import { SplitRequestBody } from "../../pages/api/split";
import { useAppContext } from "../context/AppContext";
import { getDisplayTime } from "../helpers";
import { useRunId } from "../hooks/useRunId";
import { LargeButton, MediumButton } from "../styles/Buttons";
import { useActiveSegmentTime } from "../hooks/useActiveSegmentTime";
import { useRunsData } from "../hooks/useRunsData";
import { useSegmentsQuery } from "../hooks/useSegmentsQuery";
import { RUNS_QUERY_KEY } from "../constants";
import { useCurrentSegmentId } from "../hooks/useCurrentSegmentId";
import ReactModal from "react-modal";
import Loader from "react-loader-spinner";

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

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export const Stopwatch = () => {
  const queryClient = useQueryClient();
  const {
    isRunning,
    setIsRunning,
    startedAtTime,
    setStartedAtTime,
    runningTime,
    setRunningTime,
  } = useAppContext()!;

  const runId = useRunId();
  const segmentTime = useActiveSegmentTime();

  const { data: segments = [] } = useSegmentsQuery();
  const { latestRunSegments = [] } = useRunsData();
  const currentSegmentId = useCurrentSegmentId();

  const [isLoading, setIsLoading] = useState(false);

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
      setStartedAtTime(Date.now());

      const { data } = await axios.post<SplitRequestBody>("/api/split", {
        runId,
        segmentId: currentSegmentId!,
        segmentTime,
        isCompleted,
      });
      return data;
    },
    {
      onMutate: () => {
        setIsLoading(true);
      },
      onSettled: () => {
        setIsLoading(false);
      },
      onSuccess: (data) => {
        queryClient.setQueryData(RUNS_QUERY_KEY, data);
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

  const reset = async () => {
    setIsRunning(false);
    setStartedAtTime(0);
    setRunningTime(0);

    const { data } = await axios.post<SplitRequestBody>("/api/split", {
      runId: (runId ?? 0) + 1,
      segmentId: segments[0].id,
      segmentTime: 0,
      isCompleted: false,
    });
    queryClient.setQueryData(RUNS_QUERY_KEY, data);
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

  const isFinished = latestRunSegments.length === segments.length;

  return (
    <>
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
        <MediumButton disabled={isRunning} onClick={reset}>
          Reset
        </MediumButton>
      </VerticalDiv>
      <ReactModal isOpen={isLoading} style={modalStyles}>
        <Loader type="ThreeDots" />
      </ReactModal>
    </>
  );
};
