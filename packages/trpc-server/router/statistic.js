"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statisticRoutes = void 0;
const trpc_1 = require("../trpc");
const db_1 = require("@ntla9aw/db");
const schemas_1 = require("@ntla9aw/forms/src/schemas");
exports.statisticRoutes = (0, trpc_1.router)({
    getUserStatistics: (0, trpc_1.privateProcedure)("individual", "organization", "admin")
        .input(schemas_1.dateSchema)
        .query(async ({ input }) => {
        const { startDate, endDate } = input || {};
        const whereClause = startDate && endDate
            ? {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            }
            : {};
        const [totalUsers, newUsers, userTypes] = await Promise.all([
            db_1.prisma.user.count(),
            db_1.prisma.user.count({
                where: Object.assign(Object.assign({}, whereClause), { createdAt: {
                        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    } }),
            }),
            db_1.prisma.$transaction([
                db_1.prisma.member.count(),
                db_1.prisma.individual.count(),
                db_1.prisma.organization.count(),
            ]),
        ]);
        const userGrowth = await db_1.prisma.$queryRaw `
        SELECT DATE_TRUNC('month', "createdAt") as month, COUNT(*)::bigint as count
        FROM "User"
        WHERE "createdAt" >= ${startDate || new Date(0)} AND "createdAt" <= ${endDate || new Date()}
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month
      `;
        return {
            totalUsers,
            newUsers,
            userTypes: {
                members: userTypes[0],
                individuals: userTypes[1],
                organizations: userTypes[2],
            },
            userGrowth: userGrowth.map((ug) => (Object.assign(Object.assign({}, ug), { count: Number(ug.count) }))),
        };
    }),
    getEventStatistics: (0, trpc_1.privateProcedure)("individual", "organization", "admin")
        .input(schemas_1.dateSchema)
        .query(async ({ input }) => {
        const { startDate, endDate } = input || {};
        const whereClause = startDate && endDate
            ? {
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            }
            : {};
        const [totalEvents, upcomingEvents, pastEvents] = await Promise.all([
            db_1.prisma.event.count({ where: whereClause }),
            db_1.prisma.event.count({
                where: Object.assign(Object.assign({}, whereClause), { date: { gte: new Date() } }),
            }),
            db_1.prisma.event.count({
                where: Object.assign(Object.assign({}, whereClause), { date: { lt: new Date() } }),
            }),
        ]);
        const averageAttendees = await db_1.prisma.ticket
            .groupBy({
            by: ["event_id"],
            _count: true,
            where: {
                event: whereClause,
            },
        })
            .then((results) => results.reduce((sum, result) => sum + result._count, 0) /
            results.length || 0);
        const eventGrowth = await db_1.prisma.$queryRaw `
      SELECT DATE_TRUNC('month', date) as month, COUNT(*)::bigint as count
      FROM "events"
      WHERE date >= ${startDate || new Date(0)} AND date <= ${endDate || new Date()}
      GROUP BY DATE_TRUNC('month', date)
      ORDER BY month
    `;
        const eventTypes = await db_1.prisma.event.groupBy({
            by: ["type"],
            _count: true,
            where: whereClause,
        });
        return {
            totalEvents,
            upcomingEvents,
            pastEvents,
            averageAttendees,
            eventGrowth: eventGrowth.map((eg) => (Object.assign(Object.assign({}, eg), { count: Number(eg.count) }))),
            eventTypes,
        };
    }),
    getCommunityStatistics: (0, trpc_1.privateProcedure)("individual", "organization", "admin")
        .input(schemas_1.dateSchema)
        .query(async ({ input }) => {
        const { startDate, endDate } = input || {};
        const whereClause = startDate && endDate
            ? {
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
            }
            : {};
        const [totalCommunities, newCommunities] = await Promise.all([
            db_1.prisma.community.count({ where: whereClause }),
            db_1.prisma.community.count({
                where: Object.assign(Object.assign({}, whereClause), { created_at: {
                        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    } }),
            }),
        ]);
        const averageMembers = await db_1.prisma.community
            .findMany({
            where: whereClause,
            include: { members: true },
        })
            .then((communities) => communities.reduce((sum, community) => sum + community.members.length, 0) / communities.length || 0);
        const communityGrowth = await db_1.prisma.$queryRaw `
      SELECT DATE_TRUNC('month', created_at) as month, COUNT(*)::bigint as count
      FROM "communities"
      WHERE created_at >= ${startDate || new Date(0)} AND created_at <= ${endDate || new Date()}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month
    `;
        return {
            totalCommunities,
            newCommunities,
            averageMembers,
            communityGrowth: communityGrowth.map((cg) => (Object.assign(Object.assign({}, cg), { count: Number(cg.count) }))),
        };
    }),
    getSubscriptionStatistics: (0, trpc_1.privateProcedure)("individual", "organization", "admin")
        .input(schemas_1.dateSchema)
        .query(async ({ input }) => {
        const { startDate, endDate } = input || {};
        const whereClause = startDate && endDate
            ? {
                billing_date: {
                    gte: startDate,
                    lte: endDate,
                },
            }
            : {};
        const [totalSubscribers, monthlyRevenue] = await Promise.all([
            db_1.prisma.payment.count({
                where: Object.assign(Object.assign({}, whereClause), { status: "completed" }),
            }),
            db_1.prisma.payment.aggregate({
                where: Object.assign(Object.assign({}, whereClause), { status: "completed", billing_date: {
                        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    } }),
                _sum: {
                    amount: true,
                },
            }),
        ]);
        const revenueGrowth = await db_1.prisma.$queryRaw `
      SELECT DATE_TRUNC('month', billing_date) as month, SUM(amount) as total
      FROM "payments"
      WHERE status = 'completed' AND billing_date >= ${startDate || new Date(0)} AND billing_date <= ${endDate || new Date()}
      GROUP BY DATE_TRUNC('month', billing_date)
      ORDER BY month
    `;
        const subscriptionTypes = await db_1.prisma.payment.groupBy({
            by: ["currency"],
            _count: true,
            where: Object.assign(Object.assign({}, whereClause), { status: "completed" }),
        });
        return {
            totalSubscribers,
            monthlyRevenue: monthlyRevenue._sum.amount || 0,
            revenueGrowth: revenueGrowth.map((rg) => (Object.assign(Object.assign({}, rg), { total: Number(rg.total) }))),
            subscriptionTypes,
        };
    }),
});
//# sourceMappingURL=statistic.js.map