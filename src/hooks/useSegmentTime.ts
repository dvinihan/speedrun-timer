import { useAppContext } from "../context/AppContext";
import { useCurrentSegment } from "./useCurrentSegment";

export const useSegmentTime = () => {
  const { startedAtTime } = useAppContext()!;
  const currentSegment = useCurrentSegment();

  return Date.now() - startedAtTime + (currentSegment?.segmentTime ?? 0);
};
