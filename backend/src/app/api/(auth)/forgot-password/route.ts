import { NextResponse } from "next/server"
import { supabase } from "../../../../../lib/supabaseServer"
import supabaseAdmin from "../../../../../lib/supabaseAdmin"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if email exists using admin API
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.listUsers()
    
    const userExists = user?.users?.some(u => u.email === email)
    
    if (!userExists) {
      return NextResponse.json(
        { success: false, error: "Email not found" },
        { status: 404 }
      )
    }

    // Send password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`
    })

    if (error) {
      console.error("Password reset error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully"
    })
  } catch (err: any) {
    console.error("❌ FORGOT PASSWORD ERROR:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
