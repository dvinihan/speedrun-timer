import { groupBy, minBy, sumBy } from "lodash";
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
  return Object.entries(groupedTimes).map(([runId, runSegments]) => ({
    segmentId: parseInt(runId),
    time: Math.min(...runSegments.map((r) => r.segmentTime)),
  }));
};

export const getBestPossibleTime = (
  segments: SegmentRow[],
  bestSegmentTimes: RunSegmentTime[],
  latestRunSegments: RunSegment[]
) => {
  let finishedSegmentsTotalTime = 0;
  let unfinishedSegmentsTotalBestTime = 0;

  segments.forEach((segment) => {
    const runSegment = latestRunSegments.find(
      (r) => r.segmentId === segment.id
    );

    if (!runSegment || !runSegment.isCompleted) {
      const bestSegmentTime = bestSegmentTimes.find(
        (r) => r.segmentId === segment.id
      );
      unfinishedSegmentsTotalBestTime += bestSegmentTime?.time ?? 0;
    } else {
      finishedSegmentsTotalTime += runSegment.segmentTime;
    }
  });

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
): RunSegmentTime[] => {
  const allPastRunSegments = allRunSegments.filter(
    (runSegment) =>
      runSegment.runId !== latestOrCurrentRunId && runSegment.isCompleted
  );

  return latestOrCurrentRunSegments.reduce(
    (agg: RunSegmentTime[], runSegment) => {
      const pastRunSegments = allPastRunSegments.filter(
        (r) => r.segmentId === runSegment.segmentId
      );
      const bestPastSegment = minBy(pastRunSegments, (r) => r.segmentTime);
      const diff = runSegment.segmentTime - (bestPastSegment?.segmentTime ?? 0);
      return [...agg, { segmentId: runSegment.segmentId, time: diff }];
    },
    []
  );
};
