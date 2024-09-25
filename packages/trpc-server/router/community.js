"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityRoutes = void 0;
const server_1 = require("@trpc/server");
const schemas_1 = require("@ntla9aw/forms/src/schemas");
const trpc_1 = require("../trpc");
const db_1 = require("@ntla9aw/db");
const uuid_1 = require("uuid");
exports.communityRoutes = (0, trpc_1.router)({
    commnunities: trpc_1.publicProcedure.query(({}) => {
        return db_1.prisma.community.findMany();
    }),
    community: trpc_1.publicProcedure
        .input(schemas_1.formSchemaCommunity)
        .query(({ input: { community_id } }) => {
        return db_1.prisma.community.findUnique({ where: { community_id } });
    }),
    owner: (0, trpc_1.privateProcedure)('individual', "organization")
        .query(async ({ ctx }) => {
        const uid = ctx.uid;
        const community = await db_1.prisma.community.findUnique({ where: { uid } });
        if (!community) {
            throw new server_1.TRPCError({
                code: "NOT_FOUND",
                message: `Community with ID ${uid} not found.`,
            });
        }
        return community;
    }),
    create: (0, trpc_1.privateProcedure)("individual", "organization")
        .input(schemas_1.formSchemaCommunityCreate)
        .mutation(async ({ input: { name, description, uid } }) => {
        const newCommunity = await db_1.prisma.community.create({
            data: {
                community_id: (0, uuid_1.v4)(), // Generate a unique ID for the community
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
//# sourceMappingURL=community.js.map