"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketRoutes = void 0;
const server_1 = require("@trpc/server");
const schemas_1 = require("@ntla9aw/forms/src/schemas");
const trpc_1 = require("../trpc");
const db_1 = require("@ntla9aw/db");
const uuid_1 = require("uuid");
exports.ticketRoutes = (0, trpc_1.router)({
    userTickets: (0, trpc_1.privateProcedure)("member")
        .input(schemas_1.userTicketSchema)
        .query(async ({ ctx }) => {
        const tickets = await db_1.prisma.ticket.findMany({
            where: { uid: ctx.uid },
            include: { event: true },
        });
        return tickets;
    }),
    ticket: (0, trpc_1.privateProcedure)("individual", "organization", "admin")
        .input(schemas_1.ticketSchema)
        .query(async ({ input }) => {
        const ticket = await db_1.prisma.ticket.findUnique({
            where: { ticket_id: input.ticketId },
            include: { event: true, user: true },
        });
        if (!ticket)
            throw new server_1.TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });
        return ticket;
    }),
    tickets: (0, trpc_1.privateProcedure)("individual", "organization", "admin")
        .input(schemas_1.ticketsSchema)
        .query(async ({ ctx, input }) => {
        const tickets = await db_1.prisma.ticket.findMany({
            where: {
                event: Object.assign(Object.assign({ uid: ctx.uid }, (input.date_start && {
                    date: { gte: new Date(input.date_start) },
                })), (input.date_end && { date: { lte: new Date(input.date_end) } })),
            },
            include: {
                event: true,
                user: true,
            },
            skip: (input.page - 1) * input.limit,
            take: input.limit,
            orderBy: { purchase_date: "desc" },
        });
        const total = await db_1.prisma.ticket.count({
            where: {
                event: Object.assign(Object.assign({ uid: ctx.uid }, (input.date_start && {
                    date: { gte: new Date(input.date_start) },
                })), (input.date_end && { date: { lte: new Date(input.date_end) } })),
            },
        });
        return { tickets, total };
    }),
    addUpdateTicket: (0, trpc_1.privateProcedure)("individual", "organization", "admin")
        .input(schemas_1.ticketFormSchema)
        .mutation(async ({ ctx, input }) => {
        const ticket = await db_1.prisma.ticket.upsert({
            where: { ticket_id: input.ticketId || (0, uuid_1.v4)() },
            update: Object.assign(Object.assign({}, input), { uid: ctx.uid }),
            create: Object.assign(Object.assign({}, input), { uid: ctx.uid || (0, uuid_1.v4)(), ticket_id: (0, uuid_1.v4)() }),
        });
        return ticket;
    }),
    delete: (0, trpc_1.privateProcedure)("individual", "organization", "admin")
        .input(schemas_1.ticketDelete)
        .mutation(async ({ input }) => {
        const deletedTicket = await db_1.prisma.ticket.delete({
            where: {
                ticket_id: input.ticketId, // Assuming 'id' is the primary key field
            },
        });
        return deletedTicket;
    }),
});
//# sourceMappingURL=ticket.js.map