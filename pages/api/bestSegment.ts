import type { NextApiRequest, NextApiResponse } from "next";
import { getQueryParamNumber } from "../../src/helpers";
import { RunSegment } from "../../src/types/RunSegment";
import connectToDatabase from "../../src/util/mongodb";

export interface BestSegmentResponse extends NextApiRequest {
  bestSegmentTime?: number;
}

const bestSegment = async (req: BestSegmentResponse, res: NextApiResponse) => {
  const db = await connectToDatabase();

  const { segmentId, currentRunId } = req.query;

  const matchingSegments = await db
    .collection<RunSegment>("runSegments")
    .find({ segmentId: getQueryParamNumber(segmentId) })
    .toArray();

  if (matchingSegments.length === 0) {
    res.json({});
  }

  const bestSegmentTime = matchingSegments
    .filter(
      (runSegment) =>
        runSegment.segmentTime !== 0 &&
        runSegment.isCompleted &&
        runSegment.runId !== getQueryParamNumber(currentRunId)
    )
    .reduce(
      (bestTime, runSegment) =>
        runSegment.segmentTime < bestTime ? runSegment.segmentTime : bestTime,
      Number.MAX_VALUE
    );

  res.json({ bestSegmentTime });
};

export default bestSegment;
