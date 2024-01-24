import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { snippets } from "@/server/db/schema";

export const snippetRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        code: z.string(),
        language: z.string().min(1).max(50),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(snippets).values({
        title: input.title,
        code: input.code,
        language: input.language,
        userId: input.userId,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.snippets.findFirst({
      orderBy: (snippet, { desc }) => [desc(snippet.createdAt)],
    });
  }),
});
