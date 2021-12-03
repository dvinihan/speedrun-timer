import type { NextApiRequest, NextApiResponse } from "next";
import { Run } from "../../src/types/Run";
import connectToDatabase from "../../src/util/mongodb";

export const split = async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  const { segmentId, accruedTime, runId } = req.body;

  const matchingRun = await db.collection("runs").findOne<Run>({ id: runId });

  if (matchingRun) {
    const previousSegment = matchingRun.segments.slice(-1)[0];
    const previousSegmentAccruedTime = previousSegment.accruedTime;

    const segmentTime = accruedTime - previousSegmentAccruedTime;
    await db.collection("runs").updateOne(
      { id: runId },
      {
        $push: {
          segments: { id: segmentId, segmentTime, accruedTime },
        },
      }
    );

    res.json({ runId });
  } else {
    const maxIdDocumentList = await db
      .collection("runs")
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    const maxId = maxIdDocumentList[0] ? maxIdDocumentList[0].id : 0;
    const newId = maxId + 1;

    await db.collection("runs").insertOne({
      id: maxId + 1,
      segments: [{ id: segmentId, segmentTime: accruedTime, accruedTime }],
    });

    res.json({ runId: newId });
  }
};

export default split;
