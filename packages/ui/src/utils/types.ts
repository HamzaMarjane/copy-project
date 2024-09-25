// Enums
export enum AuthProviderType {
    GOOGLE = 'GOOGLE',
    CREDENTIALS = 'CREDENTIALS'
  }
  

  
  // Interfaces
  export interface User {
    uid: string;
    createdAt: string;
    updatedAt: string;
    image: string | null;
    name: string | null;  // Keep this as string | null    image?: string;
    stripe_customer_id?: string | null;
    Credentials?: Credentials | null;
    AuthProvider?: AuthProvider | null;
    Admin?: Admin | null;
    Individual?: Individual | null;
    Member?: Member | null;
    Organization?: Organization | null;
    Community?: Community[] | null;
    Event?: Event[] | null;
    Payment?: Payment[] | null;
    Ticket?: Ticket[] | null;
    tags?: Tag[] | null;
  }
  
  export interface Admin {
    uid: string;
    user: User;
  }
  
  export interface Member {
    uid: string;
    user: User;
    communities: Community[];
  }
  
  export interface Individual {
    uid: string;
    user: User;
  }
  
  export interface Organization {
    uid: string;
    user: User;
  }
  
  export interface Credentials {
    uid: string;
    email: string;
    user: User;
    passwordHash: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AuthProvider {
    uid: string;
    type: AuthProviderType;
    user: User;
  }
  
  export interface Community {
    community_id: string;
    image: string | null;
    name: string;
    description?: string | null;
    created_at: string;
    uid: string;
    members?: Member[] | null;
    owner?: User | null;
    events?: Event[] | null;
    tags?: Tag[] | null;
  }
  export interface Event {
    event_id: string;
    title: string;
    description: string | null;
    date: Date | string;
    city_id: string;
    uid: string | null;
    community_id: string | null;
    address: string | null;
    longitude: number | null;
    latitude: number | null;
    ticketAmount: number;
    TicketPrice: number;
    type: 'FREE' | 'PAID';
    image: string | null;
  }
  export interface EventExtra {
    event_id? : string;
    title?: string;
    description?: string | null;
    date?: string;
    city_id?: string;
    uid?: string | null;
    community_id?: string | null;
    tags?: Tag[];
    user?: User | null;
    community?: Community | null;
    tickets?: Ticket[] | null;
    city?: City;
    address?: string | null;
    longitude?: number | null;
    latitude?: number | null;
    ticketAmount?: number;
    TicketPrice?: number;
    type?: 'FREE' | 'PAID';
    image?: string | null;
  }

  export interface TransformedEvent {
    event_id: string;
    title: string;
    description: string | null;
    date: string;
    city_id: string;
    uid: string | null;
    community_id: string | null;
    address: string | null;
    longitude: number | null;
    latitude: number | null;
    ticketAmount: number;
    TicketPrice: number;
    type: 'FREE' | 'PAID';
    image: string | null;
    city: City;
  }
  export interface Ticket {
    ticket_id: string;
    event_id: string;
    uid: string;
    purchase_date: string;
    status: string;
    event: Event;
    user: User;
  }
  
  export interface Payment {
    payment_id: string;
    uid: string;
    amount: number;
    currency: string;
    status: string;
    billing_date: string;
    user: User;
  }
  
  export interface Tag {
    tag_id: string;
    name: string;
    events?: Event[]  | null;
    communities?: Community[]  | null;
    users?: User[]  | null;
  }
  
  export interface City {
    id: string;
    name: string;
    longitude?: number | null;
    latitude?: number | null;
    events?: Event[] | null;
  }

  export type Role = 'admin' | 'member' | 'individual' | 'organization';