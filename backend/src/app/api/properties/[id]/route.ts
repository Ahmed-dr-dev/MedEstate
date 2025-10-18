import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../../lib/supabaseServer";

// GET /api/properties/[id] - Get single property by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
          'http://192.168.100.9:3000/images/anga/acube1.jpg',
          'http://192.168.100.9:3000/images/anga/acube 2.jpg',
          'http://192.168.100.9:3000/images/anga/acube 3.jpg'
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
          'http://192.168.100.9:3000/images/anga/acube1.jpg',
          'http://192.168.100.9:3000/images/anga/acube 2.jpg',
          'http://192.168.100.9:3000/images/anga/acube 3.jpg'
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
          'http://192.168.100.9:3000/images/anga/acube1.jpg',
          'http://192.168.100.9:3000/images/anga/acube 2.jpg',
          'http://192.168.100.9:3000/images/anga/acube 3.jpg'
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
          'http://192.168.100.9:3000/images/anga/Anga.jpg',
          'http://192.168.100.9:3000/images/anga/anga2.jpg',
          'http://192.168.100.9:3000/images/anga/download.jpg'
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
          'http://192.168.100.9:3000/images/anga/Anga.jpg',
          'http://192.168.100.9:3000/images/anga/anga2.jpg',
          'http://192.168.100.9:3000/images/anga/download.jpg'
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
          'http://192.168.100.9:3000/images/anga/Anga.jpg',
          'http://192.168.100.9:3000/images/anga/anga2.jpg',
          'http://192.168.100.9:3000/images/anga/download.jpg'
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
          'http://192.168.100.9:3000/images/anga/Anga.jpg',
          'http://192.168.100.9:3000/images/anga/anga2.jpg',
          'http://192.168.100.9:3000/images/anga/download.jpg'
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
    // Combine all mock properties
    const allMockProperties = [...dubaiDeveloperHouses, ...esgaiherTunisiaHouses];
    
    // Check if the requested property is in mock data
    const mockProperty = allMockProperties.find(prop => prop.id === id);
    
    if (mockProperty) {
      return NextResponse.json({
        success: true,
        data: mockProperty
      });
    }

    // If not in mock data, fetch from database
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
