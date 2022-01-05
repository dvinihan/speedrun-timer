import type { NextApiRequest, NextApiResponse } from "next";
import { SEGMENT_COLLECTION_NAME } from "../../src/constants";
import { getCollectionName } from "../../src/helpers/server";
import connectToDatabase from "../../src/util/mongodb";

const deleteSegment = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, runType } = req.query;

  const db = await connectToDatabase();
  const collectionName = getCollectionName(runType, SEGMENT_COLLECTION_NAME);

  const singleId = typeof id === "string" ? id : id[0];
  const idQuery = Number.parseInt(singleId, 10);

  const matchingSegment = await db
    .collection(collectionName)
    .findOne({ id: idQuery });

  if (matchingSegment) {
    await db.collection(collectionName).deleteOne({ id: idQuery });
  }

  res.json({});
};

export default deleteSegment;
