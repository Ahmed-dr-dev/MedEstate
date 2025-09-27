import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../lib/supabaseServer";

// GET /api/loan-applications - Get all loan applications for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicant_id = searchParams.get('applicant_id');

    if (!applicant_id) {
      return NextResponse.json(
        { success: false, error: 'applicant_id is required' },
        { status: 400 }
      );
    }

    const { data: loanApplications, error } = await supabase
      .from('loan_applications')
      .select(`
        *,
        property:properties!loan_applications_property_id_fkey (
          id,
          title,
          price,
          location,
          images
        )
      `)
      .eq('applicant_id', applicant_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching loan applications:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch loan applications' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: loanApplications
    });

  } catch (error) {
    console.error('Loan applications GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/loan-applications - Create new loan application
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    
    // Handle form data (with documents)
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      const applicant_id = formData.get('applicant_id') as string;
      const property_id = formData.get('property_id') as string;
      const loan_amount = formData.get('loan_amount') as string;
      const loan_term_years = formData.get('loan_term_years') as string;
      const interest_rate = formData.get('interest_rate') as string;
      const monthly_payment = formData.get('monthly_payment') as string;
      const employment_status = formData.get('employment_status') as string;
      const annual_income = formData.get('annual_income') as string;
      const selected_bank_id = formData.get('selected_bank_id') as string;
      const include_insurance = formData.get('include_insurance') === 'true';
      const monthly_insurance_amount = formData.get('monthly_insurance_amount') as string;
      const identity_card = formData.get('identity_card') as File;
      const proof_of_income = formData.get('proof_of_income') as File;

      // Validate required fields
      if (!applicant_id || !loan_amount || !loan_term_years || !employment_status || !annual_income) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields: applicant_id, loan_amount, loan_term_years, employment_status, annual_income' },
          { status: 400 }
        );
      }

      // Verify applicant exists
      const { data: applicant, error: applicantError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', applicant_id)
        .single();

      if (applicantError || !applicant) {
        return NextResponse.json(
          { success: false, error: 'Invalid applicant ID' },
          { status: 400 }
        );
      }

      // If property_id is provided and not empty, verify property exists
      if (property_id && property_id.trim() !== '') {
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select('id')
          .eq('id', property_id)
          .single();

        if (propertyError || !property) {
          return NextResponse.json(
            { success: false, error: 'Invalid property ID' },
            { status: 400 }
          );
        }
      }

      // Create loan application first
      const { data: loanApplication, error: insertError } = await supabase
        .from('loan_applications')
        .insert({
          applicant_id,
          property_id: property_id || null,
          loan_amount: parseFloat(loan_amount),
          loan_term_years: parseInt(loan_term_years),
          interest_rate: interest_rate ? parseFloat(interest_rate) : null,
          monthly_payment: monthly_payment ? parseFloat(monthly_payment) : null,
          employment_status,
          annual_income: parseFloat(annual_income),
          identity_card_image: null, // Will be updated after upload
          proof_of_income_image: null, // Will be updated after upload
          selected_bank_id: selected_bank_id || null,
          include_insurance: include_insurance || false,
          monthly_insurance_amount: monthly_insurance_amount ? parseFloat(monthly_insurance_amount) : null,
          status: 'pending',
          submitted_documents: [],
          bank_agent_decision: null,
          bank_agent_notes: null,
          bank_agent_id: null
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error creating loan application:', insertError);
        return NextResponse.json(
          { success: false, error: 'Failed to create loan application' },
          { status: 500 }
        );
      }

      // Upload documents to Supabase Storage
      const uploadedDocuments: string[] = [];
      const documentUrls: { identity_card?: string; proof_of_income?: string } = {};
      const folderPath = `loan-applications/${loanApplication.id}`;

      // Upload Identity Card if provided
      if (identity_card && identity_card.size > 0) {
        try {
          const identityCardBuffer = await identity_card.arrayBuffer();
          const identityCardExtension = identity_card.name.split('.').pop() || 'jpg';
          const identityCardFileName = `identity_card_${Date.now()}.${identityCardExtension}`;
          const identityCardPath = `${folderPath}/${identityCardFileName}`;

          const { data: identityCardData, error: identityCardError } = await supabase.storage
            .from('loan-application-documents')
            .upload(identityCardPath, identityCardBuffer, {
              contentType: identity_card.type,
              upsert: false
            });

          if (identityCardError) {
            console.error('Error uploading identity card:', identityCardError);
            return NextResponse.json(
              { success: false, error: 'Failed to upload identity card' },
              { status: 500 }
            );
          }

          // Get public URL
          const { data: { publicUrl: identityCardUrl } } = supabase.storage
            .from('loan-application-documents')
            .getPublicUrl(identityCardPath);

          documentUrls.identity_card = identityCardUrl;
          uploadedDocuments.push(`Identity Card: ${identity_card.name}`);

        } catch (error) {
          console.error('Error processing identity card:', error);
          return NextResponse.json(
            { success: false, error: 'Failed to process identity card' },
            { status: 500 }
          );
        }
      }

      // Upload Proof of Income if provided
      if (proof_of_income && proof_of_income.size > 0) {
        try {
          const proofOfIncomeBuffer = await proof_of_income.arrayBuffer();
          const proofOfIncomeExtension = proof_of_income.name.split('.').pop() || 'jpg';
          const proofOfIncomeFileName = `proof_of_income_${Date.now()}.${proofOfIncomeExtension}`;
          const proofOfIncomePath = `${folderPath}/${proofOfIncomeFileName}`;

          const { data: proofOfIncomeData, error: proofOfIncomeError } = await supabase.storage
            .from('loan-application-documents')
            .upload(proofOfIncomePath, proofOfIncomeBuffer, {
              contentType: proof_of_income.type,
              upsert: false
            });

          if (proofOfIncomeError) {
            console.error('Error uploading proof of income:', proofOfIncomeError);
            return NextResponse.json(
              { success: false, error: 'Failed to upload proof of income' },
              { status: 500 }
            );
          }

          // Get public URL
          const { data: { publicUrl: proofOfIncomeUrl } } = supabase.storage
            .from('loan-application-documents')
            .getPublicUrl(proofOfIncomePath);

          documentUrls.proof_of_income = proofOfIncomeUrl;
          uploadedDocuments.push(`Proof of Income: ${proof_of_income.name}`);

        } catch (error) {
          console.error('Error processing proof of income:', error);
          return NextResponse.json(
            { success: false, error: 'Failed to process proof of income' },
            { status: 500 }
          );
        }
      }

      // Update loan application with document URLs
      const updateData: any = {
        identity_card_image: documentUrls.identity_card || null,
        proof_of_income_image: documentUrls.proof_of_income || null,
        submitted_documents: uploadedDocuments
      };

      const { data: updatedApplication, error: updateError } = await supabase
        .from('loan_applications')
        .update(updateData)
        .eq('id', loanApplication.id)
        .select(`
          *,
          property:properties!loan_applications_property_id_fkey (
            id,
            title,
            price,
            location,
            images
          )
        `)
        .single();

      if (updateError) {
        console.error('Error updating loan application:', updateError);
        return NextResponse.json(
          { success: false, error: 'Failed to update loan application with document URLs' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedApplication,
        message: `Loan application created successfully with ${uploadedDocuments.length} document(s)`
      }, { status: 201 });

    } else {
      // Handle JSON data (without documents)
      const body = await request.json();

      const {
        applicant_id,
        property_id,
        loan_amount,
        loan_term_years,
        interest_rate,
        monthly_payment,
        employment_status,
        annual_income,
        identity_card_image,
        proof_of_income_image,
        selected_bank_id,
        include_insurance,
        monthly_insurance_amount,
        submitted_documents = []
      } = body;

      // Validate required fields
      if (!applicant_id || !loan_amount || !loan_term_years || !employment_status || !annual_income) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields: applicant_id, loan_amount, loan_term_years, employment_status, annual_income' },
          { status: 400 }
        );
      }

      // Verify applicant exists
      const { data: applicant, error: applicantError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', applicant_id)
        .single();

      if (applicantError || !applicant) {
        return NextResponse.json(
          { success: false, error: 'Invalid applicant ID' },
          { status: 400 }
        );
      }

      // If property_id is provided and not empty, verify property exists
      if (property_id && property_id.trim() !== '') {
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select('id')
          .eq('id', property_id)
          .single();

        if (propertyError || !property) {
          return NextResponse.json(
            { success: false, error: 'Invalid property ID' },
            { status: 400 }
          );
        }
      }

      // Create loan application with all fields
      const { data: loanApplication, error: insertError } = await supabase
        .from('loan_applications')
        .insert({
          applicant_id,
          property_id: property_id || null,
          loan_amount: parseFloat(loan_amount),
          loan_term_years: parseInt(loan_term_years),
          interest_rate: interest_rate ? parseFloat(interest_rate) : null,
          monthly_payment: monthly_payment ? parseFloat(monthly_payment) : null,
          employment_status,
          annual_income: parseFloat(annual_income),
          identity_card_image: identity_card_image || null,
          proof_of_income_image: proof_of_income_image || null,
          selected_bank_id: selected_bank_id || null,
          include_insurance: include_insurance || false,
          monthly_insurance_amount: monthly_insurance_amount ? parseFloat(monthly_insurance_amount) : null,
          status: 'pending',
          submitted_documents,
          bank_agent_decision: null,
          bank_agent_notes: null,
          bank_agent_id: null
        })
        .select(`
          *,
          property:properties!loan_applications_property_id_fkey (
            id,
            title,
            price,
            location,
            images
          )
        `)
        .single();

      if (insertError) {
        console.error('Error creating loan application:', insertError);
        return NextResponse.json(
          { success: false, error: 'Failed to create loan application' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: loanApplication,
        message: 'Loan application created successfully'
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Loan applications POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
