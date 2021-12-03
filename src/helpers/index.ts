import { SegmentRow } from "../types/SegmentRow";

export const getNextSegmentId = (
  segments: SegmentRow[],
  currentSegmentId: number
): number | undefined => {
  const sortedSegments = segments.sort((s) => s.id);
  const currentSegmentIndex = sortedSegments.findIndex(
    (s) => s.id === currentSegmentId
  );
  const nextSegmentIndex = currentSegmentIndex + 1;
  const nextSegment = sortedSegments[nextSegmentIndex];
  return nextSegment?.id;
};
