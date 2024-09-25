import { TRPCError } from "@trpc/server";
import {
  formSchemaCommunity,
  formSchemaCommunityCreate,
} from "@ntla9aw/forms/src/schemas";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { prisma } from "@ntla9aw/db";
import { v4 as uuid } from "uuid";

export const communityRoutes = router({
  commnunities: publicProcedure.query(({ }) => {
    return prisma.community.findMany();
  }),
  community: publicProcedure
    .input(formSchemaCommunity)
    .query(({  input: { community_id } }) => {
      return prisma.community.findUnique({ where: { community_id } });
    }),
  owner: privateProcedure('individual',"organization")
    .query(async ({  ctx}) => {
      const uid = ctx.uid
      const community = await prisma.community.findUnique({ where: { uid } });
      if (!community) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Community with ID ${uid} not found.`,
        });
      }
      return community;
    }),
  create: privateProcedure("individual","organization")
    .input(formSchemaCommunityCreate)
    .mutation(async ({  input: { name, description, uid } }) => {
      const newCommunity = await prisma.community.create({
        data: {
          community_id: uuid(), // Generate a unique ID for the community
          name,
          description: description || null, // Allow description to be optional
          uid: uid || "",
        },
      });

      return {
        message: "Community created successfully",
        community: newCommunity,
      };
    }),
});
