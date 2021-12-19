import { useAppContext } from "../context/AppContext";
import { useRunsData } from "./useRunsData";

export const useActiveSegmentTime = () => {
  const { startedAtTime } = useAppContext()!;
  const { currentSegmentId, latestRunSegments } = useRunsData();

  const currentSegment = latestRunSegments?.find(
    (runSegment) => runSegment.segmentId === currentSegmentId
  );

  return Date.now() - startedAtTime + (currentSegment?.segmentTime ?? 0);
};
