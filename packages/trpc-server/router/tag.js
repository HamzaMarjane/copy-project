"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagRoutes = void 0;
const trpc_1 = require("../trpc");
const schemas_1 = require("@ntla9aw/forms/src/schemas");
const db_1 = require("@ntla9aw/db");
const server_1 = require("@trpc/server");
exports.tagRoutes = trpc_1.t.router({
    getAllTags: trpc_1.publicProcedure.query(async () => {
        return db_1.prisma.tag.findMany();
    }),
    submitTags: (0, trpc_1.privateProcedure)("member")
        .input(schemas_1.formSchemaTag)
        .mutation(async ({ input, ctx }) => {
        const { uid } = ctx;
        if (!uid) {
            throw new server_1.TRPCError({
                code: 'FORBIDDEN',
                message: 'User ID is missing',
            });
        }
        // First, ensure all tags exist
        await db_1.prisma.tag.createMany({
            data: input.tags.map(tag => ({ name: tag })),
            skipDuplicates: true,
        });
        // Then, create the user-tag associations
        const userTags = await db_1.prisma.user.update({
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
});
//# sourceMappingURL=tag.js.map