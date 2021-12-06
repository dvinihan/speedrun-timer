import { getNextSegmentId } from "../helpers";
import { useLatestRunSegment } from "./useLatestRunSegment";
import { useSegments } from "./useSegments";

export const useCurrentSegmentId = () => {
  const segments = useSegments();
  const latestRunSegment = useLatestRunSegment();

  if (segments.length === 0) {
    return;
  }

  if (!latestRunSegment) {
    // if there are no segments logged in this run, start at the first segment
    return segments[0].id;
  }

  if (!latestRunSegment.isCompleted) {
    return latestRunSegment.segmentId;
  }

  return getNextSegmentId(segments, latestRunSegment.segmentId);
};
