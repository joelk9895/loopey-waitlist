import { Database as GeneratedDatabase } from './database.types';

export type Database = GeneratedDatabase;
export type WaitlistEntry = Database['public']['Tables']['waitlist']['Row'];
export type WaitlistInsert = Database['public']['Tables']['waitlist']['Insert'];
export type WaitlistUpdate = Database['public']['Tables']['waitlist']['Update'];
