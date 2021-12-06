import type { NextApiRequest, NextApiResponse } from "next";
import { RUN_SEGMENT_COLLECTION_NAME } from "../../src/constants/mongodb";
import { RunSegment } from "../../src/types/RunSegment";
import connectToDatabase from "../../src/util/mongodb";

export type RunSegmentsData = {
  latestRunSegments: RunSegment[];
  totalTime: number;
};

const getLatestRunSegments = async (
  req: NextApiRequest,
  res: NextApiResponse<RunSegmentsData>
) => {
  const db = await connectToDatabase();

  const runSegments = await db
    .collection<RunSegment>(RUN_SEGMENT_COLLECTION_NAME)
    .find()
    .toArray();

  const latestRunId = runSegments.reduce(
    (max, runSegment) => (runSegment.runId > max ? runSegment.runId : max),
    0
  );
  const latestRunSegments = runSegments.filter(
    (runSegment) => runSegment.runId === latestRunId
  );

  const totalTime = latestRunSegments.reduce(
    (total, runSegment) => total + runSegment.segmentTime,
    0
  );
  res.json({ latestRunSegments, totalTime });
};

export default getLatestRunSegments;
