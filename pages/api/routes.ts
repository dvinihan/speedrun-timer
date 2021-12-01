import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "../../src/util/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();
  const routes = await db.collection("speedruns").find().toArray();
  res.json(routes);
};
