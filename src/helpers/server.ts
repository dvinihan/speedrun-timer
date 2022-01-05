import { groupBy, meanBy, minBy, sumBy } from "lodash";
import { RunType } from "../constants";
import { RunSegment } from "../types/RunSegment";
import { SegmentRow } from "../types/SegmentRow";

export type SegmentTimes = {
  segmentId: number;
  bestPastTime: number;
  averageTime: number;
};

export const getBestOverallTime = (
  segments: SegmentRow[],
  allRunSegments: RunSegment[]
) => {
  const runSegmentsByRunList = Object.values(
    groupBy(allRunSegments, (r) => r.runId)
  );

  const bestTime = runSegmentsByRunList.reduce(
    (bestTime: number, runSegments: RunSegment[]) => {
      const completedRunSegments = runSegments.filter(
        (runSegment) => runSegment.isCompleted && runSegment.segmentTime > 0
      );

      const isRunCompleted = runSegments.length === segments.length;
      if (isRunCompleted) {
        const runTime = sumBy(completedRunSegments, (r) => r.segmentTime);
        return Math.min(runTime, bestTime);
      }
      return bestTime;
    },
    Number.MAX_SAFE_INTEGER
  );

  return bestTime === Number.MAX_SAFE_INTEGER ? 0 : bestTime;
};

export const getCollectionName = (
  inputString: string | string[],
  collectionType: string
) => {
  const runTypeString = Array.isArray(inputString)
    ? inputString[0]
    : inputString;

  const runType =
    Object.values(RunType).find((type) => type === runTypeString) ?? "";
  return `${collectionType}_${runType}`;
};

export const getSegmentTimes = (
  segments: SegmentRow[],
  allRunSegments: RunSegment[],
  latestRunId: number
): SegmentTimes[] => {
  const runSegmentsBySegment = groupBy(allRunSegments, (s) => s.segmentId);

  return segments.map((segment) => {
    const runSegments = runSegmentsBySegment[segment.id.toString()];
    return {
      segmentId: segment.id,
      bestPastTime:
        minBy(
          runSegments.filter(
            (r) => r.segmentTime > 0 && r.runId !== latestRunId
          ),
          (r) => r.segmentTime
        )?.segmentTime ?? 0,
      averageTime: meanBy(runSegments, (r) => r.segmentTime),
    };
  });
};
