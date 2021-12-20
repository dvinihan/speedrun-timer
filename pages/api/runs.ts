import type { NextApiRequest, NextApiResponse } from "next";
import { getRuns } from "../../src/server";
import { RunSegmentTime } from "../../src/server/helpers";
import { RunSegment } from "../../src/types/RunSegment";

export interface RunsApiResponse {
  bestPossibleTime: number;
  bestSegmentTimes: RunSegmentTime[];
  bestOverallTime: number;
  latestRunSegments: RunSegment[];
  overUnders: RunSegmentTime[];
}

const runs = async (
  req: NextApiRequest,
  res: NextApiResponse<RunsApiResponse>
) => {
  const runData = await getRuns();
  res.json(runData);
};

export default runs;
