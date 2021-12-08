import { Db } from "mongodb";
import { RUN_SEGMENT_COLLECTION_NAME } from "../constants/mongodb";
import { RunSegment } from "../types/RunSegment";

interface GroupedRunSegmentTimes {
  [key: number]: number;
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
