import { NextResponse } from "next/server"
import { supabase } from "../../../../lib/supabaseServer"

export async function GET() {
  try {
    // Just try to get the current session (works even without tables)
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw error as Error
    }

    return NextResponse.json({
      status: "✅ Connected to Supabase",
      session: data.session ? "Has session" : "No active session",
    })
  } catch (err: any) {
    return NextResponse.json({
      status: "❌ Failed to connect",
      error: err.message,
    })
  }
}
