import type { NextApiRequest, NextApiResponse } from "next";
import { RUN_SEGMENT_COLLECTION_NAME } from "../../src/constants/mongodb";
import { RunSegment } from "../../src/types/RunSegment";
import connectToDatabase from "../../src/util/mongodb";

export type RunSegmentsData = {
  runSegments: RunSegment[];
  totalTime: number;
};

const getRunSegments = async (
  req: NextApiRequest,
  res: NextApiResponse<RunSegmentsData>
) => {
  const db = await connectToDatabase();

  const { runId } = req.body;

  const findQuery = runId ? { runId } : {};

  const runSegments = await db
    .collection<RunSegment>(RUN_SEGMENT_COLLECTION_NAME)
    .find(findQuery)
    .toArray();

  const totalTime = runSegments.reduce(
    (total, runSegment) => total + runSegment.segmentTime,
    0
  );
  res.json({ runSegments, totalTime });
};

export default getRunSegments;
