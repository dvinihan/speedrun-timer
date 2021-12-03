import { Segment } from "../types/Segment";

export const getNextSegmentId = (
  segments: Segment[],
  currentSegmentId: number
) => {
  const sortedSegments = segments.sort((s) => s.id);
  const currentSegmentIndex = sortedSegments.findIndex(
    (s) => s.id === currentSegmentId
  );
  const nextSegmentIndex = currentSegmentIndex + 1;
  const nextSegment = sortedSegments[nextSegmentIndex];
  return nextSegment.id;
};
