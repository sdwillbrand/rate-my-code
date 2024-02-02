import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { snippets } from "@/server/db/schema";

export const snippetRouter = createTRPCRouter({
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
      with: {
        users: true,
      },
      columns: {
        updatedAt: false,
      },
    });
  }),
  getLatests: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.snippets.findMany({
      orderBy: (snippet, { desc }) => [desc(snippet.createdAt)],
      with: {
        users: {
          columns: {
            name: true,
          },
        },
      },
      columns: {
        updatedAt: false,
      },
      limit: 10,
    });
  }),
});
