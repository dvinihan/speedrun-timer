export type Run = {
  id: number;
  segments: RunSegment[];
};

export type RunSegment = {
  id: number;
  segmentTime: number;
  accruedTime: number;
};
