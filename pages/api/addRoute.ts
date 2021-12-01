import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../src/util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  const { name, segments } = req.body;

  await db.collection("speedruns").insertOne({ name, segments });
  res.json({});
};
