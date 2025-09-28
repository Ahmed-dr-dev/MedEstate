import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../../lib/supabaseServer";



// GET /api/properties/my-properties - Get current user's properties
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get('owner_id');

    let buyerProfileId;

    if (ownerId) {
      console.log('Looking up profile for ownerId:', ownerId);
      
      // Check if ownerId is a user_id (auth user) or profile_id
      // First try to find profile by user_id
      const { data: profileByUserId, error: profileErrorByUserId } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', ownerId)
        .single();

      console.log('Profile lookup result:', { profileByUserId, profileErrorByUserId });

      if (profileByUserId && !profileErrorByUserId) {
        // ownerId is user_id, use the found profile
        buyerProfileId = profileByUserId.id;
        console.log('Using profile ID:', buyerProfileId);
      } else {
        // Check if profile exists for this user_id
        if (profileErrorByUserId && profileErrorByUserId.code === 'PGRST116') {
          // No profile found
          return NextResponse.json(
            { success: false, error: 'Profile not found. Please complete your profile first.' },
            { status: 404 }
          );
        }
        
        // ownerId might be profile_id directly
        buyerProfileId = ownerId;
        console.log('Using ownerId as profile ID:', buyerProfileId);
      }
    } else {
      // Otherwise, use JWT authentication
      const accessToken = request.headers.get('authorization')?.split(' ')[1];

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
      
      if (userError || !user) {
        return NextResponse.json(
          { success: false, error: 'Invalid authentication' },
          { status: 401 }
        );
      }

      // Get user's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { success: false, error: 'User profile not found' },
          { status: 404 }
        );
      }

      buyerProfileId = profile.id;
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeInactive = searchParams.get('include_inactive') === 'true';

    let query = supabase
      .from('properties')
      .select(`
        *,
        owner:profiles!properties_owner_id_fkey (
          display_name,
          phone
        )
      `)
      .eq('owner_id', buyerProfileId)
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

    console.log('Properties query result:', { 
      propertiesCount: properties?.length, 
      error: error?.message, 
      buyerProfileId,
      queryString: query.toString()
    });

    if (error) {
      console.error('Error fetching user properties:', error);
      return NextResponse.json(
        { success: false, error: `Failed to fetch properties: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: properties || [],
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

// DELETE /api/properties/my-properties/[id] - Delete user's property
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('property_id');
    const ownerId = searchParams.get('owner_id');

    if (!propertyId || !ownerId) {
      return NextResponse.json(
        { success: false, error: 'Property ID and Owner ID are required' },
        { status: 400 }
      );
    }

    // In profiles table, id is the same as auth user ID (foreign key to auth.users.id)
    // So ownerId (auth user ID) can be used directly as the profile ID
    console.log('DELETE: Using auth user ID as profile ID:', ownerId);
    
    // Verify the profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('id', ownerId)
      .single();

    console.log('DELETE: Profile verification result:', { profile, profileError });

    if (profileError || !profile) {
      console.log('DELETE: Profile not found, error:', profileError);
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    const profileId = ownerId; // Since profiles.id = auth.users.id

    // First check if the property exists and belongs to the user
    console.log('DELETE: Checking if property exists and belongs to user');
    const { data: propertyCheck, error: checkError } = await supabase
      .from('properties')
      .select('id, owner_id')
      .eq('id', propertyId)
      .single();

    console.log('DELETE: Property check result:', { propertyCheck, checkError });

    if (checkError || !propertyCheck) {
      console.log('DELETE: Property not found');
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    if (propertyCheck.owner_id !== profileId) {
      console.log('DELETE: Property does not belong to user. Property owner:', propertyCheck.owner_id, 'User profile:', profileId);
      return NextResponse.json(
        { success: false, error: 'You do not have permission to delete this property' },
        { status: 403 }
      );
    }

    // Delete property if it belongs to the user
    console.log('DELETE: Proceeding with delete operation');
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId)
      .eq('owner_id', profileId);

    if (deleteError) {
      console.error('Delete property error:', deleteError);
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
    console.error('Delete property error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/properties/my-properties/[id] - Update user's property
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('property_id');
    const ownerId = searchParams.get('owner_id');

    if (!propertyId) {
      return NextResponse.json(
        { success: false, error: 'Property ID is required' },
        { status: 400 }
      );
    }

    let buyerProfileId;

    // Get profile ID - ownerId is auth user ID (same as profile ID)
    if (ownerId) {
      buyerProfileId = ownerId;
    } else {
      const accessToken = request.headers.get('authorization')?.split(' ')[1];
      const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);
      
      if (userError || !user) {
        return NextResponse.json(
          { success: false, error: 'Invalid authentication' },
          { status: 401 }
        );
      }
      buyerProfileId = user.id;
    }

    // Get form data and prepare update
    const formData = await request.formData();
    const updateData: any = {};
    
    // Basic fields
    if (formData.get('title')) updateData.title = formData.get('title') as string;
    if (formData.get('description')) updateData.description = formData.get('description') as string;
    if (formData.get('price')) updateData.price = parseFloat(formData.get('price') as string);
    if (formData.get('location')) updateData.location = formData.get('location') as string;
    if (formData.get('bedrooms')) updateData.bedrooms = parseInt(formData.get('bedrooms') as string);
    if (formData.get('bathrooms')) updateData.bathrooms = parseInt(formData.get('bathrooms') as string);
    if (formData.get('area')) updateData.area = parseInt(formData.get('area') as string);
    
    if (formData.get('property_type')) {
      const property_type = (formData.get('property_type') as string).toLowerCase();
      const typeMap: Record<string, string> = {
        'apartment': 'apartment', 'house': 'house', 'villa': 'house',
        'condo': 'apartment', 'townhouse': 'house', 'commercial': 'commercial', 'studio': 'apartment'
      };
      updateData.property_type = typeMap[property_type] || 'house';
    }
    
    // Handle images - check if images are being updated
    const imagesParam = formData.get('images');
    if (imagesParam) {
      try {
        // Parse the images array from frontend
        const imagesArray = JSON.parse(imagesParam as string);
        updateData.images = imagesArray;
      } catch (error) {
        // Fallback: handle file uploads if images param is not JSON
        const imageFiles = formData.getAll('images') as File[];
        if (imageFiles.length > 0) {
          const imageUrls = [];
          for (const imageFile of imageFiles) {
            if (imageFile && imageFile.size > 0) {
              const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
              const { data: uploadData, error: uploadError } = await supabase.storage
                .from('property-images')
                .upload(fileName, imageFile);

              if (uploadError) {
                console.error('Error uploading image:', uploadError);
                continue;
              }

              const { data: { publicUrl } } = supabase.storage
                .from('property-images')
                .getPublicUrl(fileName);

              imageUrls.push(publicUrl);
            }
          }
          
          if (imageUrls.length > 0) {
            // Get existing images and append new ones
            const { data: existingProperty } = await supabase
              .from('properties')
              .select('images')
              .eq('id', propertyId)
              .single();
            
            const existingImages = existingProperty?.images || [];
            updateData.images = [...existingImages, ...imageUrls];
          }
        }
      }
    }

    updateData.updated_at = new Date().toISOString();

    // Update the property
    const { data: updatedProperty, error: updateError } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', propertyId)
      .eq('owner_id', buyerProfileId)
      .select()
      .single();

    if (updateError) {
      console.error('Update property error:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update property' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProperty,
      message: 'Property updated successfully'
    });

  } catch (error) {
    console.error('Update property error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
