import { useAppContext } from "../context/AppContext";
import { useCurrentSegmentId } from "./useCurrentSegmentId";

export const useActiveSegmentTime = () => {
  const { currentRunSegments, startedAtTime, isRunning } = useAppContext()!;
  const currentSegmentId = useCurrentSegmentId();

  const currentSegment = currentRunSegments?.find(
    (runSegment) => runSegment.segmentId === currentSegmentId
  );
  return isRunning
    ? Date.now() - startedAtTime + (currentSegment?.segmentTime ?? 0)
    : currentSegment?.segmentTime ?? 0;
};
