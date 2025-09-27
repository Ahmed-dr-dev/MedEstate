import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { personalInfo, bankInfo, documents, userId } = body;

    // Validate required fields
    if (!personalInfo || !bankInfo || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required information' },
        { status: 400 }
      );
    }

    // Validate personal information
    const requiredPersonalFields = ['firstName', 'lastName', 'dateOfBirth', 'nationalId', 'phone', 'address', 'city'];
    for (const field of requiredPersonalFields) {
      if (!personalInfo[field] || personalInfo[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, error: `Missing required personal field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate bank information
    const requiredBankFields = ['bankName', 'position', 'employeeId', 'department', 'supervisorPhone'];
    for (const field of requiredBankFields) {
      if (!bankInfo[field] || bankInfo[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, error: `Missing required bank field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate Tunisian phone format (8 digits)
    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(bankInfo.supervisorPhone)) {
      return NextResponse.json(
        { success: false, error: 'Supervisor phone must be 8 digits (Tunisian format)' },
        { status: 400 }
      );
    }


    // Check if user already has a pending or approved registration
    const { data: existingRegistration, error: checkError } = await supabase
      .from('bank_agent_registrations')
      .select('id, status')
      .eq('user_id', userId)
      .in('status', ['pending', 'approved'])
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing registration:', checkError);
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      );
    }

    if (existingRegistration) {
      return NextResponse.json(
        { 
          success: false, 
          error: `You already have a ${existingRegistration.status} registration. Please wait for admin review.` 
        },
        { status: 400 }
      );
    }

    // Convert date from DD/MM/YYYY to YYYY-MM-DD format
    const convertDateFormat = (dateString: string) => {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    // Upload documents to Supabase Storage (using same logic as properties)
    let nationalIdDocumentUrl = null;
    let bankEmploymentLetterUrl = null;

    if (documents.nationalIdDocument) {
      try {
        // Convert base64 to buffer
        const base64Data = documents.nationalIdDocument.split(',')[1] || documents.nationalIdDocument;
        const arrayBuffer = Buffer.from(base64Data, 'base64');
        const fileExtension = 'jpg'; // Default extension
        const fileName = `bank-agent-${userId}/national-id-${Date.now()}.${fileExtension}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('bank-documents')
          .upload(fileName, arrayBuffer, {
            contentType: 'image/jpeg',
            upsert: false
          });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('bank-documents')
            .getPublicUrl(fileName);
          nationalIdDocumentUrl = publicUrl;
        } else {
          console.error('Error uploading national ID document:', uploadError);
          nationalIdDocumentUrl = documents.nationalIdDocument; // fallback
        }
      } catch (error) {
        console.error('Error processing national ID document:', error);
        nationalIdDocumentUrl = documents.nationalIdDocument; // fallback
      }
    }

    if (documents.bankEmploymentLetter) {
      try {
        // Convert base64 to buffer
        const base64Data = documents.bankEmploymentLetter.split(',')[1] || documents.bankEmploymentLetter;
        const arrayBuffer = Buffer.from(base64Data, 'base64');
        const fileExtension = 'jpg'; // Default extension
        const fileName = `bank-agent-${userId}/employment-letter-${Date.now()}.${fileExtension}`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('bank-documents')
          .upload(fileName, arrayBuffer, {
            contentType: 'image/jpeg',
            upsert: false
          });

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('bank-documents')
            .getPublicUrl(fileName);
          bankEmploymentLetterUrl = publicUrl;
        } else {
          console.error('Error uploading employment letter:', uploadError);
          bankEmploymentLetterUrl = documents.bankEmploymentLetter; // fallback
        }
      } catch (error) {
        console.error('Error processing employment letter:', error);
        bankEmploymentLetterUrl = documents.bankEmploymentLetter; // fallback
      }
    }

    // Create the bank agent registration
    const registrationData = {
      user_id: userId,
      first_name: personalInfo.firstName,
      last_name: personalInfo.lastName,
      date_of_birth: convertDateFormat(personalInfo.dateOfBirth),
      national_id: personalInfo.nationalId,
      phone: personalInfo.phone,
      address: personalInfo.address,
      city: personalInfo.city,
      postal_code: personalInfo.postalCode || null,
      bank_name: bankInfo.bankName,
      position: bankInfo.position,
      employee_id: bankInfo.employeeId,
      department: bankInfo.department,
      work_address: bankInfo.workAddress || null,
      supervisor_name: bankInfo.supervisorName || null,
      supervisor_phone: bankInfo.supervisorPhone,
      national_id_document: nationalIdDocumentUrl,
      bank_employment_letter: bankEmploymentLetterUrl,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };

    const { data: registration, error: insertError } = await supabase
      .from('bank_agent_registrations')
      .insert([registrationData])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating registration:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    // Update user's registration status (skip if column doesn't exist)
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user status:', updateError);
        // Don't fail the request, just log the error
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      message: 'Bank agent registration submitted successfully',
      registration_id: registration.id,
      status: 'pending'
    });

  } catch (error) {
    console.error('Bank agent registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const status = searchParams.get('status');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    let query = supabase
      .from('bank_agent_registrations')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: registrations, error } = await query;

    if (error) {
      console.error('Error fetching registrations:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch registrations' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      registrations: registrations || []
    });

  } catch (error) {
    console.error('Error fetching bank agent registrations:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
