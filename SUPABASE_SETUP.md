# Supabase Setup for Waitlist Collection

This guide explains how to set up Supabase for collecting waitlist emails in your loopey project.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in Supabase

## Setup Instructions

### 1. Create the Waitlist Table

1. Go to your Supabase project
2. Navigate to the SQL Editor
3. Copy and paste the SQL from `supabase/schema.sql` into the editor
4. Run the SQL to create your waitlist table with proper indexes and security

### 2. Get Your API Keys

1. In your Supabase dashboard, go to Settings > API
2. Copy the "Project URL" and "anon/public" key
3. Add these to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Test Your Integration

1. Start your Next.js development server
2. Visit the waitlist page and submit a test email
3. Verify the email appears in your Supabase waitlist table

## Database Schema

The waitlist table has the following structure:

- `id`: Unique identifier for each entry
- `email`: User's email address (unique)
- `name`: Optional user's name
- `created_at`: Timestamp when the entry was created
- `referral_code`: Auto-generated unique code for referral tracking
- `source`: Optional field to track where the user came from

## Security Considerations

- Row Level Security (RLS) is enabled on the table
- Anonymous users can only insert data, not read or modify existing data
- Only server-side code with the service role can read all waitlist entries

## Additional Features

The schema includes functionality for:

1. Automatic generation of unique referral codes
2. Preventing duplicate email submissions
3. Tracking signup timestamps

## Backup

In addition to storing data in Supabase, the application also stores the latest submission in localStorage as a backup.
