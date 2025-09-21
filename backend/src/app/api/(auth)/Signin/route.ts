import { NextResponse } from "next/server"
import { supabase } from "../../../../../lib/supabaseServer"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }

  // Fetch user profile data from profiles table
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single()

  if (profileError) {
    console.error("🔥 PROFILE FETCH ERROR:", profileError)
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch user profile" 
    }, { status: 500 })
  }


  // Create clean user object with only necessary data
  const cleanUser = {
    id: data.user.id,
    email: data.user.email,
    display_name: profileData.display_name,
    phone: profileData.phone,
    role: profileData.role,
    created_at: profileData.created_at,
    updated_at: profileData.updated_at,
  }

  console.log("✅ CLEAN USER DATA:", cleanUser)

  return NextResponse.json({
    success: true,
    user: cleanUser,
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  })
}
