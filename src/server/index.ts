import {
  RUN_SEGMENT_COLLECTION_NAME,
  SEGMENT_COLLECTION_NAME,
} from "../../src/constants";
import {
  getBestOverallTime,
  getBestPossibleTime,
  getBestSegmentTimes,
  getOverUnders,
} from "../server/helpers";
import { RunSegment } from "../../src/types/RunSegment";
import { SegmentRow } from "../../src/types/SegmentRow";
import connectToDatabase from "../../src/util/mongodb";

export const getRuns = async () => {
  const db = await connectToDatabase();

  const [allRunSegments, segments] = await Promise.all([
    db.collection<RunSegment>(RUN_SEGMENT_COLLECTION_NAME).find().toArray(),
    db.collection<SegmentRow>(SEGMENT_COLLECTION_NAME).find().toArray(),
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
