"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRoutes = void 0;
const server_1 = require("@trpc/server");
const schemas_1 = require("@ntla9aw/forms/src/schemas");
const trpc_1 = require("../trpc");
const db_1 = require("@ntla9aw/db");
const uuid_1 = require("uuid");
exports.eventRoutes = (0, trpc_1.router)({
    events: trpc_1.publicProcedure.input(schemas_1.formSchemaEvents).query(async ({ input }) => {
        const { community_id, page, limit, date_start, date_end, order, tags, title, city } = input;
        const skip = page * limit;
        console.log(community_id);
        const where = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (community_id ? { community_id } : {})), (date_start && date_end
            ? {
                date: {
                    gte: new Date(date_start),
                    lte: new Date(date_end),
                },
            }
            : {})), (tags && tags.length > 0
            ? {
                tags: {
                    some: {
                        name: {
                            in: tags,
                        },
                    },
                },
            }
            : {})), (title
            ? {
                title: {
                    contains: title,
                },
            }
            : {})), (city
            ? {
                city: {
                    name: {
                        equals: city,
                    },
                },
            }
            : {}));
        const [events, total] = await Promise.all([
            db_1.prisma.event.findMany({
                where,
                include: {
                    tags: true,
                    community: true,
                    city: true,
                    user: true,
                },
                orderBy: {
                    date: order === "newest" ? "desc" : "asc",
                },
                skip,
                take: limit,
            }),
            db_1.prisma.event.count({ where }),
        ]);
        console.log(events);
        return {
            events,
            total,
        };
    }),
    event: trpc_1.publicProcedure
        .input(schemas_1.formSchemaEvent)
        .query(async ({ input: { event_id } }) => {
        const event = await db_1.prisma.event.findUnique({
            where: { event_id },
            include: {
                tags: true,
                community: true,
                city: true,
                user: true,
            },
        });
        if (!event) {
            throw new server_1.TRPCError({
                code: "NOT_FOUND",
                message: `Event with ID ${event_id} not found.`,
            });
        }
        return event;
    }),
    create: (0, trpc_1.privateProcedure)("individual", "organization")
        .input(schemas_1.formSchemaEventCreate)
        .mutation(async ({ input: { title, description, date, city_id, address, longitude, latitude, community_id, uid, image, type, TicketPrice, ticketAmount, }, }) => {
        // Create a new event in the database
        const newEvent = await db_1.prisma.event.create({
            data: {
                event_id: (0, uuid_1.v4)(), // Generate a unique ID for the event
                title,
                description: description || null, // Allow description to be optional
                date: new Date(date), // Convert string date to Date object
                city_id, // Use provided city ID
                address: address || null, // Allow address to be optional
                longitude: longitude || null, // Allow longitude to be optional
                latitude: latitude || null, // Allow latitude to be optional
                uid: uid || null, // Allow uid to be optional
                community_id: community_id || null, // Allow community_id to be optional
                image: image || null, // Allow image to be optional
                type,
                ticketAmount: ticketAmount || 0,
                ticketSold: ticketAmount || 0,
                TicketPrice: TicketPrice || 0,
            },
        });
        return {
            message: "Event created successfully",
            event: newEvent,
        };
    }),
    booking: (0, trpc_1.privateProcedure)("member")
        .input(schemas_1.formSchemaBoooking)
        .mutation(async ({ input }) => {
        const { ticket_id, event_id, uid, purchase_date, status } = input;
        await db_1.prisma.event.update({
            where: {
                event_id, // Assuming event_id is the identifier in the event table
            },
            data: {
                ticketAmount: {
                    decrement: 1, // Decrement by 1 for each booking
                },
                ticketSold: {
                    increment: 1
                }
            },
        });
        // Use Prisma upsert to create or update the ticket
        const ticket = await db_1.prisma.ticket.upsert({
            where: {
                ticket_id: ticket_id || (0, uuid_1.v4)(), // Generate a new UUID if ticket_id is not provided
            },
            create: {
                event_id,
                uid,
                purchase_date,
                status,
            },
            update: {
                event_id,
                uid,
                purchase_date,
                status,
            },
        });
        return ticket;
    }),
    delete: (0, trpc_1.privateProcedure)("individual", "organization", "admin")
        .input(schemas_1.formSchemaEvent)
        .mutation(async ({ input: { event_id } }) => {
        await db_1.prisma.event.delete({
            where: {
                event_id,
            },
        });
        return { message: "Event deleted successfully" };
    }),
    ticket: (0, trpc_1.privateProcedure)("individual", "organization", "admin")
        .input(schemas_1.formSchemaTicket)
        .mutation(async ({ input }) => {
        const { event_id, page, limit, date_start, date_end, order, tags, title, city } = input;
        const skip = page * limit;
        const where = Object.assign(Object.assign(Object.assign(Object.assign({ event_id }, (date_start && date_end
            ? {
                date: {
                    gte: new Date(date_start),
                    lte: new Date(date_end),
                },
            }
            : {})), (tags && tags.length > 0
            ? {
                tags: {
                    some: {
                        name: {
                            in: tags,
                        },
                    },
                },
            }
            : {})), (title
            ? {
                title: {
                    contains: title,
                },
            }
            : {})), (city
            ? {
                city: {
                    name: {
                        equals: city,
                    },
                },
            }
            : {}));
        return db_1.prisma.ticket.findMany({
            where,
            include: {
                event: true,
            },
            orderBy: {
                purchase_date: order === "newest" ? "desc" : "asc",
            },
            skip,
            take: limit,
        });
    }),
});
//# sourceMappingURL=event.js.map