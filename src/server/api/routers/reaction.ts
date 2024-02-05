import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { reactions } from "@/server/db/schema";

export const reactionRouter = createTRPCRouter({
  getReaction: protectedProcedure
    .input(z.object({ snippetId: z.number(), userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const reaction = await ctx.db.query.reactions.findFirst({
        where: (reaction, { eq, and }) =>
          and(
            eq(reaction.snippetId, input.snippetId),
            eq(reaction.userId, input.userId),
          ),
      });
      return reaction?.reactionType ?? null;
    }),
  createReation: protectedProcedure
    .input(
      z.object({
        reaction: z.enum(["like", "dislike"]),
        snippetId: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(reactions)
        .values({
          reactionType: input.reaction,
          snippetId: input.snippetId,
          userId: input.userId,
        })
        .onConflictDoUpdate({
          target: reactions.snippetId,
          set: { reactionType: input.reaction },
        });
    }),
});
