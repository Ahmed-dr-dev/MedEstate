import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../lib/supabaseServer"  

// GET /api/properties - Get all properties

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const developer = searchParams.get('developer') || 'dubai'; // 'dubai' or 'esgaiher'

    // Mock data for Dubai developer houses (Acube promotion)
    const dubaiDeveloperHouses = [
      {
        id: 'dubai-1',
        title: 'Luxury Villa in Palm Jumeirah',
        description: 'Stunning waterfront villa with private beach access and panoramic views of the Arabian Gulf.',
        price: 8500000,
        location: 'Palm Jumeirah, Dubai, UAE',
        bedrooms: 6,
        bathrooms: 7,
        area: 8500,
        property_type: 'Villa',
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
        ],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner: {
          display_name: 'Acube - Dubai',
          phone: '+971-4-123-4567'
        }
      },
      {
        id: 'dubai-2',
        title: 'Modern Apartment in Downtown Dubai',
        description: 'Contemporary apartment in the heart of Dubai with Burj Khalifa views and premium amenities.',
        price: 3200000,
        location: 'Downtown Dubai, UAE',
        bedrooms: 3,
        bathrooms: 3,
        area: 2200,
        property_type: 'Apartment',
        images: [
          'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
          'https://images.unsplash.com/photo-1600566753086-5f8712952358?w=800'
        ],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner: {
          display_name: 'Acube - Dubai',
          phone: '+971-4-123-4567'
        }
      },
      {
        id: 'dubai-3',
        title: 'Penthouse in Marina Walk',
        description: 'Exclusive penthouse with private terrace overlooking Dubai Marina and the Arabian Gulf.',
        price: 12000000,
        location: 'Dubai Marina, UAE',
        bedrooms: 4,
        bathrooms: 5,
        area: 4500,
        property_type: 'Penthouse',
        images: [
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
          'https://images.unsplash.com/photo-1600566753086-5f8712952358?w=800'
        ],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner: {
          display_name: 'Acube - Dubai',
          phone: '+971-4-123-4567'
        }
      }
    ];

    // Mock data for Anga Esghaier developer houses (Esghaier Immobilier promotion)
    const esgaiherTunisiaHouses = [
      {
        id: 'esgaiher-1',
        title: 'Villa Moderne à Sidi Bou Saïd',
        description: 'Villa contemporaine avec vue sur la mer Méditerranée et architecture traditionnelle tunisienne.',
        price: 450000,
        location: 'Sidi Bou Saïd, Tunis, Tunisie',
        bedrooms: 4,
        bathrooms: 3,
        area: 280,
        property_type: 'Villa',
        images: [
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
          'https://images.unsplash.com/photo-1600566753086-5f8712952358?w=800'
        ],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner: {
          display_name: 'Esghaier Immobilier - Anga Esghaier',
          phone: '+216-71-123-456'
        }
      },
      {
        id: 'esgaiher-2',
        title: 'Appartement de Luxe à Carthage',
        description: 'Appartement haut de gamme dans le quartier historique de Carthage avec vue sur les ruines antiques.',
        price: 320000,
        location: 'Carthage, Tunis, Tunisie',
        bedrooms: 3,
        bathrooms: 2,
        area: 180,
        property_type: 'Apartment',
        images: [
          'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
          'https://images.unsplash.com/photo-1600566753086-5f8712952358?w=800'
        ],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner: {
          display_name: 'Esghaier Immobilier - Anga Esghaier',
          phone: '+216-71-123-456'
        }
      },
      {
        id: 'esgaiher-3',
        title: 'Villa Familiale à La Marsa',
        description: 'Villa spacieuse pour famille avec jardin privé et piscine, proche des plages de La Marsa.',
        price: 680000,
        location: 'La Marsa, Tunis, Tunisie',
        bedrooms: 5,
        bathrooms: 4,
        area: 350,
        property_type: 'Villa',
        images: [
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
          'https://images.unsplash.com/photo-1600566753086-5f8712952358?w=800'
        ],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner: {
          display_name: 'Esghaier Immobilier - Anga Esghaier',
          phone: '+216-71-123-456'
        }
      },
      {
        id: 'esgaiher-4',
        title: 'Studio Moderne à Tunis Centre',
        description: 'Studio moderne et fonctionnel au cœur de Tunis, idéal pour investissement locatif.',
        price: 85000,
        location: 'Tunis Centre, Tunisie',
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        property_type: 'Studio',
        images: [
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
          'https://images.unsplash.com/photo-1600566753086-5f8712952358?w=800'
        ],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner: {
          display_name: 'Esghaier Immobilier - Anga Esghaier',
          phone: '+216-71-123-456'
        }
      }
    ];

    // Filter properties based on developer selection
    let filteredProperties = [];
    
    switch (developer) {
      case 'dubai':
        filteredProperties = dubaiDeveloperHouses;
        break;
      case 'esgaiher':
        filteredProperties = esgaiherTunisiaHouses;
        break;
      default:
        filteredProperties = dubaiDeveloperHouses; // Default to Dubai
        break;
    }

    return NextResponse.json({
      success: true,
      data: filteredProperties,
      developer: developer,
      total: filteredProperties.length
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
