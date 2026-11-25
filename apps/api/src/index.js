import { env } from "./config/env.js";
import { connectDatabases } from "./config/databases.js";
import { seedInitialData } from "./services/seedService.js";
import { createApp } from "./app.js";

async function start() {
  try {
    const dbs = await connectDatabases();
    console.log(
      `[MongoDB] Connected to 4 databases: ${Object.values(dbs)
        .map((c) => c.name)
        .join(", ")}`
    );

    await seedInitialData();

    const app = createApp();
    app.listen(env.port, () => {
      console.log(`[API] Ornate backend running on http://localhost:${env.port}`);
    });
  } catch (err) {
    console.error("[Startup Fatal]", err);
    process.exit(1);
  }
}

start();
