import type { NextApiRequest, NextApiResponse } from "next";
import {
  getBestOverallTime,
  getBestPossibleTime,
  getBestSegmentTimes,
} from "../../src/helpers/server";
import connectToDatabase from "../../src/util/mongodb";

interface StatsApiRequest extends NextApiRequest {
  query: {
    currentSegmentId: string;
  };
}

export interface StatsApiResponse {
  sumOfBestSegmentsTime: number;
  bestPossibleTime: number;
  bestOverallTime: number;
}

const stats = async (
  req: StatsApiRequest,
  res: NextApiResponse<StatsApiResponse>
) => {
  const db = await connectToDatabase();

  const { currentSegmentId } = req.query;

  const bestSegmentTimesMap = await getBestSegmentTimes(db);
  const bestPossibleTime = await getBestPossibleTime(db, currentSegmentId);

  const sobsTime = Object.values(bestSegmentTimesMap).reduce(
    (total, time) => total + time,
    0
  );
  const bestOverallTime = await getBestOverallTime(db);

  res.json({
    sumOfBestSegmentsTime: sobsTime,
    bestPossibleTime,
    bestOverallTime,
  });
};

export default stats;
