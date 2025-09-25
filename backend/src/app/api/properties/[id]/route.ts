import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../../lib/supabaseServer";

// GET /api/properties/[id] - Get single property by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: property, error } = await supabase
      .from('properties')
      .select(`
        *,
        owner:profiles!properties_owner_id_fkey (
          display_name,
          phone
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Property not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching property:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch property' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: property
    });

  } catch (error) {
    console.error('Property GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update property by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      title, 
      description, 
      price, 
      location, 
      bedrooms, 
      bathrooms, 
      area, 
      property_type, 
      images,
      is_active 
    } = body;

    // Check if property exists
    const { data: existingProperty, error: fetchError } = await supabase
      .from('properties')
      .select('id, owner_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingProperty) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (location !== undefined) updateData.location = location;
    if (bedrooms !== undefined) updateData.bedrooms = parseInt(bedrooms);
    if (bathrooms !== undefined) updateData.bathrooms = parseFloat(bathrooms);
    if (area !== undefined) updateData.area = area ? parseInt(area) : null;
    if (property_type !== undefined) updateData.property_type = property_type;
    if (images !== undefined) updateData.images = images;
    if (is_active !== undefined) updateData.is_active = is_active;

    // Update property
    const { data: property, error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        owner:profiles!properties_owner_id_fkey (
          display_name,
          phone
        )
      `)
      .single();

    if (error) {
      console.error('Error updating property:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update property' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: property,
      message: 'Property updated successfully'
    });

  } catch (error) {
    console.error('Property PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Delete property by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if property exists
    const { data: existingProperty, error: fetchError } = await supabase
      .from('properties')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingProperty) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting is_active to false
    const { error } = await supabase
      .from('properties')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error deleting property:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete property' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    });

  } catch (error) {
    console.error('Property DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
