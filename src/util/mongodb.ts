import { Db, MongoClient } from "mongodb";
import { RunType } from "../constants";

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongo;

if (!cached) {
  // eslint-disable-next-line no-multi-assign
  // @ts-ignore
  cached = global.mongo = { conn: null, promise: null };
}

const connectToDatabase: (runType: string | string[]) => Promise<Db> = async (
  runType: string | string[]
) => {
  const runTypeString = Array.isArray(runType) ? runType[0] : runType;
  // @ts-ignore
  if (!runTypeString || !Object.values(RunType).includes(runTypeString)) {
    throw Error("Invalid runType parameter: " + runType);
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = MongoClient.connect(MONGODB_URI).then((client) =>
      client.db(runTypeString)
    );
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectToDatabase;
