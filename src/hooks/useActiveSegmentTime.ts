import { useAppContext } from "../context/AppContext";
import { useCurrentSegmentId } from "./useCurrentSegmentId";
import { useRunsData } from "./useRunsData";

export const useActiveSegmentTime = () => {
  const { startedAtTime, isRunning } = useAppContext()!;
  const currentSegmentId = useCurrentSegmentId();
  const { latestRunSegments } = useRunsData();

  const currentSegment = latestRunSegments?.find(
    (runSegment) => runSegment.segmentId === currentSegmentId
  );
  return isRunning
    ? Date.now() - startedAtTime + (currentSegment?.segmentTime ?? 0)
    : currentSegment?.segmentTime ?? 0;
};
