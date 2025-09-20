import { NextResponse } from "next/server"
import { supabase } from "../../../../../lib/supabaseServer"
import supabaseAdmin from "../../../../../lib/supabaseAdmin"

export async function POST(req: Request) {
  try {
    const { access_token, new_password } = await req.json()

    if (!access_token || !new_password) {
      return NextResponse.json(
        { success: false, error: "Access token and new password are required" },
        { status: 400 }
      )
    }

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(access_token)

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 400 }
      )
    }

    // Update password using admin API
    const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: new_password
    })

    if (error) {
      console.error("Password update error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    // Update profile timestamp
    await supabase
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      message: "Password updated successfully"
    })
  } catch (err: any) {
    console.error("❌ RESET PASSWORD ERROR:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
