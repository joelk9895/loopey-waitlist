"use server";
import { createClient } from "@supabase/supabase-js";
import { Database, WaitlistEntry } from "@/types/supabase";

// Email service (example using Resend, but you can use any email provider)
import { Resend } from "resend";
const resendApiKey = process.env.RESEND_API_KEY;
console.log("Resend API key available:", !!resendApiKey);
const resend = new Resend(resendApiKey);

// Supabase client (server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""; // Use service role key for admin access

export async function sendEmailToWaitlist(
  subject: string,
  htmlContent: string
) {
  try {
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

    // Get all waitlist subscribers
    const { data, error } = await supabase
      .from("waitlist")
      .select("email, name")
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch subscribers: ${error.message}`);
    }

    // Type assertion for TypeScript
    const subscribers = data as Pick<WaitlistEntry, "email" | "name">[];

    console.log(`Sending email to ${subscribers.length} subscribers`);

    // For small lists, you can send emails one by one
    // For larger lists, you should use batch sending or queue processing
    const results = await Promise.allSettled(
      subscribers.map(async (subscriber) => {
        try {
          // Personalize the email with the subscriber's name if available
          let personalizedHtml = htmlContent;
          try {
            // Use simple string replacement instead of regex to avoid syntax errors
            personalizedHtml = subscriber.name
              ? personalizedHtml.split("{{name}}").join(subscriber.name)
              : personalizedHtml.split("{{name}}").join("there");
          } catch (err) {
            console.error("Error personalizing email:", err);
            // Fallback if personalization fails
            personalizedHtml = htmlContent;
          }

          console.log(`Sending email to ${subscriber.email}`);
          const result = await resend.emails.send({
            from: "Loopey <onboarding@resend.dev>",
            to: subscriber.email,
            subject: subject,
            html: personalizedHtml,
          });
          console.log("Resend API response:", result);

          // Handle response based on Resend's response structure
          if ("data" in result && result.data && result.data.id) {
            return {
              email: subscriber.email,
              status: "success",
              id: result.data.id,
            };
          } else {
            return {
              email: subscriber.email,
              status: "success",
              id: "unknown",
            };
          }
        } catch (err: any) {
          return {
            email: subscriber.email,
            status: "failed",
            error: err.message,
          };
        }
      })
    );

    // Count successes and failures
    const successes = results.filter((r) => r.status === "fulfilled").length;
    const failures = results.filter((r) => r.status === "rejected").length;

    return {
      success: true,
      message: `Sent ${successes} emails successfully. ${failures} failed.`,
      results,
    };
  } catch (error: any) {
    console.error("Error sending emails:", error);
    return { success: false, message: error.message };
  }
}
