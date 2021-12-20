import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";

export const useCurrentSegmentId = () => {
  const { currentRunSegments = [] } = useAppContext()!;

  return useMemo(() => {
    const maxSegmentId = Math.max(
      ...currentRunSegments.map((r) => r.segmentId)
    );
    return currentRunSegments.every((r) => r.isCompleted)
      ? maxSegmentId + 1
      : maxSegmentId;
  }, [currentRunSegments]);
};
