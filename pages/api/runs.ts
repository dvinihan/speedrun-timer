import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../src/util/mongodb";

export const getRuns = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();
  const runs = await db.collection("runs").find().toArray();
  res.json(runs);
};

export default getRuns;
