import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../../lib/supabaseServer";
import supabaseAdmin from "../../../../../lib/supabaseAdmin";

export async function GET() {
  try {
    // Fetch users from auth.users
    const { data: authUsers, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      console.error('Error fetching auth users:', usersError);
      return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
    }

    console.log('Auth users response:', authUsers);

    if (!authUsers?.users || authUsers.users.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Get profiles for additional info
    const userListForIds = authUsers.users || authUsers;
    const userIds = userListForIds.map((u: any) => u.id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    }

    // Combine auth users with profile data
    const userList = authUsers.users || authUsers;
    const users = userList.map((authUser: any) => {
      const profile = profiles?.find((p: any) => p.id === authUser.id);
      
      return {
        id: authUser.id,
        email: authUser.email,
        phone: authUser.phone,
        display_name: profile?.display_name,
        role: profile?.role,
        address: profile?.address,
        city: profile?.city,
        profile_picture: profile?.profile_picture,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at
      };
    });

    return NextResponse.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}