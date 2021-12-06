import { SegmentRow } from "../types/SegmentRow";

export const getNextSegmentId = (
  segments: SegmentRow[],
  currentSegmentId: number
): number | undefined => {
  const currentSegmentIndex = segments.findIndex(
    (s) => s.id === currentSegmentId
  );
  const nextSegmentIndex = currentSegmentIndex + 1;
  const nextSegment = segments[nextSegmentIndex];
  return nextSegment?.id;
};

export const getDisplayTime = (time?: number) => {
  if (time === undefined) {
    return "--";
  }
  const hours = ("0" + Math.floor((time / 3600000) % 60)).slice(-2);
  const minutes = ("0" + Math.floor((time / 60000) % 60)).slice(-2);
  const seconds = ("0" + Math.floor((time / 1000) % 60)).slice(-2);
  const deciSeconds = Math.floor(time / 100) % 10;

  return `${hours}:${minutes}:${seconds}:${deciSeconds}`;
};
