import { NextResponse } from "next/server"
import { supabase } from "../../../../../lib/supabaseServer"

export async function POST(req: Request) {
  try {
    const { email, password, display_name, phone } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Sign up user with metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name, phone }, // user_metadata
      },
    })

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      message: "User created successfully. Check email for confirmation if enabled.",
    })
  } catch (err: any) {
    console.error("❌ SIGN-UP ERROR:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
