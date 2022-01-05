import {
  RUN_SEGMENT_COLLECTION_NAME,
  SEGMENT_COLLECTION_NAME,
} from "../../src/constants";
import {
  getBestOverallTime,
  getCollectionName,
  getSegmentTimes,
} from "../server/helpers";
import { RunSegment } from "../../src/types/RunSegment";
import { SegmentRow } from "../../src/types/SegmentRow";
import { Db } from "mongodb";
import { groupBy } from "lodash";
import { RunsApiResponse } from "../../pages/api/runs";

export const getRuns = async (
  db: Db,
  runType: string | string[]
): Promise<RunsApiResponse> => {
  const runSegmentsCollectionName = getCollectionName(
    runType,
    RUN_SEGMENT_COLLECTION_NAME
  );
  const segmentsCollectionName = getCollectionName(
    runType,
    SEGMENT_COLLECTION_NAME
  );

  const [allRunSegmentDocuments, segmentDocuments] = await Promise.all([
    db.collection<RunSegment>(runSegmentsCollectionName).find().toArray(),
    db.collection<SegmentRow>(segmentsCollectionName).find().toArray(),
  ]);
  const allRunSegments = allRunSegmentDocuments.map((d) => new RunSegment(d));
  const segments = segmentDocuments.map((d) => new SegmentRow(d));

  const latestRunId = Math.max(...allRunSegments.map((r) => r.runId));
  const latestRunSegments = allRunSegments.filter(
    (r) => r.runId === latestRunId
  );

  return {
    bestOverallTime: getBestOverallTime(allRunSegments),
    latestRunSegments,
    segmentTimesList: getSegmentTimes(segments, allRunSegments, latestRunId),
  };
};
