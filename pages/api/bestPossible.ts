import type { NextApiRequest, NextApiResponse } from "next";
import { SEGMENT_COLLECTION_NAME } from "../../src/constants/mongodb";
import { getQueryParamNumber } from "../../src/helpers";
import {
  getBestSegmentTimes,
  getLatestRunSegments,
} from "../../src/helpers/server";
import { SegmentRow } from "../../src/types/SegmentRow";
import connectToDatabase from "../../src/util/mongodb";

export interface BestPossibleRequest extends NextApiRequest {
  query: {
    currentSegmentId: string;
    currentRunId: string;
  };
}

const bestSegment = async (req: BestPossibleRequest, res: NextApiResponse) => {
  const db = await connectToDatabase();

  const { currentSegmentId, currentRunId } = req.query;

  if (!currentRunId) {
    res.json({});
    return;
  }

  const segments = await db
    .collection<SegmentRow>(SEGMENT_COLLECTION_NAME)
    .find()
    .toArray();
  const currentSegmentIdIndex = segments.findIndex(
    (segment) => segment.id === getQueryParamNumber(currentSegmentId)
  );
  const finishedSegments = segments.slice(0, currentSegmentIdIndex);
  const unfinishedSegments = segments.slice(currentSegmentIdIndex);

  const latestRunSegments = await getLatestRunSegments(db);
  const bestSegmentTimesMap = await getBestSegmentTimes(db);

  const finishedSegmentsTotalTime = finishedSegments.reduce(
    (total, segment) => {
      const latestRunSegment = latestRunSegments.find(
        (runSegment) => runSegment.segmentId === segment.id
      );
      const latestSegmentTime = latestRunSegment?.segmentTime ?? 0;
      return total + latestSegmentTime;
    },
    0
  );
  const unfinishedSegmentsTotalBestTime = unfinishedSegments.reduce(
    (total, segment) => {
      const bestSegmentTime = bestSegmentTimesMap[segment.id];
      return total + bestSegmentTime;
    },
    0
  );

  const bestPossibleTime =
    finishedSegmentsTotalTime + unfinishedSegmentsTotalBestTime;

  res.json({ bestPossibleTime });
};

export default bestSegment;
