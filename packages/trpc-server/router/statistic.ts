import { privateProcedure, router } from "../trpc";
import { prisma } from "@ntla9aw/db";
import { dateSchema } from "@ntla9aw/forms/src/schemas";

export const statisticRoutes = router({
  getUserStatistics: privateProcedure("individual", "organization", "admin")
    .input(dateSchema)
    .query(async ({ input }) => {
      const { startDate, endDate } = input || {};

      const whereClause =
        startDate && endDate
          ? {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            }
          : {};

      const [totalUsers, newUsers, userTypes] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            ...whereClause,
            createdAt: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            },
          },
        }),
        prisma.$transaction([
          prisma.member.count(),
          prisma.individual.count(),
          prisma.organization.count(),
        ]),
      ]);

      type UserGrowthResult = {
        month: Date;
        count: BigInt;
      };

      const userGrowth = await prisma.$queryRaw<UserGrowthResult[]>`
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
        userGrowth: userGrowth.map((ug) => ({
          ...ug,
          count: Number(ug.count),
        })),
      };
    }),

  getEventStatistics: privateProcedure("individual", "organization", "admin")
    .input(dateSchema)
    .query(async ({ input }) => {
      const { startDate, endDate } = input || {};

      const whereClause =
        startDate && endDate
          ? {
              date: {
                gte: startDate,
                lte: endDate,
              },
            }
          : {};

      const [totalEvents, upcomingEvents, pastEvents] = await Promise.all([
        prisma.event.count({ where: whereClause }),
        prisma.event.count({
          where: {
            ...whereClause,
            date: { gte: new Date() },
          },
        }),
        prisma.event.count({
          where: {
            ...whereClause,
            date: { lt: new Date() },
          },
        }),
      ]);

      const averageAttendees = await prisma.ticket
        .groupBy({
          by: ["event_id"],
          _count: true,
          where: {
            event: whereClause,
          },
        })
        .then(
          (results) =>
            results.reduce((sum, result) => sum + result._count, 0) /
              results.length || 0
        );

      type EventGrowthResult = {
        month: Date;
        count: BigInt;
      };

      const eventGrowth = await prisma.$queryRaw<EventGrowthResult[]>`
      SELECT DATE_TRUNC('month', date) as month, COUNT(*)::bigint as count
      FROM "events"
      WHERE date >= ${startDate || new Date(0)} AND date <= ${endDate || new Date()}
      GROUP BY DATE_TRUNC('month', date)
      ORDER BY month
    `;

      const eventTypes = await prisma.event.groupBy({
        by: ["type"],
        _count: true,
        where: whereClause,
      });

      return {
        totalEvents,
        upcomingEvents,
        pastEvents,
        averageAttendees,
        eventGrowth: eventGrowth.map((eg) => ({
          ...eg,
          count: Number(eg.count),
        })),
        eventTypes,
      };
    }),

  getCommunityStatistics: privateProcedure(
    "individual",
    "organization",
    "admin"
  )
    .input(dateSchema)
    .query(async ({ input }) => {
      const { startDate, endDate } = input || {};

      const whereClause =
        startDate && endDate
          ? {
              created_at: {
                gte: startDate,
                lte: endDate,
              },
            }
          : {};

      const [totalCommunities, newCommunities] = await Promise.all([
        prisma.community.count({ where: whereClause }),
        prisma.community.count({
          where: {
            ...whereClause,
            created_at: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            },
          },
        }),
      ]);

      const averageMembers = await prisma.community
        .findMany({
          where: whereClause,
          include: { members: true },
        })
        .then(
          (communities) =>
            communities.reduce(
              (sum, community) => sum + community.members.length,
              0
            ) / communities.length || 0
        );

      type CommunityGrowthResult = {
        month: Date;
        count: BigInt;
      };

      const communityGrowth = await prisma.$queryRaw<CommunityGrowthResult[]>`
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
        communityGrowth: communityGrowth.map((cg) => ({
          ...cg,
          count: Number(cg.count),
        })),
      };
    }),

  getSubscriptionStatistics: privateProcedure(
    "individual",
    "organization",
    "admin"
  )
    .input(dateSchema)
    .query(async ({ input }) => {
      const { startDate, endDate } = input || {};

      const whereClause =
        startDate && endDate
          ? {
              billing_date: {
                gte: startDate,
                lte: endDate,
              },
            }
          : {};

      const [totalSubscribers, monthlyRevenue] = await Promise.all([
        prisma.payment.count({
          where: {
            ...whereClause,
            status: "completed",
          },
        }),
        prisma.payment.aggregate({
          where: {
            ...whereClause,
            status: "completed",
            billing_date: {
              gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            },
          },
          _sum: {
            amount: true,
          },
        }),
      ]);

      type RevenueGrowthResult = {
        month: Date;
        total: number;
      };

      const revenueGrowth = await prisma.$queryRaw<RevenueGrowthResult[]>`
      SELECT DATE_TRUNC('month', billing_date) as month, SUM(amount) as total
      FROM "payments"
      WHERE status = 'completed' AND billing_date >= ${startDate || new Date(0)} AND billing_date <= ${endDate || new Date()}
      GROUP BY DATE_TRUNC('month', billing_date)
      ORDER BY month
    `;

      const subscriptionTypes = await prisma.payment.groupBy({
        by: ["currency"],
        _count: true,
        where: {
          ...whereClause,
          status: "completed",
        },
      });

      return {
        totalSubscribers,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        revenueGrowth: revenueGrowth.map((rg) => ({
          ...rg,
          total: Number(rg.total),
        })),
        subscriptionTypes,
      };
    }),
});
