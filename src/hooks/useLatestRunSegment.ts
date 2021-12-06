import { useMemo } from "react";
import { useRunSegments } from "./useRunSegments";

export const useLatestRunSegment = () => {
  const runSegments = useRunSegments();

  return useMemo(() => {
    if (runSegments.length === 0) {
      return;
    }
    return runSegments.reduce((latestSoFar, runSegment) =>
      latestSoFar && runSegment.segmentId <= latestSoFar.segmentId
        ? latestSoFar
        : runSegment
    );
  }, [runSegments]);
};
