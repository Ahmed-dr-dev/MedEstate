import { NextResponse } from "next/server"
import { supabase } from "../../../../../lib/supabaseServer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, display_name, phone } = body

    console.log("📝 SIGNUP REQUEST:", { email, display_name, phone })

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
        data: { display_name, phone },
      },
    })

    if (error) {
      console.error("🔥 AUTH ERROR:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    console.log("✅ USER CREATED:", data.user?.id)

    return NextResponse.json({
      success: true,
      user: data.user,
      message: "User created successfully. Check email for confirmation if enabled.",
    })
  } catch (err: any) {
    console.error("❌ SIGN-UP ERROR:", err)
    console.error("❌ ERROR STACK:", err.stack)
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Internal server error" 
    }, { status: 500 })
  }
}
