"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigationRoutes = void 0;
const schemas_1 = require("@ntla9aw/forms/src/schemas");
const trpc_1 = require("../trpc");
const db_1 = require("@ntla9aw/db");
exports.navigationRoutes = (0, trpc_1.router)({
    cities: trpc_1.publicProcedure.query(() => {
        return db_1.prisma.city.findMany();
    }),
    tags: trpc_1.publicProcedure.query(() => {
        return db_1.prisma.tag.findMany();
    }),
    eventNames: trpc_1.publicProcedure
        .input(schemas_1.formEventTitle)
        .query(async ({ input }) => {
        const events = await db_1.prisma.event.findMany({
            select: {
                title: true,
            },
            where: {
                title: {
                    contains: input.title || undefined,
                    mode: 'insensitive',
                },
            },
        });
        return events.map(event => event.title);
    }),
});
//# sourceMappingURL=navigation.js.map