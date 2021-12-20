import { Db } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { RUN_SEGMENT_COLLECTION_NAME } from "../../src/constants";
import { getRuns } from "../../src/server";
import { RunSegment } from "../../src/types/RunSegment";
import connectToDatabase from "../../src/util/mongodb";
import { RunsApiResponse } from "./runs";

export type SplitRequestBody = {
  segmentId: number;
  segmentTime: number;
  runId?: number;
  isCompleted: boolean;
};
interface SplitRequest extends NextApiRequest {
  body: SplitRequestBody;
}

const split = async (
  req: SplitRequest,
  res: NextApiResponse<RunsApiResponse>
) => {
  const db = await connectToDatabase();

  const { runId } = req.body;

  const doesMatchingRunExist = Boolean(
    await db
      .collection(RUN_SEGMENT_COLLECTION_NAME)
      .findOne<RunSegment>({ runId })
  );

  if (doesMatchingRunExist) {
    await updateExistingRun(db, req.body);
  } else {
    await createNewRun(db, req.body);
  }
  const runData = await getRuns();
  res.json(runData);
};

const updateExistingRun = async (db: Db, body: SplitRequestBody) => {
  const { segmentId, segmentTime, isCompleted, runId } = body;

  const matchingSegment = await db
    .collection<RunSegment>(RUN_SEGMENT_COLLECTION_NAME)
    .findOne({ runId, segmentId });

  if (matchingSegment) {
    await updateExistingSegment(db, body);
  } else {
    await createNewSegmentForExistingRun(
      db,
      runId!,
      segmentId,
      segmentTime,
      isCompleted
    );
  }
};

const updateExistingSegment = async (db: Db, body: SplitRequestBody) => {
  const { segmentId, segmentTime, runId, isCompleted } = body;
  await db
    .collection<RunSegment>(RUN_SEGMENT_COLLECTION_NAME)
    .updateOne({ runId, segmentId }, { $set: { segmentTime, isCompleted } });
};

const createNewSegmentForExistingRun = async (
  db: Db,
  runId: number,
  segmentId: number,
  segmentTime: number,
  isCompleted: boolean
) => {
  await db
    .collection<RunSegment>(RUN_SEGMENT_COLLECTION_NAME)
    .insertOne({ segmentId, segmentTime, runId, isCompleted });
};

const createNewRun = async (db: Db, body: SplitRequestBody) => {
  const { segmentId, segmentTime, isCompleted } = body;

  const maxRunIdList = await db
    .collection<RunSegment>(RUN_SEGMENT_COLLECTION_NAME)
    .find()
    .sort({ runId: -1 })
    .limit(1)
    .toArray();
  const maxId = maxRunIdList[0]?.runId ?? 0;
  const newId = maxId + 1;

  await createNewSegmentForExistingRun(
    db,
    newId,
    segmentId,
    segmentTime,
    isCompleted
  );
};

export default split;
