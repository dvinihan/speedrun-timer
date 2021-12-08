import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../src/util/mongodb";

const deleteSegment = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  const { id } = req.query;

  const singleId = typeof id === "string" ? id : id[0];
  const idQuery = Number.parseInt(singleId, 10);

  const matchingSegment = await db
    .collection("segments")
    .findOne({ id: idQuery });

  if (matchingSegment) {
    await db.collection("segments").deleteOne({ id: idQuery });
  }

  res.json({});
};

export default deleteSegment;
