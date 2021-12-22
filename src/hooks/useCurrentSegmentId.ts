import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";

export const useCurrentSegmentId = () => {
  const { currentRunSegments = [] } = useAppContext()!;

  return useMemo(() => {
    if (currentRunSegments.length === 0) {
      return 1;
    }
    const maxSegmentId = Math.max(
      ...currentRunSegments.map((r) => r.segmentId)
    );
    return currentRunSegments.every((r) => r.isCompleted)
      ? maxSegmentId + 1
      : maxSegmentId;
  }, [currentRunSegments]);
};
