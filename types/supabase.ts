export type WaitlistEntry = {
  id: number;
  email: string;
  name: string | null;
  created_at: string;
  referral_code?: string;
  source?: string | null;
};

export type Database = {
  public: {
    Tables: {
      waitlist: {
        Row: WaitlistEntry;
        Insert: {
          email: string;
          name?: string | null;
          created_at?: string;
          referral_code?: string;
          source?: string | null;
        };
        Update: {
          id?: number;
          email?: string;
          name?: string | null;
          created_at?: string;
          referral_code?: string;
          source?: string | null;
        };
      };
    };
  };
};
