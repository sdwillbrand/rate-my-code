import { type InferInsertModel } from "drizzle-orm";
import { type snippets } from "@/server/db/schema";

export type PostSnippet = InferInsertModel<typeof snippets>;
