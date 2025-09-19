import { NextResponse } from "next/server"
import { supabase } from "../../../../../lib/supabaseServer"
export async function GET(req: Request) {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true, data: data }, { status: 200 })
}