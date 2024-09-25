"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateSchema = exports.ticketDelete = exports.ticketFormSchema = exports.ticketsSchema = exports.ticketSchema = exports.userTicketSchema = exports.formSchemaTag = exports.formSchemaBoooking = exports.formSchemaSubscription = exports.formSchemaEventCreate = exports.formSchemaTicket = exports.formSchemaEvents = exports.formEventTitle = exports.formSchemaEvent = exports.formSchemaCommunityCreate = exports.formSchemaCommunity = exports.formSchemaProfile = exports.zodSchemaRegisterWithProvider = exports.formSchemaLogin = exports.formSchemaUser = exports.formSchemaRegister = void 0;
const zod_1 = require("zod");
const types_1 = require("@ntla9aw/db/types");
exports.formSchemaRegister = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().optional(),
    image: zod_1.z
        .any()
        .optional(),
    password: zod_1.z.string().min(6),
});
exports.formSchemaUser = zod_1.z.object({
    uid: zod_1.z.string(),
});
exports.formSchemaLogin = exports.formSchemaRegister.pick({
    email: true,
    password: true
});
exports.zodSchemaRegisterWithProvider = zod_1.z.object({
    uid: zod_1.z.string(),
    name: zod_1.z.string(),
    image: zod_1.z
        .string()
        .optional(),
    type: zod_1.z.nativeEnum(types_1.AuthProviderType)
});
exports.formSchemaProfile = zod_1.z.object({
    uid: zod_1.z.string(),
    name: zod_1.z.string(),
    bio: zod_1.z.string().optional(),
    avatar_url: zod_1.z.string().optional(),
});
exports.formSchemaCommunity = zod_1.z.object({
    community_id: zod_1.z.string().uuid(), // Optional for updates
});
exports.formSchemaCommunityCreate = zod_1.z.object({
    name: zod_1.z.string().min(1, "Community name is required").max(100, "Name cannot exceed 100 characters"),
    description: zod_1.z.string().max(500, "Description cannot exceed 500 characters").optional(), // Optional field
    uid: zod_1.z.string().min(1, "User ID is required").optional(), // User ID must be provided
    image: zod_1.z.string().optional()
});
exports.formSchemaEvent = zod_1.z.object({
    event_id: zod_1.z.string().uuid().optional(), // Optional for updates
});
exports.formEventTitle = zod_1.z.object({
    title: zod_1.z.string().optional(), // Optional for updates
});
exports.formSchemaEvents = zod_1.z.object({
    community_id: zod_1.z.string().uuid().optional(),
    page: zod_1.z.number().default(0),
    limit: zod_1.z.number().default(8),
    date_start: zod_1.z.string().optional(),
    date_end: zod_1.z.string().optional(),
    order: zod_1.z.string().default("newest"),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    title: zod_1.z.string().optional(), // Added title
    city: zod_1.z.string().optional(), // Added city
});
exports.formSchemaTicket = zod_1.z.object({
    event_id: zod_1.z.string().uuid().optional(),
    page: zod_1.z.number().default(0),
    limit: zod_1.z.number().default(8),
    date_start: zod_1.z.string().optional(),
    date_end: zod_1.z.string().optional(),
    order: zod_1.z.string().default("newest"),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
    title: zod_1.z.string().optional(), // Added title
    city: zod_1.z.string().optional(), // Added city
});
exports.formSchemaEventCreate = zod_1.z.object({
    event_id: zod_1.z.string().uuid().optional(),
    image: zod_1.z.any().nullable().optional(),
    title: zod_1.z.string()
        .min(1, "Event title is required")
        .max(100, "Title cannot exceed 100 characters"),
    description: zod_1.z.string()
        .max(500, "Description cannot exceed 500 characters")
        .nullable()
        .optional(),
    date: zod_1.z.string()
        .min(1, "Date is required")
        .refine((value) => !isNaN(Date.parse(value)), {
        message: "Invalid date format. Please use a valid date.",
    }),
    city_id: zod_1.z.string()
        .min(1, "City ID is required"),
    address: zod_1.z.string()
        .max(200, "Address cannot exceed 200 characters")
        .nullable()
        .optional(),
    longitude: zod_1.z.number()
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180")
        .nullable()
        .optional(),
    latitude: zod_1.z.number()
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90")
        .nullable()
        .optional(),
    uid: zod_1.z.string().uuid().nullable().optional(),
    community_id: zod_1.z.string().uuid().nullable().optional(),
    ticketAmount: zod_1.z.number().int().nonnegative("Ticket amount must be non-negative").optional(),
    TicketPrice: zod_1.z.number().nonnegative("Ticket price must be non-negative").optional(),
    type: zod_1.z.enum(['FREE', 'PAID'], {
        required_error: "Event type is required",
    }),
    tags: zod_1.z.array(zod_1.z.object({
        tag_id: zod_1.z.string(),
        name: zod_1.z.string()
    })).optional(),
});
exports.formSchemaSubscription = zod_1.z.object({
    uid: zod_1.z.string().optional(),
    product: zod_1.z.enum(['member', 'individual', 'organization']),
});
exports.formSchemaBoooking = zod_1.z.object({
    ticket_id: zod_1.z.string().uuid().optional(), // Optional since it will be auto-generated
    event_id: zod_1.z.string().nonempty("Event ID is required"),
    uid: zod_1.z.string().nonempty("User ID is required"),
    purchase_date: zod_1.z.date().optional().default(new Date()), // Automatically defaults to current date
    status: zod_1.z.enum(["pending", "confirmed", "cancelled"]), // Define valid statuses
});
exports.formSchemaTag = zod_1.z.object({
    tags: zod_1.z.array(zod_1.z.string()).min(1, "Please select at least one tag")
});
exports.userTicketSchema = zod_1.z.object({
    uid: zod_1.z.string().uuid().optional(),
    date_start: zod_1.z.string().optional(),
    date_end: zod_1.z.string().optional(),
    page: zod_1.z.number().int().positive(),
    limit: zod_1.z.number().int().positive()
});
exports.ticketSchema = zod_1.z.object({
    ticketId: zod_1.z.string().uuid()
});
exports.ticketsSchema = zod_1.z.object({
    eventId: zod_1.z.string().uuid().optional(),
    page: zod_1.z.number().int().positive(),
    limit: zod_1.z.number().int().positive(),
    date_start: zod_1.z.string().optional(),
    date_end: zod_1.z.string().optional(),
});
exports.ticketFormSchema = zod_1.z.object({
    ticketId: zod_1.z.string().uuid().optional(),
    event_id: zod_1.z.string().uuid(),
    uid: zod_1.z.string().uuid(),
    status: zod_1.z.string(),
    // Add any other relevant fields
});
exports.ticketDelete = zod_1.z.object({
    ticketId: zod_1.z.string().uuid(),
});
exports.dateSchema = zod_1.z.object({
    startDate: zod_1.z.date().optional(),
    endDate: zod_1.z.date().optional(),
}).optional();
//# sourceMappingURL=schemas.js.map