import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../../lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build base query
    let query = supabase
      .from('bank_agent_registrations')
      .select('*')
      .order('submitted_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    const { data: bankAgentRequests, error: requestsError } = await query;

    if (requestsError) {
      console.error('Error fetching bank agent requests:', requestsError);
      return NextResponse.json({ success: false, error: 'Failed to fetch bank agent requests' }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('bank_agent_registrations')
      .select('*', { count: 'exact', head: true });

    if (status) {
      countQuery = countQuery.eq('status', status);
    }

    const { count: totalCount, error: countError } = await countQuery;

    if (countError) {
      console.error('Error fetching bank agent requests count:', countError);
      return NextResponse.json({ success: false, error: 'Failed to fetch bank agent requests count' }, { status: 500 });
    }

    // Get status breakdown
    const { data: statusData, error: statusError } = await supabase
      .from('bank_agent_registrations')
      .select('status');

    if (statusError) {
      console.error('Error fetching status data:', statusError);
    }

    const statusCounts = {
      pending: statusData?.filter(item => item.status === 'pending').length || 0,
      approved: statusData?.filter(item => item.status === 'approved').length || 0,
      rejected: statusData?.filter(item => item.status === 'rejected').length || 0,
    };

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentRequests, error: recentError } = await supabase
      .from('bank_agent_registrations')
      .select('*', { count: 'exact', head: true })
      .gte('submitted_at', sevenDaysAgo.toISOString());

    // Transform the data for better frontend consumption
    const transformedRequests = bankAgentRequests?.map(request => ({
      id: request.id,
      user_id: request.user_id,
      first_name: request.first_name,
      last_name: request.last_name,
      full_name: `${request.first_name} ${request.last_name}`,
      date_of_birth: request.date_of_birth,
      national_id: request.national_id,
      phone: request.phone,
      address: request.address,
      city: request.city,
      postal_code: request.postal_code,
      bank_name: request.bank_name,
      position: request.position,
      employee_id: request.employee_id,
      department: request.department,
      work_address: request.work_address,
      supervisor_name: request.supervisor_name,
      supervisor_phone: request.supervisor_phone,
      national_id_document: request.national_id_document,
      bank_employment_letter: request.bank_employment_letter,
      status: request.status,
      submitted_at: request.submitted_at,
      reviewed_at: request.reviewed_at,
      admin_notes: request.admin_notes,
      // Calculate age from date of birth
      age: request.date_of_birth ? Math.floor((new Date().getTime() - new Date(request.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null,
      // Format dates for display
      formatted_submitted_at: new Date(request.submitted_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      formatted_reviewed_at: request.reviewed_at ? new Date(request.reviewed_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : null
    })) || [];

    return NextResponse.json({
      success: true,
      data: {
        requests: transformedRequests,
        pagination: {
          page,
          limit,
          total: totalCount || 0,
          totalPages: Math.ceil((totalCount || 0) / limit),
        },
        statusCounts,
        recentActivity: {
          requests: recentRequests || 0,
        }
      },
    });

  } catch (error) {
    console.error('Error fetching admin bank agent requests:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, admin_notes, rejection_reason } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be pending, approved, or rejected' },
        { status: 400 }
      );
    }

    // Require rejection reason when rejecting
    if (status === 'rejected' && !rejection_reason) {
      return NextResponse.json(
        { success: false, error: 'Rejection reason is required when rejecting' },
        { status: 400 }
      );
    }

    // Update bank agent registration
    const updateData: any = {
      status,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (admin_notes) {
      updateData.admin_notes = admin_notes;
    }

    if (rejection_reason) {
      updateData.rejection_reason = rejection_reason;
    }

    const { data: updatedRequest, error: updateError } = await supabase
      .from('bank_agent_registrations')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating bank agent request:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update bank agent request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedRequest,
      message: 'Bank agent request updated successfully'
    });

  } catch (error) {
    console.error('Error updating bank agent request:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
