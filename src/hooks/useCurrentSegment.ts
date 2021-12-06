import { useMemo } from "react";
import { useCurrentSegmentId } from "./useCurrentSegmentId";
import { useRunSegments } from "./useRunSegments";

export const useCurrentSegment = () => {
  const runSegments = useRunSegments();
  const currentSegmentId = useCurrentSegmentId();
  return useMemo(
    () =>
      runSegments.find(
        (runSegment) => runSegment.segmentId === currentSegmentId
      ),
    [currentSegmentId, runSegments]
  );
};
