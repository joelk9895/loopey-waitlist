"use client";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function addToWaitlist(
  email: string,
  name?: string,
  source?: string | null
) {
  try {
    // Log the connection parameters (without exposing full key)
    const urlStart = supabaseUrl.substring(0, 15) + "...";
    const keyPreview =
      supabaseAnonKey.substring(0, 5) +
      "..." +
      supabaseAnonKey.substring(supabaseAnonKey.length - 3);
    console.log("Supabase connection:", {
      urlPreview: urlStart,
      keyPreview,
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
    });

    // Log what we're trying to insert
    console.log("Attempting to insert:", { email, name, source });

    // Perform the insertion
    const { data, error } = await supabase
      .from("waitlist")
      .insert([
        {
          email,
          name: name || null,
          created_at: new Date().toISOString(),
          source: source || "website",
        },
      ] as any)
      .select();

    if (error) {
      console.error("Supabase returned error:", error);
      throw error;
    }

    console.log("Successfully added to waitlist:", data);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error adding to waitlist:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      statusCode: error.statusCode,
    });

    if (error.code === "23505") {
      // PostgreSQL unique violation code
      return {
        success: false,
        error: "This email is already on our waitlist.",
      };
    }

    // Check for connection issues
    if (error.message?.includes("Failed to fetch")) {
      return {
        success: false,
        error:
          "Connection to database failed. Please check your internet connection.",
      };
    }

    // Check for table not found issues
    if (error.message?.includes("does not exist") || error.code === "42P01") {
      return {
        success: false,
        error:
          "Database table not found. Please make sure you've set up the waitlist table.",
      };
    }

    return {
      success: false,
      error: `Failed to join waitlist: ${error.message || "Unknown error"}`,
    };
  }
}
