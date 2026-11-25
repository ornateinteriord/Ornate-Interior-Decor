import mongoose from "mongoose";
import { env } from "./env.js";

let baseConnection = null;
let dbs = null;

/**
 * Connects once to the MongoDB Atlas cluster and creates separate logical
 * databases using `useDb` for catalog, users, orders, and admin domains.
 */
export async function connectDatabases() {
  if (dbs && baseConnection?.readyState === 1) {
    return dbs;
  }

  baseConnection = await mongoose
    .createConnection(env.mongodbUri, {
      maxPoolSize: 15,
      serverSelectionTimeoutMS: 12000,
    })
    .asPromise();

  dbs = {
    catalog: baseConnection.useDb(env.dbNames.catalog, { useCache: true }),
    users: baseConnection.useDb(env.dbNames.users, { useCache: true }),
    orders: baseConnection.useDb(env.dbNames.orders, { useCache: true }),
    admin: baseConnection.useDb(env.dbNames.admin, { useCache: true }),
  };

  return dbs;
}

export function getDatabases() {
  if (!dbs) {
    throw new Error("Databases not initialized. Call connectDatabases() first.");
  }
  return dbs;
}

export async function getDatabaseHealth() {
  const readyState = baseConnection?.readyState ?? 0;
  const states = ["disconnected", "connected", "connecting", "disconnecting"];

  if (!dbs || readyState !== 1) {
    return {
      status: states[readyState] || "disconnected",
      databases: [],
    };
  }

  const entries = await Promise.all(
    Object.entries(dbs).map(async ([domain, conn]) => {
      const collections = await conn.db.listCollections().toArray();
      return {
        domain,
        dbName: conn.name,
        readyState: states[conn.readyState] || "unknown",
        collections: collections.map((c) => c.name),
      };
    })
  );

  return {
    status: "connected",
    databases: entries,
  };
}

export async function closeDatabases() {
  if (baseConnection) {
    await baseConnection.close();
    baseConnection = null;
    dbs = null;
  }
}
