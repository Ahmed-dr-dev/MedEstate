import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../lib/supabaseServer"  

// GET /api/properties - Get all properties

export async function GET() {
  try {
    const { data: properties, error } = await supabase
      .from('properties')
      .select(`
        *,
        owner:profiles!properties_owner_id_fkey (
          display_name,
          phone
        )
      `)


      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching properties:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch properties' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: properties
    });

  } catch (error) {
    console.error('Properties GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();


    //form data
    const owner_id = formData.get('owner_id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const location = formData.get('location') as string;
    const bedrooms = formData.get('bedrooms') as string;
    const bathrooms = formData.get('bathrooms') as string;
    const area = formData.get('area') as string;
    const property_type = formData.get('property_type') as string;
    const images = formData.getAll('images');

    // Validate required fields
    if (!owner_id || !title || !price || !location || !property_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: owner_id, title, price, location, property_type' },
        { status: 400 }
      );
    }

    // Verify owner exists
    const { data: owner, error: ownerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', owner_id)
      .single();

    if (ownerError || !owner) {
      return NextResponse.json(
        { success: false, error: 'Invalid owner ID' },
        { status: 400 }
      );
    }

    // Create property first
    const { data: tempProperty, error: tempError } = await supabase
      .from('properties')
      .insert({
        owner_id,
        title,
        description: description || null,
        price: parseFloat(price),
        location,
        bedrooms: bedrooms ? parseInt(bedrooms) : 0,
        bathrooms: bathrooms ? parseInt(bathrooms) : 0,
        area: area ? parseInt(area) : null,
        property_type,
        images: [],
        is_active: true
      })
      .select('id')
      .single();

    if (tempError || !tempProperty) {
      return NextResponse.json(
        { success: false, error: 'Failed to create property' },
        { status: 500 }
      );
    }

    // Upload images
    const uploadedImageUrls: string[] = [];
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageFile = images[i];
        if (imageFile instanceof File) {
          const arrayBuffer = await imageFile.arrayBuffer();
          const fileExtension = imageFile.name.split('.').pop() || 'jpg';
          const fileName = `${tempProperty.id}/image_${i + 1}_${Date.now()}.${fileExtension}`;
          
          const { data, error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, arrayBuffer, {
              contentType: imageFile.type,
              upsert: false
            });

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('property-images')
              .getPublicUrl(fileName);
            uploadedImageUrls.push(publicUrl);
          }
        }
      }
    }

    // Update property with image URLs
    const { data: property, error: updateError } = await supabase
      .from('properties')
      .update({ 
        images: uploadedImageUrls,
        updated_at: new Date().toISOString()
      })
      .eq('id', tempProperty.id)
      .select('*')
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: 'Failed to update property with images' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: property,
      message: `Property created successfully${uploadedImageUrls.length > 0 ? ` with ${uploadedImageUrls.length} images` : ''}`
    }, { status: 201 });

  } catch (error) {
    console.error('Properties POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
