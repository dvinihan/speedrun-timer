import { useAppContext } from "../context/AppContext";
import { useCurrentSegmentId } from "./useCurrentSegmentId";

export const useActiveSegmentTime = () => {
  const { currentRunSegments, startedAtTime } = useAppContext()!;
  const currentSegmentId = useCurrentSegmentId();

  const currentSegment = currentRunSegments?.find(
    (runSegment) => runSegment.segmentId === currentSegmentId
  );
  return Date.now() - startedAtTime + (currentSegment?.segmentTime ?? 0);
};
