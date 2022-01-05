import type { NextApiRequest, NextApiResponse } from "next";
import { SEGMENT_COLLECTION_NAME } from "../../src/constants";
import { getCollectionName } from "../../src/helpers/server";
import connectToDatabase from "../../src/util/mongodb";

const saveSegment = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, name } = req.body;
  const { runType } = req.query;

  const db = await connectToDatabase();
  const collectionName = getCollectionName(runType, SEGMENT_COLLECTION_NAME);

  const matchingSegment = await db.collection(collectionName).findOne({ id });

  if (matchingSegment) {
    await db.collection(collectionName).updateOne({ id }, { $set: { name } });
  } else {
    await db.collection(collectionName).insertOne({ id, name });
  }

  res.json({});
};

export default saveSegment;
