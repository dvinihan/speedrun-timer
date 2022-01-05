import axios from "axios";
import { useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import { SplitRequestBody } from "../../pages/api/split";
import { useAppContext } from "../context/AppContext";
import { getDisplayTime } from "../helpers";
import { LargeButton, MediumButton } from "../styles/Buttons";
import { useActiveSegmentTime } from "../hooks/useActiveSegmentTime";
import { useSegmentsQuery } from "../hooks/useSegmentsQuery";
import { RUNS_QUERY_KEY } from "../constants";
import { useCurrentSegmentId } from "../hooks/useCurrentSegmentId";
import { RunsApiResponse } from "../../pages/api/runs";
import { RunSegment } from "../types/RunSegment";
import { useRunsData } from "../hooks/useRunsData";

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
  const queryClient = useQueryClient();
  const {
    isRunning,
    setIsRunning,
    startedAtTime,
    setStartedAtTime,
    runningTime,
    setRunningTime,
    runType,
  } = useAppContext()!;

  const { latestRunSegments } = useRunsData();
  const segmentTime = useActiveSegmentTime();
  const currentSegmentId = useCurrentSegmentId();
  const { segments } = useSegmentsQuery();
  const runId = latestRunSegments?.[0]?.runId;

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
    async (newSplit: RunSegment) => {
      setStartedAtTime(Date.now());

      const { data } = await axios.post<SplitRequestBody>(
        `/api/split?runType=${runType}`,
        newSplit
      );
      return data;
    },
    {
      onMutate: async (newSplit) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries([RUNS_QUERY_KEY, runType]);

        // Snapshot the previous value
        const previousRunsData = queryClient.getQueryData<RunsApiResponse>([
          RUNS_QUERY_KEY,
          runType,
        ]);

        const emptyRunsData = {
          bestOverallTime: 0,
          latestRunSegments: [],
          segmentTimesList: [],
        };

        if (!previousRunsData) {
          return { previousRunsData: emptyRunsData };
        }

        // Optimistically update to the new value
        queryClient.setQueryData<RunsApiResponse>(
          [RUNS_QUERY_KEY, runType],
          (oldRunsData) => {
            if (!oldRunsData) return emptyRunsData;

            const runSegment = oldRunsData.latestRunSegments.find(
              (r) => r.segmentId === currentSegmentId
            );
            const newRunSegments = runSegment
              ? oldRunsData.latestRunSegments.map((r) =>
                  r.segmentId === currentSegmentId ? newSplit : r
                )
              : [...(oldRunsData?.latestRunSegments ?? []), newSplit];

            return {
              ...oldRunsData,
              latestRunSegments: newRunSegments,
            };
          }
        );

        // Return a context object with the snapshotted value
        return { previousRunsData };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (
        err,
        newSplit,
        context?: { previousRunsData: RunsApiResponse }
      ) => {
        queryClient.setQueryData(
          [RUNS_QUERY_KEY, runType],
          context?.previousRunsData
        );
      },
      // Always refetch after error or success:
      onSettled: () => {
        // queryClient.invalidateQueries([RUNS_QUERY_KEY, runType]);
      },
    }
  );

  const { mutate: performReset } = useMutation(
    async () => {
      setStartedAtTime(Date.now());

      const { data } = await axios.post<SplitRequestBody>(
        `/api/split?runType=${runType}`,
        {
          runId: (runId ?? 0) + 1,
          segmentId: segments[0].id,
          segmentTime: 0,
          isCompleted: false,
        }
      );
      return data;
    },
    {
      onMutate: async () => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries([RUNS_QUERY_KEY, runType]);

        // Snapshot the previous value
        const previousRunsData = queryClient.getQueryData<RunsApiResponse>([
          RUNS_QUERY_KEY,
          runType,
        ]);

        const emptyRunsData = {
          bestOverallTime: 0,
          latestRunSegments: [],
          segmentTimesList: [],
        };

        if (!previousRunsData) {
          return { previousRunsData: emptyRunsData };
        }

        // Optimistically update to the new value
        queryClient.setQueryData<RunsApiResponse>(
          [RUNS_QUERY_KEY, runType],
          (oldRunsData) => {
            if (!oldRunsData) return emptyRunsData;

            return {
              ...oldRunsData,
              latestRunSegments: [
                {
                  runId: (runId ?? 0) + 1,
                  segmentId: segments[0].id,
                  segmentTime: 0,
                  isCompleted: false,
                },
              ],
            };
          }
        );

        // Return a context object with the snapshotted value
        return { previousRunsData };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (
        err,
        newSplit,
        context?: { previousRunsData: RunsApiResponse }
      ) => {
        queryClient.setQueryData(
          [RUNS_QUERY_KEY, runType],
          context?.previousRunsData
        );
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries([RUNS_QUERY_KEY, runType]);
      },
    }
  );

  const start = () => {
    setIsRunning(true);
    setStartedAtTime(Date.now());
  };

  const stop = () => {
    setIsRunning(false);
    performSplit({
      runId,
      segmentId: currentSegmentId!,
      segmentTime,
      isCompleted: false,
    });
  };

  const reset = async () => {
    setIsRunning(false);
    setRunningTime(0);
    performReset();
  };

  const split = () => {
    performSplit({
      runId,
      segmentId: currentSegmentId!,
      segmentTime,
      isCompleted: true,
    });
  };

  const finish = () => {
    split();
    setIsRunning(false);
  };

  const isOnLastSegment = useMemo(() => {
    const lastSegmentId = segments.at(-1)?.id;
    return lastSegmentId ? lastSegmentId === currentSegmentId : false;
  }, [currentSegmentId, segments]);

  const isFinished = useMemo(
    () =>
      latestRunSegments.length === segments.length &&
      latestRunSegments.at(-1)?.isCompleted,
    [latestRunSegments, segments.length]
  );

  return (
    <VerticalDiv>
      <HorizontalDiv>
        {isRunning ? (
          <StopButton onClick={stop}>Stop</StopButton>
        ) : (
          <StartButton disabled={isFinished} onClick={start}>
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
  );
};
