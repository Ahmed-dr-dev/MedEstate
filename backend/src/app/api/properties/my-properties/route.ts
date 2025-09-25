import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/properties/my-properties - Get current user's properties
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('sb-access-token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Get user's buyer profile
    const { data: buyerProfile, error: profileError } = await supabase
      .from('buyer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !buyerProfile) {
      return NextResponse.json(
        { success: false, error: 'Buyer profile not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeInactive = searchParams.get('include_inactive') === 'true';

    let query = supabase
      .from('properties')
      .select(`
        *,
        owner:buyer_profiles!properties_owner_id_fkey (
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('owner_id', buyerProfile.id)
      .order('created_at', { ascending: false });

    // Filter by active status unless include_inactive is true
    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: properties, error, count } = await query;

    if (error) {
      console.error('Error fetching user properties:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch properties' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('My properties GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
