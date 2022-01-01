import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import styled from "styled-components";
import { SplitRequestBody } from "../../pages/api/split";
import { useAppContext } from "../context/AppContext";
import { getDisplayTime } from "../helpers";
import { LargeButton, MediumButton } from "../styles/Buttons";
import { useSegmentsQuery } from "../hooks/useSegmentsQuery";
import { RUNS_QUERY_KEY } from "../constants";
import { useCurrentSegmentId } from "../hooks/useCurrentSegmentId";
import { useRunsData } from "../hooks/useRunsData";
import { RunsApiResponse } from "../../pages/api/runs";
import { RunSegment } from "../types/RunSegment";
import { sumBy } from "lodash";

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
  const { isRunning, setIsRunning, startedAtTime, setStartedAtTime, runType } =
    useAppContext()!;
  const currentSegmentId = useCurrentSegmentId();
  const { latestRunSegments } = useRunsData();
  const { segments } = useSegmentsQuery();

  const currentSegment = useMemo(
    () =>
      latestRunSegments?.find(
        (runSegment) => runSegment.segmentId === currentSegmentId
      ),
    [latestRunSegments, currentSegmentId]
  );

  const [runningTime, setRunningTime] = useState(
    sumBy(latestRunSegments, (r) => r.segmentTime)
  );

  const runId = useMemo(
    () => latestRunSegments?.[0]?.runId,
    [latestRunSegments]
  );

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
  }, [isRunning, startedAtTime]);

  const { mutate: performSplit } = useMutation(
    "split",
    async (newRunSegment: RunSegment) => {
      setStartedAtTime(Date.now());

      const { data } = await axios.post<SplitRequestBody>(
        `/api/split?runType=${runType}`,
        newRunSegment
      );
      return data;
    },
    {
      onMutate: async (newRunSegment) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries([RUNS_QUERY_KEY, runType]);

        // Snapshot the previous value
        const previousRunsData = queryClient.getQueryData([
          RUNS_QUERY_KEY,
          runType,
        ]);

        // Optimistically update to the new value
        queryClient.setQueryData<RunsApiResponse | undefined>(
          [RUNS_QUERY_KEY, runType],
          (old) => {
            if (!old) return old;

            if (currentSegment) {
              return {
                ...old,
                latestRunSegments: old.latestRunSegments.map((r) =>
                  r.segmentId === currentSegmentId ? newRunSegment : r
                ),
              };
            } else {
              return {
                ...old,
                latestRunSegments: [...old.latestRunSegments, newRunSegment],
              };
            }
          }
        );

        // Return a context object with the snapshotted value
        return { previousRunsData };
      },
      onSuccess: (data) => {
        queryClient.setQueryData([RUNS_QUERY_KEY, runType], data);
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, newRunSegment, context: any) => {
        queryClient.setQueryData(
          [RUNS_QUERY_KEY, runType],
          context.previousRunsData
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
      segmentTime: currentSegment?.segmentTime ?? 0,
      isCompleted: false,
    });
  };

  const reset = async () => {
    setIsRunning(false);
    setStartedAtTime(0);
    setRunningTime(0);

    const { data } = await axios.post<SplitRequestBody>(
      `/api/split?runType=${runType}`,
      {
        runId: (runId ?? 0) + 1,
        segmentId: segments[0].id,
        segmentTime: 0,
        isCompleted: false,
      }
    );
    queryClient.setQueryData([RUNS_QUERY_KEY, runType], data);
  };

  const split = () => {
    performSplit({
      runId,
      segmentId: currentSegmentId!,
      segmentTime: currentSegment?.segmentTime ?? 0,
      isCompleted: true,
    });
  };

  const finish = () => {
    split();
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
    </>
  );
};
