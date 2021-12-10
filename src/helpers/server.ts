import { Db } from "mongodb";
import { getQueryParamNumber } from ".";
import {
  RUN_SEGMENT_COLLECTION_NAME,
  SEGMENT_COLLECTION_NAME,
} from "../constants/mongodb";
import { RunSegment } from "../types/RunSegment";
import { SegmentRow } from "../types/SegmentRow";

interface GroupedRunSegmentTimes {
  [key: number]: number;
}

interface GroupedBestRunTimes {
  [key: number]: {
    time: number;
    numberOfSegments: number;
  };
}

const getAllRunSegments = async (db: Db) => {
  return await db.collection<RunSegment>("runSegments").find().toArray();
};

export const getBestSegmentTimes = async (db: Db) => {
  const allRunSegments = await getAllRunSegments(db);

  return allRunSegments
    .filter(
      (runSegment) => runSegment.isCompleted && runSegment.segmentTime > 0
    )
    .reduce((aggregator, runSegment) => {
      const currentBestSegmentTime = aggregator[runSegment.segmentId];
      if (
        !currentBestSegmentTime ||
        runSegment.segmentTime < currentBestSegmentTime
      ) {
        return {
          ...aggregator,
          [runSegment.segmentId]: runSegment.segmentTime,
        };
      }
      return aggregator;
    }, {} as GroupedRunSegmentTimes);
};

export const getBestPossibleTime = async (db: Db, currentSegmentId: string) => {
  const segments = await db
    .collection<SegmentRow>(SEGMENT_COLLECTION_NAME)
    .find()
    .toArray();
  const currentSegmentIdIndex = segments.findIndex(
    (segment) => segment.id === getQueryParamNumber(currentSegmentId)
  );
  const finishedSegments = segments.slice(0, currentSegmentIdIndex);
  const unfinishedSegments = segments.slice(currentSegmentIdIndex);

  const latestRunSegments = await getLatestRunSegments(db);
  const bestSegmentTimesMap = await getBestSegmentTimes(db);

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
      const bestSegmentTime = bestSegmentTimesMap[segment.id];
      return total + bestSegmentTime;
    },
    0
  );

  return finishedSegmentsTotalTime + unfinishedSegmentsTotalBestTime;
};

export const getLatestRunSegments = async (db: Db) => {
  const runSegments = await db
    .collection<RunSegment>(RUN_SEGMENT_COLLECTION_NAME)
    .find()
    .toArray();

  const latestRunId = runSegments.reduce(
    (max, runSegment) => (runSegment.runId > max ? runSegment.runId : max),
    0
  );
  return runSegments.filter((runSegment) => runSegment.runId === latestRunId);
};

export const getBestOverallTime = async (db: Db) => {
  const runSegments = await db
    .collection<RunSegment>(RUN_SEGMENT_COLLECTION_NAME)
    .find()
    .toArray();

  const segmentCount = await db
    .collection<SegmentRow>(SEGMENT_COLLECTION_NAME)
    .find()
    .count();

  const runTimes = runSegments
    .filter(
      (runSegment) => runSegment.isCompleted && runSegment.segmentTime > 0
    )
    .reduce((aggregator, runSegment) => {
      const { time = 0, numberOfSegments = 0 } =
        aggregator[runSegment.runId] ?? {};
      return {
        ...aggregator,
        [runSegment.runId]: {
          time: runSegment.segmentTime + time,
          numberOfSegments: numberOfSegments + 1,
        },
      };
    }, {} as GroupedBestRunTimes);

  const bestRunTime = Object.values(runTimes)
    .filter((runTimeData) => runTimeData.numberOfSegments === segmentCount)
    .reduce(
      (min, runTimeData) => Math.min(runTimeData.time, min),
      Number.MAX_VALUE
    );

  return bestRunTime;
};
