import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    console.log('=== BANK AGENT REGISTRATION REQUEST ===');
    console.log('Content-Type received:', contentType);
    console.log('Request method:', request.method);
    
    // Handle form data (with documents)
    if (contentType && contentType.includes('multipart/form-data')) {
      console.log('=== BANK AGENT REGISTRATION DEBUG ===');
      console.log('Content-Type:', contentType);
      console.log('Processing multipart/form-data request');
      
      const formData = await request.formData();
      
      const personalInfo = JSON.parse(formData.get('personalInfo') as string);
      const bankInfo = JSON.parse(formData.get('bankInfo') as string);
      const userId = formData.get('userId') as string;
      const nationalIdDocument = formData.get('national_id_document') as File;
      const bankEmploymentLetter = formData.get('bank_employment_letter') as File;

      console.log('Form data received:', {
        personalInfo: !!personalInfo,
        bankInfo: !!bankInfo,
        userId,
        nationalIdDocument: nationalIdDocument ? {
          name: nationalIdDocument.name,
          size: nationalIdDocument.size,
          type: nationalIdDocument.type
        } : null,
        bankEmploymentLetter: bankEmploymentLetter ? {
          name: bankEmploymentLetter.name,
          size: bankEmploymentLetter.size,
          type: bankEmploymentLetter.type
        } : null
      });

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

      if (checkError && checkError.code !== 'PGRST116') {
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

      // Create bank agent registration first
      console.log('Creating bank agent registration...');
      const { data: registration, error: insertError } = await supabase
        .from('bank_agent_registrations')
        .insert({
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
          national_id_document: null, // Will be updated after upload
          bank_employment_letter: null, // Will be updated after upload
          status: 'pending',
          submitted_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error creating registration:', insertError);
        return NextResponse.json(
          { success: false, error: 'Failed to create registration' },
          { status: 500 }
        );
      }

      console.log('Registration created successfully with ID:', registration.id);

      // Upload documents to Supabase Storage
      const documentUrls: { national_id_document?: string; bank_employment_letter?: string } = {};

      // Upload National ID Document if provided
      if (nationalIdDocument && nationalIdDocument.size > 0) {
        console.log('Processing National ID Document:', {
          name: nationalIdDocument.name,
          size: nationalIdDocument.size,
          type: nationalIdDocument.type
        });
        
        try {
          const nationalIdBuffer = await nationalIdDocument.arrayBuffer();
          const nationalIdExtension = nationalIdDocument.name.split('.').pop() || 'jpg';
          const nationalIdFileName = `${registration.id}/national_id_${Date.now()}.${nationalIdExtension}`;

          console.log('Uploading National ID Document to:', nationalIdFileName);

          const { data: nationalIdData, error: nationalIdError } = await supabase.storage
            .from('bank-agent-doc')
            .upload(nationalIdFileName, nationalIdBuffer, {
              contentType: nationalIdDocument.type,
              upsert: false
            });

          if (nationalIdError) {
            console.error('National ID Document upload error:', nationalIdError);
          } else {
            console.log('National ID Document uploaded successfully:', nationalIdData);
            const { data: { publicUrl: nationalIdUrl } } = supabase.storage
              .from('bank-agent-doc')
              .getPublicUrl(nationalIdFileName);

            documentUrls.national_id_document = nationalIdUrl;
            console.log('National ID Document URL:', nationalIdUrl);
          }
        } catch (error) {
          console.error('Error processing national ID document:', error);
        }
      } else {
        console.log('No National ID Document provided or file is empty');
      }

      // Upload Bank Employment Letter if provided
      if (bankEmploymentLetter && bankEmploymentLetter.size > 0) {
        console.log('Processing Bank Employment Letter:', {
          name: bankEmploymentLetter.name,
          size: bankEmploymentLetter.size,
          type: bankEmploymentLetter.type
        });
        
        try {
          const bankLetterBuffer = await bankEmploymentLetter.arrayBuffer();
          const bankLetterExtension = bankEmploymentLetter.name.split('.').pop() || 'jpg';
          const bankLetterFileName = `${registration.id}/bank_employment_letter_${Date.now()}.${bankLetterExtension}`;

          console.log('Uploading Bank Employment Letter to:', bankLetterFileName);

          const { data: bankLetterData, error: bankLetterError } = await supabase.storage
            .from('bank-agent-doc')
            .upload(bankLetterFileName, bankLetterBuffer, {
              contentType: bankEmploymentLetter.type,
              upsert: false
            });

          if (bankLetterError) {
            console.error('Bank Employment Letter upload error:', bankLetterError);
          } else {
            console.log('Bank Employment Letter uploaded successfully:', bankLetterData);
            const { data: { publicUrl: bankLetterUrl } } = supabase.storage
              .from('bank-agent-doc')
              .getPublicUrl(bankLetterFileName);

            documentUrls.bank_employment_letter = bankLetterUrl;
            console.log('Bank Employment Letter URL:', bankLetterUrl);
          }
        } catch (error) {
          console.error('Error processing bank employment letter:', error);
        }
      } else {
        console.log('No Bank Employment Letter provided or file is empty');
      }

      // Update registration with document URLs
      console.log('Document URLs to update:', documentUrls);
      const updateData: any = {
        national_id_document: documentUrls.national_id_document || null,
        bank_employment_letter: documentUrls.bank_employment_letter || null,
      };

      console.log('Updating registration with document URLs...');
      const { data: updatedRegistration, error: updateError } = await supabase
        .from('bank_agent_registrations')
        .update(updateData)
        .eq('id', registration.id)
        .select('*')
        .single();

      if (updateError) {
        console.error('Error updating registration:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update registration with document URLs' },
          { status: 500 }
        );
      }

      console.log('Registration updated successfully with document URLs');

      return NextResponse.json({
        success: true,
        message: 'Bank agent registration submitted successfully',
        registration_id: updatedRegistration.id,
        status: 'pending'
      });

    } else {
      // Handle JSON data (without documents)
      console.log('=== BANK AGENT REGISTRATION DEBUG (JSON) ===');
      console.log('Content-Type:', contentType);
      console.log('Processing JSON request');
      
      const body = await request.json();
      const { personalInfo, bankInfo, documents, userId } = body;

      console.log('JSON data received:', {
        personalInfo: !!personalInfo,
        bankInfo: !!bankInfo,
        userId,
        documents: documents || 'none'
      });

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

      if (checkError && checkError.code !== 'PGRST116') {
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

      // Create the bank agent registration
      const { data: registration, error: insertError } = await supabase
        .from('bank_agent_registrations')
        .insert({
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
          national_id_document: null,
          bank_employment_letter: null,
          status: 'pending',
          submitted_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (insertError) {
        console.error('Error creating registration:', insertError);
        return NextResponse.json(
          { success: false, error: 'Failed to create registration' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Bank agent registration submitted successfully',
        registration_id: registration.id,
        status: 'pending'
      });
    }

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
    const fetchAllApproved = searchParams.get('fetch_all_approved');

    // If fetching all approved bank agents (for loan application)
    if (fetchAllApproved === 'true') {
      const { data: approvedAgents, error } = await supabase
        .from('bank_agent_registrations')
        .select('*')
        .eq('status', 'approved')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching approved bank agents:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to fetch approved bank agents' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        registrations: approvedAgents || []
      });
    }

    // Original logic for fetching user-specific registrations
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