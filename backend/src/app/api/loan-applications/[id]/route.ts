import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../../lib/supabaseServer";

// GET /api/loan-applications/[id] - Get specific loan application
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: loanApplication, error } = await supabase
      .from('loan_applications')
      .select(`
        *,
        applicant:profiles!loan_applications_applicant_id_fkey (
          id,
          display_name,
          phone
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching loan application:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch loan application' },
        { status: 500 }
      );
    }

    if (!loanApplication) {
      return NextResponse.json(
        { success: false, error: 'Loan application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: loanApplication
    });

  } catch (error) {
    console.error('Loan application GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/loan-applications/[id] - Update loan application
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      loan_amount,
      interest_rate,
      loan_term_years,
      monthly_payment,
      status,
      submitted_documents,
      loan_decision,
      bank_agent_decision,
      bank_agent_notes,
      include_insurance,
      monthly_insurance_amount
    } = body;

    // Check if loan application exists
    const { data: existingApplication, error: checkError } = await supabase
      .from('loan_applications')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingApplication) {
      return NextResponse.json(
        { success: false, error: 'Loan application not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (loan_amount !== undefined) updateData.loan_amount = parseFloat(loan_amount);
    if (interest_rate !== undefined) updateData.interest_rate = interest_rate ? parseFloat(interest_rate) : null;
    if (loan_term_years !== undefined) updateData.loan_term_years = parseInt(loan_term_years);
    if (monthly_payment !== undefined) updateData.monthly_payment = monthly_payment ? parseFloat(monthly_payment) : null;
    if (status !== undefined) updateData.status = status;
    if (submitted_documents !== undefined) updateData.submitted_documents = submitted_documents;
    if (loan_decision !== undefined) updateData.loan_decision = loan_decision;
    if (bank_agent_decision !== undefined) updateData.bank_agent_decision = bank_agent_decision;
    if (bank_agent_notes !== undefined) updateData.bank_agent_notes = bank_agent_notes;
    if (include_insurance !== undefined) updateData.include_insurance = include_insurance;
    if (monthly_insurance_amount !== undefined) updateData.monthly_insurance_amount = monthly_insurance_amount ? parseFloat(monthly_insurance_amount) : null;

    // Update loan application
    const { data: updatedApplication, error: updateError } = await supabase
      .from('loan_applications')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating loan application:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update loan application' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedApplication,
      message: 'Loan application updated successfully'
    });

  } catch (error) {
    console.error('Loan application PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/loan-applications/[id] - Delete loan application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if loan application exists
    const { data: existingApplication, error: checkError } = await supabase
      .from('loan_applications')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError || !existingApplication) {
      return NextResponse.json(
        { success: false, error: 'Loan application not found' },
        { status: 404 }
      );
    }

    // Delete loan application
    const { error: deleteError } = await supabase
      .from('loan_applications')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting loan application:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete loan application' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Loan application deleted successfully'
    });

  } catch (error) {
    console.error('Loan application DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
