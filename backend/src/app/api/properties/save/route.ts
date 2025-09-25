import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../../lib/supabaseServer";

// POST /api/properties/save - Toggle save property (save if not saved, remove if saved)
export async function POST(request: NextRequest) {
  try {
    const { user_id, property_id } = await request.json();

    // Validate required fields
    if (!user_id || !property_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: user_id, property_id' },
        { status: 400 }
      );
    }

    // Check if property exists and is active
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', property_id)
      .eq('is_active', true)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if already saved
    const { data: existingSave, error: checkError } = await supabase
      .from('saved_properties')
      .select('id')
      .eq('buyer_id', user_id)
      .eq('property_id', property_id)
      .single();

    if (existingSave) {
      // Remove from favorites
      const { error: deleteError } = await supabase
        .from('saved_properties')
        .delete()
        .eq('buyer_id', user_id)
        .eq('property_id', property_id);

      if (deleteError) {
        console.error('Error removing saved property:', deleteError);
        return NextResponse.json(
          { success: false, error: 'Failed to remove saved property' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { is_saved: false },
        message: 'Property removed from favorites'
      });
    } else {
      // Save property to favorites
      const { data: savedProperty, error: saveError } = await supabase
        .from('saved_properties')
        .insert({
          buyer_id: user_id,
          property_id,
          created_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (saveError) {
        console.error('Error saving property:', saveError);
        return NextResponse.json(
          { success: false, error: 'Failed to save property' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { is_saved: true },
        message: 'Property saved to favorites'
      });
    }

  } catch (error) {
    console.error('Toggle save property error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/properties/save - Get user's saved properties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: user_id' },
        { status: 400 }
      );
    }

    // Get user's saved properties with full property details
    const { data: savedProperties, error } = await supabase
      .from('saved_properties')
      .select(`
        *,
        property:properties!saved_properties_property_id_fkey (
          *,
          owner:profiles!properties_owner_id_fkey (
            display_name,
            phone
          )
        )
      `)
      .eq('buyer_id', user_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved properties:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch saved properties' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: savedProperties
    });

  } catch (error) {
    console.error('Get saved properties error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
