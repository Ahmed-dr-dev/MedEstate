// app/api/auth/reset/request/route.ts
import { NextResponse } from "next/server";
import { supabase } from "../../../../../../lib/supabaseServer";

export async function POST(req: Request) {
  let body: any = null;
  try { body = await req.json(); } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const redirectTo =
    typeof body?.redirectTo === "string" && body.redirectTo.length > 0
      ? body.redirectTo
      : `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}`; // fallback (web)

  if (!email) {
    return NextResponse.json({ ok: false, error: "email is required" }, { status: 400 });
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
