import { sumBy } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  RUN_ID_KEY,
  RUN_SEGMENT_COLLECTION_NAME,
  SEGMENT_COLLECTION_NAME,
} from "../../src/constants";
import {
  getBestOverallTime,
  getBestPossibleTime,
  getBestSegmentTimes,
  getCurrentSegmentId,
  getMaxKeyFromObjects,
  getOverUnders,
  RunSegmentTime,
} from "../../src/helpers/server";
import { RunSegment } from "../../src/types/RunSegment";
import { SegmentRow } from "../../src/types/SegmentRow";
import connectToDatabase from "../../src/util/mongodb";

export interface RunsApiResponse {
  sumOfBestSegmentsTime: number;
  bestPossibleTime: number;
  bestSegmentTimes: RunSegmentTime[];
  bestOverallTime: number;
  totalTime: number;
  latestRunSegments: RunSegment[];
  currentSegmentId?: number;
  overUnders: RunSegmentTime[];
}

const runs = async (
  req: NextApiRequest,
  res: NextApiResponse<RunsApiResponse>
) => {
  const db = await connectToDatabase();

  const [allRunSegments, segments] = await Promise.all([
    db.collection<RunSegment>(RUN_SEGMENT_COLLECTION_NAME).find().toArray(),
    db.collection<SegmentRow>(SEGMENT_COLLECTION_NAME).find().toArray(),
  ]);

  const latestOrCurrentRunId = getMaxKeyFromObjects(allRunSegments, RUN_ID_KEY);
  const latestOrCurrentRunSegments = allRunSegments.filter(
    (runSegment) => runSegment.runId === latestOrCurrentRunId
  );

  const currentSegmentId = getCurrentSegmentId(latestOrCurrentRunSegments);
  const bestSegmentTimes = getBestSegmentTimes(allRunSegments);

  res.json({
    sumOfBestSegmentsTime: sumBy(bestSegmentTimes, (r) => r.time),
    bestPossibleTime: getBestPossibleTime(
      segments,
      bestSegmentTimes,
      latestOrCurrentRunSegments,
      currentSegmentId
    ),
    bestSegmentTimes,
    bestOverallTime: getBestOverallTime(allRunSegments, segments),
    totalTime: sumBy(latestOrCurrentRunSegments, (r) => r.segmentTime),
    latestRunSegments: latestOrCurrentRunSegments.map((runSegment: any) => {
      delete runSegment._id;
      return runSegment;
    }),
    currentSegmentId,
    overUnders: getOverUnders(
      allRunSegments,
      latestOrCurrentRunId,
      latestOrCurrentRunSegments
    ),
  });
};

export default runs;
