-- First, check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'waitlist';

-- If RLS is enabled (which it is based on your error), update policies:

-- Drop any existing policies on the table
DROP POLICY IF EXISTS "Allow client inserts" ON public.waitlist;
DROP POLICY IF EXISTS "Allow users to view their own entries" ON public.waitlist;
DROP POLICY IF EXISTS "Only service_role can update entries" ON public.waitlist;

-- Create a new policy that actually allows public insertions from anonymous users
CREATE POLICY "Allow anonymous inserts" ON public.waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create a policy for authenticated users
CREATE POLICY "Allow authenticated inserts" ON public.waitlist
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- If you want to also allow reads by anonymous users (for things like referral checks)
CREATE POLICY "Allow anonymous reads" ON public.waitlist
  FOR SELECT TO anon
  USING (true);

-- Only allow service_role to update entries
CREATE POLICY "Only service_role can update entries" ON public.waitlist
  FOR UPDATE USING (auth.role() = 'service_role');

-- Only allow service_role to delete entries
CREATE POLICY "Only service_role can delete entries" ON public.waitlist
  FOR DELETE USING (auth.role() = 'service_role');
