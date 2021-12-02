import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../src/util/mongodb";

export const saveSegment = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const db = await connectToDatabase();

  const { id, name } = req.body;

  const matchingSegment = await db.collection("segments").findOne({ id });

  if (matchingSegment) {
    await db.collection("segments").updateOne({ id }, { $set: { name } });
  } else {
    await db.collection("segments").insertOne({ id, name });
  }

  res.json({});
};

export default saveSegment;
