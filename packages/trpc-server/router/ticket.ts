import { TRPCError } from "@trpc/server";
import {
  userTicketSchema,
  ticketSchema,
  ticketsSchema,
  ticketFormSchema,
  ticketDelete,
} from "@ntla9aw/forms/src/schemas";
import { privateProcedure, router } from "../trpc";
import { prisma } from "@ntla9aw/db";
import { v4 as uuid } from "uuid";

export const ticketRoutes = router({
  userTickets: privateProcedure("member")
    .input(userTicketSchema)
    .query(async ({ ctx }) => {
      const tickets = await prisma.ticket.findMany({
        where: { uid: ctx.uid },
        include: { event: true },
      });
      return tickets;
    }),

  ticket: privateProcedure("individual", "organization", "admin")
    .input(ticketSchema)
    .query(async ({ input }) => {
      const ticket = await prisma.ticket.findUnique({
        where: { ticket_id: input.ticketId },
        include: { event: true, user: true },
      });
      if (!ticket)
        throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });
      return ticket;
    }),

    tickets: privateProcedure("individual", "organization", "admin")
    .input(ticketsSchema)
    .query(async ({ ctx, input }) => {
      const tickets = await prisma.ticket.findMany({
        where: {
          event: {
            uid: ctx.uid,
            ...(input.date_start && {
              date: { gte: new Date(input.date_start) },
            }),
            ...(input.date_end && { date: { lte: new Date(input.date_end) } }),
          },
        },
        include: {
          event: true,
          user: true,
        },
        skip: (input.page - 1) * input.limit,
        take: input.limit,
        orderBy: { purchase_date: "desc" },
      });

      const total = await prisma.ticket.count({
        where: {
          event: {
            uid: ctx.uid,
            ...(input.date_start && {
              date: { gte: new Date(input.date_start) },
            }),
            ...(input.date_end && { date: { lte: new Date(input.date_end) } }),
          },
        },
      });

      return { tickets, total };
    }),

  addUpdateTicket: privateProcedure("individual", "organization", "admin")
    .input(ticketFormSchema)
    .mutation(async ({ ctx, input }) => {
      const ticket = await prisma.ticket.upsert({
        where: { ticket_id: input.ticketId || uuid() },
        update: { ...input, uid: ctx.uid },
        create: { ...input, uid: ctx.uid || uuid(), ticket_id: uuid() },
      });
      return ticket;
    }),
  delete: privateProcedure("individual", "organization", "admin")
    .input(ticketDelete)
    .mutation(async ({ input }) => {
      const deletedTicket = await prisma.ticket.delete({
        where: {
          ticket_id: input.ticketId, // Assuming 'id' is the primary key field
        },
      });
      return deletedTicket;
    }),
});
