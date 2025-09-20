import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({ success: false, error: "Email and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters long" }, { status: 400 });
    }



    // Get user by email using SQL query
    const { data: users, error: queryError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (queryError || !users) {
      return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });
    }

    // Update password using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      users.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Password update error:", updateError);
      return NextResponse.json({ success: false, error: "Failed to update password" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Password updated successfully" 
    });

  } catch (error) {
    console.error("Direct reset error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}