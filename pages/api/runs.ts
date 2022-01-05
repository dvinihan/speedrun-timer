import type { NextApiRequest, NextApiResponse } from "next";
import { getRuns } from "../../src/server";
import { SegmentTimes } from "../../src/server/helpers";
import { RunSegment } from "../../src/types/RunSegment";
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

  const runData = await getRuns(db, runType);
  res.json(runData);
};

export default runs;
