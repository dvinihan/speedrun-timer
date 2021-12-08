import type { NextApiRequest, NextApiResponse } from "next";
import { getBestSegmentTimes } from "../../src/helpers/server";
import connectToDatabase from "../../src/util/mongodb";

const sumOfBestSegments = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  const bestSegmentTimesMap = await getBestSegmentTimes(db);

  const sobsTime = Object.values(bestSegmentTimesMap).reduce(
    (total, time) => total + time,
    0
  );

  res.json({ sumOfBestSegmentsTime: sobsTime });
};

export default sumOfBestSegments;
