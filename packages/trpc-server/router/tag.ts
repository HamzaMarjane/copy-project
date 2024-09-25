import { privateProcedure, publicProcedure, t } from '../trpc'
import { formSchemaTag } from '@ntla9aw/forms/src/schemas' 
import { prisma } from "@ntla9aw/db"
import { TRPCError } from '@trpc/server'

export const tagRoutes = t.router({
  getAllTags: publicProcedure.query(async () => {
    return prisma.tag.findMany()
  }),
  submitTags: privateProcedure("member")
  .input(formSchemaTag)
  .mutation(async ({ input, ctx }) => {
    const { uid } = ctx;

    if (!uid) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'User ID is missing',
      });
    }

    // First, ensure all tags exist
    await prisma.tag.createMany({
      data: input.tags.map(tag => ({ name: tag })),
      skipDuplicates: true,
    });

    // Then, create the user-tag associations
    const userTags = await prisma.user.update({
      where: { uid },
      data: {
        tags: {
          connect: input.tags.map(tag => ({ name: tag })),
        },
      },
      include: {
        tags: true,
      },
    });

    return {
      success: true,
      message: `Successfully submitted ${userTags.tags.length} tags for user ${uid}`,
      tags: userTags.tags,
    };
  })
})