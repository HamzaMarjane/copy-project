import { z} from 'zod'
import { AuthProviderType } from '@ntla9aw/db/types'

export const formSchemaRegister = z.object({
    email: z.string().email(),
    name:z.string().optional(),
    image: z
    .any()
    .optional(),
    password: z.string().min(6),
})


export const formSchemaUser = z.object({
    uid: z.string(),
})
export const formSchemaLogin = formSchemaRegister.pick({
    email:true,
    password:true
})


export const zodSchemaRegisterWithProvider = z.object({
    uid:z.string(),
    name:z.string(),
    image: z
    .string()
    .optional(),
    type: z.nativeEnum(AuthProviderType)

})

export const formSchemaProfile = z.object({
    uid: z.string(),
    name: z.string(),
    bio: z.string().optional(),
    avatar_url: z.string().optional(),
})

export const formSchemaCommunity = z.object({
    community_id: z.string().uuid(), // Optional for updates
})

export const formSchemaCommunityCreate = z.object({
    name: z.string().min(1, "Community name is required").max(100, "Name cannot exceed 100 characters"),
    description: z.string().max(500, "Description cannot exceed 500 characters").optional(), // Optional field
    uid: z.string().min(1, "User ID is required").optional(), // User ID must be provided
    image: z.string().optional()
});

export const formSchemaEvent = z.object({
    event_id: z.string().uuid().optional(), // Optional for updates

})
export const formEventTitle = z.object({
  title: z.string().optional(), // Optional for updates

})
export const formSchemaEvents = z.object({
  community_id:  z.string().uuid().optional(),
  page: z.number().default(0),
  limit: z.number().default(8),
  date_start: z.string().optional(),
  date_end: z.string().optional(),
  order: z.string().default("newest"),
  tags: z.array(z.string()).optional(),
  title: z.string().optional(), // Added title
  city: z.string().optional(), // Added city
});

export const formSchemaTicket = z.object({
  event_id:  z.string().uuid().optional(),
  page: z.number().default(0),
  limit: z.number().default(8),
  date_start: z.string().optional(),
  date_end: z.string().optional(),
  order: z.string().default("newest"),
  tags: z.array(z.string()).optional(),
  title: z.string().optional(), // Added title
  city: z.string().optional(), // Added city
});


export const formSchemaEventCreate = z.object({
  event_id: z.string().uuid().optional(),
  image: z.any().nullable().optional(),
  title: z.string()
    .min(1, "Event title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string()
    .max(500, "Description cannot exceed 500 characters")
    .nullable()
    .optional(),
  date: z.string()
    .min(1, "Date is required")
    .refine((value) => !isNaN(Date.parse(value)), {
      message: "Invalid date format. Please use a valid date.",
    }),
  city_id: z.string()
    .min(1, "City ID is required"),
  address: z.string()
    .max(200, "Address cannot exceed 200 characters")
    .nullable()
    .optional(),
  longitude: z.number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .nullable()
    .optional(),
  latitude: z.number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .nullable()
    .optional(),
  uid: z.string().uuid().nullable().optional(),
  community_id: z.string().uuid().nullable().optional(),
  ticketAmount: z.number().int().nonnegative("Ticket amount must be non-negative").optional(),
  TicketPrice: z.number().nonnegative("Ticket price must be non-negative").optional(),
  type: z.enum(['FREE', 'PAID'], {
    required_error: "Event type is required",
  }),
  tags: z.array(z.object({
    tag_id: z.string(),
    name: z.string()
  })).optional(),
});


export const formSchemaSubscription = z.object({
    uid: z.string().optional(),
    product: z.enum(['member', 'individual', 'organization']),
  });
  
  
  export const formSchemaBoooking = z.object({
    ticket_id: z.string().uuid().optional(), // Optional since it will be auto-generated
    event_id: z.string().nonempty("Event ID is required"),
    uid: z.string().nonempty("User ID is required"),
    purchase_date: z.date().optional().default(new Date()), // Automatically defaults to current date
    status: z.enum(["pending", "confirmed", "cancelled"]), // Define valid statuses
  });

  export const formSchemaTag = z.object({
    tags: z.array(z.string()).min(1, "Please select at least one tag")
  })

  export const userTicketSchema = z.object({
    uid: z.string().uuid().optional(),
    date_start: z.string().optional(),
    date_end: z.string().optional(),
    page: z.number().int().positive(),
    limit: z.number().int().positive()
  });
  
  
  export const ticketSchema = z.object({
    ticketId: z.string().uuid()
  });
  
  export const ticketsSchema = z.object({
    eventId: z.string().uuid().optional(),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    date_start: z.string().optional(),
    date_end: z.string().optional(),

  });
  
  export const ticketFormSchema = z.object({
    ticketId: z.string().uuid().optional(),
    event_id: z.string().uuid(),
    uid: z.string().uuid(),
    status: z.string(),
    // Add any other relevant fields
  });

  export const ticketDelete = z.object({
    ticketId: z.string().uuid(),
  })


  export const dateSchema =   z.object({
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  }).optional()