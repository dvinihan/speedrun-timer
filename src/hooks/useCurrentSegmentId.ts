import { useMemo } from "react";
import { useRunsData } from "./useRunsData";

export const useCurrentSegmentId = () => {
  const { latestRunSegments = [] } = useRunsData();

  return useMemo(() => {
    const maxSegmentId = Math.max(...latestRunSegments.map((r) => r.segmentId));
    return latestRunSegments.every((r) => r.isCompleted)
      ? maxSegmentId + 1
      : maxSegmentId;
  }, [latestRunSegments]);
};
