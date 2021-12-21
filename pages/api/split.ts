import { Db } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { RUN_SEGMENT_COLLECTION_NAME } from "../../src/constants";
import { getRuns } from "../../src/server";
import { getCollectionName } from "../../src/server/helpers";
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
  const { runType } = req.query;
  const { runId } = req.body;

  const db = await connectToDatabase();
  const collectionName = getCollectionName(
    runType,
    RUN_SEGMENT_COLLECTION_NAME
  );

  const doesMatchingRunExist = Boolean(
    await db.collection(collectionName).findOne<RunSegment>({ runId })
  );

  if (doesMatchingRunExist) {
    await updateExistingRun(db, req.body, collectionName);
  } else {
    await createNewRun(db, req.body, collectionName);
  }
  const runData = await getRuns(db, runType);
  res.json(runData);
};

const updateExistingRun = async (
  db: Db,
  body: SplitRequestBody,
  collectionName: string
) => {
  const { segmentId, segmentTime, isCompleted, runId } = body;

  const matchingSegment = await db
    .collection<RunSegment>(collectionName)
    .findOne({ runId, segmentId });

  if (matchingSegment) {
    await updateExistingSegment(db, body, collectionName);
  } else {
    await createNewSegmentForExistingRun(
      db,
      runId!,
      segmentId,
      segmentTime,
      isCompleted,
      collectionName
    );
  }
};

const updateExistingSegment = async (
  db: Db,
  body: SplitRequestBody,
  collectionName: string
) => {
  const { segmentId, segmentTime, runId, isCompleted } = body;
  await db
    .collection<RunSegment>(collectionName)
    .updateOne({ runId, segmentId }, { $set: { segmentTime, isCompleted } });
};

const createNewSegmentForExistingRun = async (
  db: Db,
  runId: number,
  segmentId: number,
  segmentTime: number,
  isCompleted: boolean,
  collectionName: string
) => {
  await db
    .collection<RunSegment>(collectionName)
    .insertOne({ segmentId, segmentTime, runId, isCompleted });
};

const createNewRun = async (
  db: Db,
  body: SplitRequestBody,
  collectionName: string
) => {
  const { segmentId, segmentTime, isCompleted } = body;

  const maxRunIdList = await db
    .collection<RunSegment>(collectionName)
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
    isCompleted,
    collectionName
  );
};

export default split;
