import { groupBy, sumBy } from "lodash";
import { SEGMENT_ID_KEY, SEGMENT_TIME_KEY } from "../constants";
import { RunSegment } from "../types/RunSegment";
import { SegmentRow } from "../types/SegmentRow";

export interface RunSegmentTime {
  segmentId: number;
  time: number;
}

export const getBestSegmentTimes = (
  allRunSegments: RunSegment[]
): RunSegmentTime[] => {
  const completedRunSegments = allRunSegments.filter(
    (runSegment) => runSegment.isCompleted && runSegment.segmentTime > 0
  );
  const groupedTimes = groupBy(
    completedRunSegments,
    (runSegment) => runSegment.segmentId
  );
  return Object.entries(groupedTimes).map(([key, value]) => ({
    segmentId: parseInt(key),
    time: getMinKeyFromObjects(value, SEGMENT_TIME_KEY),
  }));
};

export const getBestPossibleTime = (
  segments: SegmentRow[],
  bestSegmentTimes: RunSegmentTime[],
  latestRunSegments: RunSegment[],
  currentSegmentId?: number
) => {
  const currentSegmentIdIndex =
    segments.findIndex((segment) => segment.id === currentSegmentId) ??
    Number.MAX_VALUE;
  const finishedSegments = segments.slice(0, currentSegmentIdIndex);
  const unfinishedSegments = segments.slice(currentSegmentIdIndex);

  const finishedSegmentsTotalTime = finishedSegments.reduce(
    (total, segment) => {
      const latestRunSegment = latestRunSegments.find(
        (runSegment) => runSegment.segmentId === segment.id
      );
      const latestSegmentTime = latestRunSegment?.segmentTime ?? 0;
      return total + latestSegmentTime;
    },
    0
  );
  const unfinishedSegmentsTotalBestTime = unfinishedSegments.reduce(
    (total, segment) => {
      const bestSegmentTime = bestSegmentTimes.find(
        (runSegmentTime) => runSegmentTime.segmentId === segment.id
      );
      return total + (bestSegmentTime?.time ?? 0);
    },
    0
  );

  return finishedSegmentsTotalTime + unfinishedSegmentsTotalBestTime;
};

export const getBestOverallTime = (
  allRunSegments: RunSegment[],
  segments: SegmentRow[]
) => {
  const segmentCount = segments.length;

  const completedRunSegments = allRunSegments.filter(
    (runSegment) => runSegment.isCompleted && runSegment.segmentTime > 0
  );

  const groupedRunSegments = groupBy(
    completedRunSegments,
    (runSegment) => runSegment.runId
  );

  const completedRunTimes = Object.values(groupedRunSegments)
    .filter((runSegmentList) => runSegmentList.length === segmentCount)
    .map((runSegmentList) =>
      sumBy(runSegmentList, (runSegment) => runSegment.segmentTime)
    );

  return Math.min(...completedRunTimes);
};

export const getOverUnders = (
  allRunSegments: RunSegment[],
  latestOrCurrentRunId: number,
  latestOrCurrentRunSegments: RunSegment[]
) => {
  const pastRunSegments = allRunSegments.filter(
    (runSegment) => runSegment.runId !== latestOrCurrentRunId
  );
  return latestOrCurrentRunSegments.reduce(
    (agg: RunSegmentTime[], runSegment) => {
      const bestPastTime = Math.min(
        ...pastRunSegments
          .filter((rs) => rs.segmentId === runSegment.segmentId)
          .map((rs) => rs.segmentTime)
      );
      const diff = runSegment.segmentTime - bestPastTime;
      return [...agg, { segmentId: runSegment.segmentId, time: diff }];
    },
    []
  );
};

export const getCurrentSegmentId = (latestOrCurrentRunSegments: RunSegment[]) =>
  latestOrCurrentRunSegments.every((runSegment) => runSegment.isCompleted)
    ? undefined
    : getMaxKeyFromObjects(latestOrCurrentRunSegments, SEGMENT_ID_KEY);

export const getMinKeyFromObjects = (array: any[], key: string): number =>
  array.reduce(
    (min, currentObject) => Math.min(currentObject[key], min),
    Number.MAX_VALUE
  );

export const getMaxKeyFromObjects = (array: any[], key: string): number =>
  array.reduce((max, currentObject) => Math.max(currentObject[key], max), 0);
