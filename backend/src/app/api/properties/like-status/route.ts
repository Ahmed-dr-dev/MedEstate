import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../../lib/supabaseServer";

// GET /api/properties/like-status - Check if property is liked by user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const property_id = searchParams.get('property_id');

    if (!user_id || !property_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: user_id, property_id' },
        { status: 400 }
      );
    }

    // Check if property is saved by user
    const { data: savedProperty, error } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('buyer_id', user_id)
      .eq('property_id', property_id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking like status:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to check like status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { is_liked: !!savedProperty }
    });

  } catch (error) {
    console.error('Check like status error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
