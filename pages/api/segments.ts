import type { NextApiRequest, NextApiResponse } from "next";
import { SEGMENT_COLLECTION_NAME } from "../../src/constants";
import connectToDatabase from "../../src/util/mongodb";

const getSegments = async (req: NextApiRequest, res: NextApiResponse) => {
  const { runType } = req.query;

  const db = await connectToDatabase(runType);

  const segments = await db
    .collection(SEGMENT_COLLECTION_NAME)
    .find()
    .toArray();

  res.json(
    segments.map((segment: any) => {
      delete segment._id;
      return segment;
    })
  );
};

export default getSegments;
