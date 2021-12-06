import { useMemo } from "react";
import { useRunSegments } from "./useRunSegments";

export const useRunId = () => {
  const runSegments = useRunSegments();

  return useMemo(() => {
    if (runSegments.length === 0) {
      return;
    }
    return runSegments.reduce(
      (latestSoFar, runSegment) =>
        runSegment.runId <= latestSoFar ? latestSoFar : runSegment.runId,
      0
    );
  }, [runSegments]);
};
