"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const trpc_1 = require("../trpc");
const db_1 = require("@ntla9aw/db");
const schemas_1 = require("@ntla9aw/forms/src/schemas");
exports.dashboardRoutes = (0, trpc_1.router)({
    getDashboardStatistics: (0, trpc_1.privateProcedure)("individual", "organization", "admin")
        .input(schemas_1.dateSchema)
        .query(async ({ ctx, input }) => {
        const uid = ctx.uid;
        const startDate = (input === null || input === void 0 ? void 0 : input.startDate) ? new Date(input.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = (input === null || input === void 0 ? void 0 : input.endDate) ? new Date(input.endDate) : new Date();
        const community = await db_1.prisma.community.findUnique({ where: { uid } });
        const whereClause = {
            community_id: community === null || community === void 0 ? void 0 : community.community_id,
            date: {
                gte: startDate,
                lte: endDate,
            },
        };
        const [totalEvents, totalMembers, totalRevenue, totalTicketsSold, events, members] = await Promise.all([
            db_1.prisma.event.count({ where: whereClause }),
            db_1.prisma.member.count(),
            db_1.prisma.event.findMany({
                where: whereClause,
                select: {
                    event_id: true,
                    title: true,
                    TicketPrice: true,
                    _count: {
                        select: {
                            tickets: {
                                where: {
                                    status: 'completed',
                                    purchase_date: {
                                        gte: startDate,
                                        lte: endDate,
                                    },
                                },
                            },
                        },
                    },
                },
            }),
            db_1.prisma.ticket.count({
                where: {
                    status: 'completed',
                    purchase_date: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            }),
            db_1.prisma.event.findMany({
                where: whereClause,
                select: {
                    event_id: true,
                    title: true,
                    date: true,
                    city: {
                        select: {
                            name: true,
                        },
                    },
                    ticketAmount: true,
                    TicketPrice: true,
                },
                orderBy: {
                    date: 'desc',
                },
                take: 5,
            }),
            db_1.prisma.member.findMany({
                select: {
                    uid: true,
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                },
                take: 6,
            }),
        ]);
        const ticketSalesData = await db_1.prisma.ticket.groupBy({
            by: ['purchase_date'],
            where: {
                status: 'completed',
                purchase_date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _count: {
                ticket_id: true,
            },
            orderBy: {
                purchase_date: 'asc',
            },
        });
        const ticketSalesDistribution = await db_1.prisma.event.findMany({
            where: whereClause,
            select: {
                title: true,
                _count: {
                    select: {
                        tickets: {
                            where: {
                                status: 'completed',
                                purchase_date: {
                                    gte: startDate,
                                    lte: endDate,
                                },
                            },
                        },
                    },
                },
            },
        });
        return {
            totalEvents,
            totalMembers,
            totalRevenue: totalRevenue.reduce((acc, event) => {
                const revenue = event.TicketPrice * event._count.tickets;
                return acc + revenue;
            }, 0),
            totalTicketsSold,
            events: events.map(event => (Object.assign(Object.assign({}, event), { revenue: event.ticketAmount * event.TicketPrice }))),
            members: members.map(member => ({
                id: member.uid,
                name: member.user.name || 'Anonymous',
                image: member.user.image || 'https://xsgames.co/randomusers/avatar.php?g=male',
            })),
            ticketSalesData: ticketSalesData.map(tsd => ({
                date: tsd.purchase_date.toISOString().split('T')[0],
                sales: tsd._count.ticket_id,
            })),
            ticketSalesDistribution: ticketSalesDistribution.map(tsd => ({
                name: tsd.title,
                value: tsd._count.tickets,
            })),
        };
    }),
});
//# sourceMappingURL=dashboard.js.map