// app/api/auth/reset/confirm/route.ts
// Lines 1-140
import { NextResponse } from "next/server";
import { supabase } from "../../../../../../lib/supabaseServer";

export async function POST(req: Request) {
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const access_token = typeof body?.access_token === "string" ? body.access_token : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  if (!access_token || !newPassword) {
    return NextResponse.json({ ok: false, error: "access_token and newPassword are required" }, { status: 400 });
    }

  const { error: setErr } = await supabase.auth.setSession({
    access_token,
    refresh_token: "",
  });
  if (setErr) {
    return NextResponse.json({ ok: false, error: setErr.message }, { status: 400 });
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}