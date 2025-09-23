import { NextResponse } from "next/server"
import { supabase } from "../../../../../lib/supabaseServer"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, display_name, phone, role } = body

    console.log("📝 SIGNUP REQUEST:", { email, display_name, phone, role })

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
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

    // Sign up user with metadata
    const userMetadata = { 
      display_name, 
      phone: phone || null, 
      role: role || 'buyer' 
    };
    
    console.log("🔍 USER METADATA:", userMetadata);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata,
      },
    })

    if (error) {
      console.error("🔥 AUTH ERROR:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    console.log("✅ USER CREATED:", data.user?.id)

    // Create profile record directly
    if (data.user?.id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          display_name: display_name || '',
          phone: phone || null,
          role: role || 'buyer',
        })

      if (profileError) {
        console.error("🔥 PROFILE CREATION ERROR:", profileError)
        // Note: User is created but profile failed - you might want to handle this
        return NextResponse.json({
          success: false,
          error: "User created but profile setup failed. Please contact support.",
        }, { status: 500 })
      }

      console.log("✅ PROFILE CREATED for user:", data.user.id)
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      message: "Account and profile created successfully. Check email for verification if required.",
    })
  } catch (err: any) {
    console.error("❌ SIGN-UP ERROR:", err)
    console.error("❌ ERROR STACK:", err.stack)
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Internal server error" 
    }, { status: 500 })
  }
}
