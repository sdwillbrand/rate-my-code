import { snippetRouter } from "@/server/api/routers/snippet";
import { createTRPCRouter } from "@/server/api/trpc";
import { reactionRouter } from "./routers/reaction";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  snippet: snippetRouter,
  reaction: reactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
