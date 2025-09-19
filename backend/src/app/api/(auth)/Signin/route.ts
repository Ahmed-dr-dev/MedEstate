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

  return NextResponse.json({
    success: true,
    user: data.user,
    session: data.session, // includes access_token & refresh_token
  })
}
