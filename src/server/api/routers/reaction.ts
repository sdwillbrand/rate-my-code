import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { reactions } from "@/server/db/schema";

export const reactionRouter = createTRPCRouter({
  getReaction: protectedProcedure
    .input(z.object({ snippetId: z.number() }))
    .query(async ({ input, ctx }) => {
      const reaction = await ctx.db.query.reactions.findFirst({
        where: (reaction, { eq, and }) =>
          and(
            eq(reaction.snippetId, input.snippetId),
            eq(reaction.userId, ctx.session.user.id),
          ),
      });
      return reaction?.reactionType ?? null;
    }),
  createReation: protectedProcedure
    .input(
      z.object({
        reaction: z.enum(["like", "dislike"]),
        snippetId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(reactions)
        .values({
          reactionType: input.reaction,
          snippetId: input.snippetId,
          userId: ctx.session.user.id,
        })
        .onConflictDoUpdate({
          target: [reactions.userId, reactions.snippetId],
          set: { reactionType: input.reaction },
        });
    }),
});
