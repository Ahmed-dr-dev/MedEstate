import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    // Create admin client to access auth.users table
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Query the auth.users table directly to check if email exists
    const { data, error } = await supabaseAdmin
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    console.log('Check email result:', { email, error: error?.message, hasData: !!data });

    // If we get data, email exists
    if (data && !error) {
      return NextResponse.json({ 
        success: true, 
        message: "Email found"
      });
    }

    // If we get an error (like no rows found), email doesn't exist
    return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });

  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
