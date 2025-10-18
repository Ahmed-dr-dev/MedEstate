import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../lib/supabaseServer";

// GET /api/loan-applications - Get all loan applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicant_id = searchParams.get('applicant_id');

    let query = supabase
      .from('loan_applications')
      .select(`
        *,
        applicant:profiles!loan_applications_applicant_id_fkey (
          id,
          display_name,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    if (applicant_id) {
      query = query.eq('applicant_id', applicant_id);
    }

    const { data: loanApplications, error } = await query;

    if (error) {
      console.error('Error fetching loan applications:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch loan applications' },
        { status: 500 }
      );
    }

    // Transform the data to include parsed property information from submitted_documents
    const transformedApplications = loanApplications?.map(app => {
      let propertyInfo = null;
      
      // Extract property information from submitted_documents
      if (app.submitted_documents && app.submitted_documents.length > 0) {
        const propertyDoc = app.submitted_documents.find((doc: any) => 
          typeof doc === 'string' && doc.startsWith('Property:')
        );
        
        if (propertyDoc) {
          // Parse "Property: Title - Location - Price"
          const parts = propertyDoc.replace('Property: ', '').split(' - ');
          if (parts.length >= 3) {
            propertyInfo = {
              title: parts[0],
              location: parts[1],
              price: parts[2]
            };
          }
        }
      }

      return {
        ...app,
        property_info: propertyInfo
      };
    }) || [];

    return NextResponse.json({
      success: true,
      applications: transformedApplications
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
    
    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle form data with file uploads
      const formData = await request.formData();
      
      // Extract form fields
      const applicant_id = formData.get('applicant_id') as string;
      const property_id = formData.get('property_id') as string;
      const property_title = formData.get('property_title') as string;
      const property_location = formData.get('property_location') as string;
      const property_price = formData.get('property_price') as string;
      const loan_amount = formData.get('loan_amount') as string;
      const loan_term_years = formData.get('loan_term_years') as string;
      const interest_rate = formData.get('interest_rate') as string;
      const monthly_payment = formData.get('monthly_payment') as string;
      const employment_status = formData.get('employment_status') as string;
      const annual_income = formData.get('annual_income') as string;
      const bank_agent_id = formData.get('bank_agent_id') as string;
      const include_insurance = formData.get('include_insurance') === 'true';
      const monthly_insurance_amount = formData.get('monthly_insurance_amount') as string;
      const identity_card = formData.get('identity_card') as File;
      const proof_of_income = formData.get('proof_of_income') as File;

      // Validate required fields
      if (!applicant_id || !loan_amount || !loan_term_years || !employment_status || !annual_income) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Prepare submitted documents array (text array)
      const submittedDocuments = [];
      
      // Add property information to documents
      if (property_title || property_location || property_price) {
        submittedDocuments.push(`Property: ${property_title || 'N/A'} - ${property_location || 'N/A'} - ${property_price || 'N/A'}`);
      }

      // Add employment information
      if (employment_status) {
        submittedDocuments.push(`Employment Status: ${employment_status}`);
      }

      // Add insurance information if included
      if (include_insurance && monthly_insurance_amount) {
        submittedDocuments.push(`Insurance: ${monthly_insurance_amount} per month`);
      }

      // Upload identity card image if provided
      let identityCardUrl = null;
      if (identity_card && identity_card.size > 0) {
        try {
          const identityCardBuffer = await identity_card.arrayBuffer();
          const identityCardExtension = identity_card.name.split('.').pop() || 'jpg';
          const identityCardFileName = `identity_${Date.now()}.${identityCardExtension}`;

          const { data: identityCardData, error: identityCardError } = await supabase.storage
            .from('loan-application-documents')
            .upload(identityCardFileName, identityCardBuffer, {
              contentType: identity_card.type,
              upsert: false
            });

          if (!identityCardError) {
            const { data: { publicUrl } } = supabase.storage
              .from('loan-application-documents')
              .getPublicUrl(identityCardFileName);

            identityCardUrl = publicUrl;
            submittedDocuments.push(`Identity Card: ${identity_card.name} - ${publicUrl}`);
          }
        } catch (error) {
          console.error('Error uploading identity card:', error);
        }
      }

      // Upload proof of income image if provided
      let proofOfIncomeUrl = null;
      if (proof_of_income && proof_of_income.size > 0) {
        try {
          const proofOfIncomeBuffer = await proof_of_income.arrayBuffer();
          const proofOfIncomeExtension = proof_of_income.name.split('.').pop() || 'jpg';
          const proofOfIncomeFileName = `income_${Date.now()}.${proofOfIncomeExtension}`;

          const { data: proofOfIncomeData, error: proofOfIncomeError } = await supabase.storage
            .from('loan-application-documents')
            .upload(proofOfIncomeFileName, proofOfIncomeBuffer, {
              contentType: proof_of_income.type,
              upsert: false
            });

          if (!proofOfIncomeError) {
            const { data: { publicUrl } } = supabase.storage
              .from('loan-application-documents')
              .getPublicUrl(proofOfIncomeFileName);

            proofOfIncomeUrl = publicUrl;
            submittedDocuments.push(`Proof of Income: ${proof_of_income.name} - ${publicUrl}`);
          }
        } catch (error) {
          console.error('Error uploading proof of income:', error);
        }
      }

      // Create loan application
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
          identity_card_image: identityCardUrl,
          proof_of_income_image: proofOfIncomeUrl,
          bank_agent_id: null, // Set to null since we don't have a valid UUID
          include_insurance: include_insurance || false,
          monthly_insurance_amount: monthly_insurance_amount ? parseFloat(monthly_insurance_amount) : null,
          status: 'pending',
          submitted_documents: submittedDocuments,
          bank_agent_decision: null,
          bank_agent_notes: null
        })
        .select('*')
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

    } else {
      // Handle JSON data (without file uploads)
      const body = await request.json();

      const {
        applicant_id,
        property_id,
        property_title,
        property_location,
        property_price,
        loan_amount,
        loan_term_years,
        interest_rate,
        monthly_payment,
        employment_status,
        annual_income,
        identity_card_image,
        proof_of_income_image,
        bank_agent_id,
        include_insurance,
        monthly_insurance_amount,
        submitted_documents = []
      } = body;

      // Validate required fields
      if (!applicant_id || !loan_amount || !loan_term_years || !employment_status || !annual_income) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Prepare submitted documents array (text array)
      const documents = [...submitted_documents];
      
      // Add property information to documents
      if (property_title || property_location || property_price) {
        documents.push(`Property: ${property_title || 'N/A'} - ${property_location || 'N/A'} - ${property_price || 'N/A'}`);
      }

      // Add employment information
      if (employment_status) {
        documents.push(`Employment Status: ${employment_status}`);
      }

      // Add insurance information if included
      if (include_insurance && monthly_insurance_amount) {
        documents.push(`Insurance: ${monthly_insurance_amount} per month`);
      }

      // Create loan application
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
          bank_agent_id: null, // Set to null since we don't have a valid UUID
          include_insurance: include_insurance || false,
          monthly_insurance_amount: monthly_insurance_amount ? parseFloat(monthly_insurance_amount) : null,
          status: 'pending',
          submitted_documents: documents,
          bank_agent_decision: null,
          bank_agent_notes: null
        })
        .select('*')
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