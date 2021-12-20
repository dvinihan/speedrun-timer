import type { NextApiRequest, NextApiResponse } from "next";
import { SEGMENT_COLLECTION_NAME } from "../../src/constants";
import connectToDatabase from "../../src/util/mongodb";

const deleteSegment = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, runType } = req.query;

  const db = await connectToDatabase(runType);

  const singleId = typeof id === "string" ? id : id[0];
  const idQuery = Number.parseInt(singleId, 10);

  const matchingSegment = await db
    .collection(SEGMENT_COLLECTION_NAME)
    .findOne({ id: idQuery });

  if (matchingSegment) {
    await db.collection(SEGMENT_COLLECTION_NAME).deleteOne({ id: idQuery });
  }

  res.json({});
};

export default deleteSegment;
