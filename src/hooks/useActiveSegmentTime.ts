import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { useCurrentSegmentId } from "./useCurrentSegmentId";
import { useRunsData } from "./useRunsData";

export const useActiveSegmentTime = () => {
  const { startedAtTime } = useAppContext()!;
  const { latestRunSegments } = useRunsData();
  const currentSegmentId = useCurrentSegmentId();

  return useMemo(() => {
    const currentSegment = latestRunSegments?.find(
      (runSegment) => runSegment.segmentId === currentSegmentId
    );
    return Date.now() - startedAtTime + (currentSegment?.segmentTime ?? 0);
  }, [currentSegmentId, latestRunSegments, startedAtTime]);
};
