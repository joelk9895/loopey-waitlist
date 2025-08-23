-- This SQL can be run in the Supabase SQL editor to create your waitlist table

-- Create waitlist table
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referral_code TEXT,
  source TEXT
);

-- Create index on email for faster lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);

-- Optional: Add RLS (Row Level Security) policies for security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Only allow inserts from authenticated users and your service role
CREATE POLICY "Allow anonymous inserts to waitlist" 
  ON waitlist FOR INSERT 
  WITH CHECK (true);

-- Only allow the service role to select all rows
CREATE POLICY "Service can select all waitlist entries" 
  ON waitlist FOR SELECT 
  USING (auth.role() = 'service_role');

-- Create function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  result TEXT := '';
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  NEW.referral_code := result;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate referral codes
CREATE TRIGGER trigger_generate_referral_code
BEFORE INSERT ON waitlist
FOR EACH ROW
WHEN (NEW.referral_code IS NULL)
EXECUTE FUNCTION generate_referral_code();
