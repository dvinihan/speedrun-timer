import type { NextApiRequest, NextApiResponse } from "next";
import { RunSegment } from "../../src/types/RunSegment";
import connectToDatabase from "../../src/util/mongodb";
import { getLatestRunSegments } from "../../src/helpers/server";

export type RunSegmentsData = {
  latestRunSegments: RunSegment[];
  totalTime: number;
};

const latestRunSegments = async (
  req: NextApiRequest,
  res: NextApiResponse<RunSegmentsData>
) => {
  const db = await connectToDatabase();

  const latestRunSegments = await getLatestRunSegments(db);

  const totalTime = latestRunSegments.reduce(
    (total, runSegment) => total + runSegment.segmentTime,
    0
  );
  res.json({ latestRunSegments, totalTime });
};

export default latestRunSegments;
