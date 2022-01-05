import type { NextApiRequest, NextApiResponse } from "next";
import {
  RUN_SEGMENT_COLLECTION_NAME,
  SEGMENT_COLLECTION_NAME,
} from "../../src/constants";
import {
  getBestOverallTime,
  getCollectionName,
  getSegmentTimes,
  SegmentTimes,
} from "../../src/helpers/server";
import { RunSegment } from "../../src/types/RunSegment";
import { SegmentRow } from "../../src/types/SegmentRow";
import connectToDatabase from "../../src/util/mongodb";

export interface RunsApiResponse {
  bestOverallTime: number;
  latestRunSegments: RunSegment[];
  segmentTimesList: SegmentTimes[];
}

const runs = async (
  req: NextApiRequest,
  res: NextApiResponse<RunsApiResponse>
) => {
  const { runType } = req.query;

  const db = await connectToDatabase();

  const runSegmentsCollectionName = getCollectionName(
    runType,
    RUN_SEGMENT_COLLECTION_NAME
  );
  const segmentsCollectionName = getCollectionName(
    runType,
    SEGMENT_COLLECTION_NAME
  );

  const [allRunSegmentDocuments, segmentDocuments] = await Promise.all([
    db.collection<RunSegment>(runSegmentsCollectionName).find().toArray(),
    db.collection<SegmentRow>(segmentsCollectionName).find().toArray(),
  ]);
  const allRunSegments = allRunSegmentDocuments.map((d) => new RunSegment(d));
  const segments = segmentDocuments.map((d) => new SegmentRow(d));

  const latestRunId = Math.max(...allRunSegments.map((r) => r.runId));
  const latestRunSegments = allRunSegments.filter(
    (r) => r.runId === latestRunId
  );

  res.json({
    bestOverallTime: getBestOverallTime(segments, allRunSegments),
    latestRunSegments,
    segmentTimesList: getSegmentTimes(segments, allRunSegments, latestRunId),
  });
};

export default runs;
