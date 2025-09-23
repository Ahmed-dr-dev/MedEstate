import { NextResponse } from "next/server"
import { supabase } from "../../../../../lib/supabaseServer"
export async function POST(req: Request) {
    const { error } = await supabase.auth.signOut({scope: 'global'})
    
    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: true, message: "Signed out successfully" }, { status: 200 })
}