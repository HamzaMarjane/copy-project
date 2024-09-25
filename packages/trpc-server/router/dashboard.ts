import { privateProcedure, router } from "../trpc";
import { prisma } from "@ntla9aw/db";
import { dateSchema } from "@ntla9aw/forms/src/schemas";

export const dashboardRoutes = router({
  getDashboardStatistics: privateProcedure("individual", "organization", "admin")
    .input(
      dateSchema
    )
    .query(async ({ctx, input }) => {
      const uid = ctx.uid
      const startDate = input?.startDate ? new Date(input.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = input?.endDate ? new Date(input.endDate) : new Date();
      const community = await prisma.community.findUnique({ where: { uid } });

      const whereClause = {
        community_id:community?.community_id, 
        date: {
          gte: startDate,
          lte: endDate,
        },
      };

      const [totalEvents, totalMembers, totalRevenue, totalTicketsSold, events, members] = await Promise.all([
        prisma.event.count({ where: whereClause }),
        prisma.member.count(),
        prisma.event.findMany({
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
        prisma.ticket.count({
          where: {
            status: 'completed',
            purchase_date: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
        prisma.event.findMany({
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
        prisma.member.findMany({
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

      const ticketSalesData = await prisma.ticket.groupBy({
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

      const ticketSalesDistribution = await prisma.event.findMany({
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
        events: events.map(event => ({
          ...event,
          revenue: event.ticketAmount * event.TicketPrice,
        })),
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