import {
  RunType,
  RUN_SEGMENT_COLLECTION_NAME,
  SEGMENT_COLLECTION_NAME,
} from "../../src/constants";
import {
  getBestOverallTime,
  getBestPossibleTime,
  getBestSegmentTimes,
  getCollectionName,
  getOverUnders,
} from "../server/helpers";
import { RunSegment } from "../../src/types/RunSegment";
import { SegmentRow } from "../../src/types/SegmentRow";
import { Db } from "mongodb";

export const getRuns = async (db: Db, runType: string | string[]) => {
  const runSegmentsCollectionName = getCollectionName(
    runType,
    RUN_SEGMENT_COLLECTION_NAME
  );
  const segmentsCollectionName = getCollectionName(
    runType,
    SEGMENT_COLLECTION_NAME
  );

  const [allRunSegments, segments] = await Promise.all([
    db.collection<RunSegment>(runSegmentsCollectionName).find().toArray(),
    db.collection<SegmentRow>(segmentsCollectionName).find().toArray(),
  ]);

  const latestOrCurrentRunId = Math.max(...allRunSegments.map((r) => r.runId));
  const latestOrCurrentRunSegments = allRunSegments.filter(
    (r) => r.runId === latestOrCurrentRunId
  );

  const bestSegmentTimes = getBestSegmentTimes(allRunSegments);

  return {
    bestPossibleTime: getBestPossibleTime(
      segments,
      bestSegmentTimes,
      latestOrCurrentRunSegments
    ),
    bestSegmentTimes,
    bestOverallTime: getBestOverallTime(allRunSegments, segments),
    latestRunSegments: latestOrCurrentRunSegments.map((runSegment: any) => {
      delete runSegment._id;
      return runSegment;
    }),
    overUnders: getOverUnders(
      allRunSegments,
      latestOrCurrentRunId,
      latestOrCurrentRunSegments
    ),
  };
};
