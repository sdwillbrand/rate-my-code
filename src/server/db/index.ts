import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: "http://127.0.0.1:8080",
  // authToken: "DATABASE_AUTH_TOKEN",
});

export const db = drizzle(client, { schema });
