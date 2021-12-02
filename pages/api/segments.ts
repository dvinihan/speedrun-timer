import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../src/util/mongodb";

export const getSegments = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const db = await connectToDatabase();
  const segments = await db.collection("segments").find().toArray();
  res.json(segments);
};

export default getSegments;
