import { type Config } from "drizzle-kit";

import { env } from "@/env.js";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.TURSO_DB_AUTH_TOKEN,
  },
  tablesFilter: ["rate-my-code_*"],
} satisfies Config;
