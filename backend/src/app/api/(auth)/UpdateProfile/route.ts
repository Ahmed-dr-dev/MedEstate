import { NextResponse } from "next/server"
import { supabase } from "../../../../../lib/supabaseServer"

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { userId, display_name, phone, role } = body

    console.log("🔄 UPDATE PROFILE REQUEST:", { userId, display_name, phone, role })

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      )
    }

    // Validate role if provided
    const validRoles = ['buyer', 'seller', 'bank_agent', 'admin']
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role. Must be one of: buyer, seller, bank_agent, admin" },
        { status: 400 }
      )
    }

    // Update profile in database
    const updateData: any = {}
    if (display_name !== undefined) updateData.display_name = display_name
    if (phone !== undefined) updateData.phone = phone
    if (role !== undefined) updateData.role = role
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select('id, display_name, phone, role, updated_at')
      .single()

    if (error) {
      console.error("🔥 PROFILE UPDATE ERROR:", error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    console.log("✅ PROFILE UPDATED:", data)

    return NextResponse.json({
      success: true,
      profile: {
        display_name: data.display_name,
        phone: data.phone,
        role: data.role,
        updated_at: data.updated_at,
      },
      message: "Profile updated successfully"
    })
  } catch (err: any) {
    console.error("❌ UPDATE PROFILE ERROR:", err)
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Internal server error" 
    }, { status: 500 })
  }
}
