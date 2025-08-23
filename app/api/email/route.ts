"use server";

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database, WaitlistEntry } from "@/types/supabase";
import { sendEmailToWaitlist } from "./send";

// Supabase client (server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""; // Use service role key for admin access

export async function POST(request: NextRequest) {
  try {
    // Get request body
    const { subject, htmlContent } = await request.json();

    if (!subject || !htmlContent) {
      return NextResponse.json(
        { success: false, message: "Subject and HTML content are required" },
        { status: 400 }
      );
    }

    // Initialize Supabase with service role key for admin access
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

    // Get all waitlist subscribers - just count them for now
    const { count, error: countError } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Error fetching subscribers count:", countError);
      return NextResponse.json(
        {
          success: false,
          message: `Failed to fetch subscribers: ${countError.message}`,
        },
        { status: 500 }
      );
    }

    // Get a sample of subscribers for preview
    const { data: sampleData, error: sampleError } = await supabase
      .from("waitlist")
      .select("email, name")
      .order("created_at", { ascending: true })
      .limit(5);

    if (sampleError) {
      console.error("Error fetching sample subscribers:", sampleError);
      return NextResponse.json(
        {
          success: false,
          message: `Failed to fetch sample subscribers: ${sampleError.message}`,
        },
        { status: 500 }
      );
    }

    // Check if RESEND_API_KEY is set
    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY environment variable");
      return NextResponse.json(
        {
          success: false,
          message:
            "Email service not configured. Please add RESEND_API_KEY to your .env.local file",
          emailCount: count,
          previewSubscribers: sampleData,
        },
        { status: 500 }
      );
    }

    // Actually send the emails using our send.ts helper
    try {
      const sendResult = await sendEmailToWaitlist(subject, htmlContent);

      // Return the result
      return NextResponse.json({
        ...sendResult,
        emailCount: count,
        previewSubscribers: sampleData,
      });
    } catch (sendError: any) {
      console.error("Failed to send emails:", sendError);
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send emails: ${sendError.message}`,
          emailCount: count,
          previewSubscribers: sampleData,
          error: sendError.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
