import type { NextApiRequest, NextApiResponse } from "next";
import { SEGMENT_COLLECTION_NAME } from "../../src/constants";
import connectToDatabase from "../../src/util/mongodb";

const saveSegment = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  const { id, name } = req.body;

  const matchingSegment = await db
    .collection(SEGMENT_COLLECTION_NAME)
    .findOne({ id });

  if (matchingSegment) {
    await db
      .collection(SEGMENT_COLLECTION_NAME)
      .updateOne({ id }, { $set: { name } });
  } else {
    await db.collection(SEGMENT_COLLECTION_NAME).insertOne({ id, name });
  }

  res.json({});
};

export default saveSegment;
