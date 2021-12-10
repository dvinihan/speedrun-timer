import type { NextApiRequest, NextApiResponse } from "next";
import { getQueryParamNumber } from "../../src/helpers";
import { RunSegment } from "../../src/types/RunSegment";
import connectToDatabase from "../../src/util/mongodb";

export interface BestSegmentRequest extends NextApiRequest {
  query: {
    segmentId: string;
    currentRunId: string;
  };
}
export interface BestSegmentResponse {
  bestSegmentTime?: number;
}
const bestSegment = async (
  req: BestSegmentRequest,
  res: NextApiResponse<BestSegmentResponse>
) => {
  const db = await connectToDatabase();

  const { segmentId, currentRunId } = req.query;

  if (!segmentId || !currentRunId) {
    res.json({});
    return;
  }

  const matchingSegments = await db
    .collection<RunSegment>("runSegments")
    .find({ segmentId: getQueryParamNumber(segmentId) })
    .toArray();

  const filteredSegments = matchingSegments.filter(
    (runSegment) =>
      runSegment.segmentTime !== 0 &&
      runSegment.isCompleted &&
      runSegment.runId !== getQueryParamNumber(currentRunId)
  );

  if (filteredSegments.length === 0) {
    res.json({});
    return;
  }

  const bestSegmentTime = filteredSegments.reduce(
    (bestTime, runSegment) =>
      runSegment.segmentTime < bestTime ? runSegment.segmentTime : bestTime,
    Number.MAX_VALUE
  );

  res.json({ bestSegmentTime });
};

export default bestSegment;
