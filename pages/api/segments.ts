import type { NextApiRequest, NextApiResponse } from "next";
import { SEGMENT_COLLECTION_NAME } from "../../src/constants/mongodb";
import connectToDatabase from "../../src/util/mongodb";

const getSegments = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();
  const segments = await db
    .collection(SEGMENT_COLLECTION_NAME)
    .find()
    .toArray();
  res.json(segments);
};

export default getSegments;
