import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "../../../../../lib/supabaseServer";

export async function GET(request: NextRequest) {
  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      console.error('Error fetching users count:', usersError);
      return NextResponse.json({ success: false, error: 'Failed to fetch users count' }, { status: 500 });
    }

    // Get total bank agent registrations count
    const { count: totalBankAgentRegistrations, error: bankAgentError } = await supabase
      .from('bank_agent_registrations')
      .select('*', { count: 'exact', head: true });

    if (bankAgentError) {
      console.error('Error fetching bank agent registrations count:', bankAgentError);
      return NextResponse.json({ success: false, error: 'Failed to fetch bank agent registrations count' }, { status: 500 });
    }

    // Get total properties count
    const { count: totalProperties, error: propertiesError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    if (propertiesError) {
      console.error('Error fetching properties count:', propertiesError);
      return NextResponse.json({ success: false, error: 'Failed to fetch properties count' }, { status: 500 });
    }

    // Get total loan applications count
    const { count: totalLoanApplications, error: loanApplicationsError } = await supabase
      .from('loan_applications')
      .select('*', { count: 'exact', head: true });

    if (loanApplicationsError) {
      console.error('Error fetching loan applications count:', loanApplicationsError);
      return NextResponse.json({ success: false, error: 'Failed to fetch loan applications count' }, { status: 500 });
    }

    // Get bank agent registrations by status
    const { data: bankAgentStatusData, error: bankAgentStatusError } = await supabase
      .from('bank_agent_registrations')
      .select('status');

    if (bankAgentStatusError) {
      console.error('Error fetching bank agent status data:', bankAgentStatusError);
      return NextResponse.json({ success: false, error: 'Failed to fetch bank agent status data' }, { status: 500 });
    }

    // Get loan applications by status
    const { data: loanApplicationStatusData, error: loanApplicationStatusError } = await supabase
      .from('loan_applications')
      .select('status');

    if (loanApplicationStatusError) {
      console.error('Error fetching loan application status data:', loanApplicationStatusError);
      return NextResponse.json({ success: false, error: 'Failed to fetch loan application status data' }, { status: 500 });
    }

    // Calculate bank agent status counts
    const bankAgentStatusCounts = {
      pending: bankAgentStatusData?.filter((item: { status: string }) => item.status === 'pending').length || 0,
      approved: bankAgentStatusData?.filter((item: { status: string }) => item.status === 'approved').length || 0,
      rejected: bankAgentStatusData?.filter((item: { status: string }) => item.status === 'rejected').length || 0,
    };

    // Calculate loan application status counts
    const loanApplicationStatusCounts = {
      pending: loanApplicationStatusData?.filter((item: { status: string }) => item.status === 'pending').length || 0,
      under_review: loanApplicationStatusData?.filter((item: { status: string }) => item.status === 'under_review').length || 0,
      approved: loanApplicationStatusData?.filter((item: { status: string }) => item.status === 'approved').length || 0,
      rejected: loanApplicationStatusData?.filter((item: { status: string })           => item.status === 'rejected').length || 0,
    };

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { count: recentUsers, error: recentUsersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    const { count: recentProperties, error: recentPropertiesError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    const { count: recentLoanApplications, error: recentLoanApplicationsError } = await supabase
      .from('loan_applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    const { count: recentBankAgentRequests, error: recentBankAgentRequestsError } = await supabase
      .from('bank_agent_registrations')
      .select('*', { count: 'exact', head: true })
      .gte('submitted_at', sevenDaysAgo.toISOString());

    // Get bank agent performance metrics
    const { data: bankAgentPerformance, error: bankAgentPerformanceError } = await supabase
      .from('loan_applications')
      .select(`
        id,
        status,
        bank_agent_decision,
        created_at,
        bank_agent:bank_agent_registrations!loan_applications_bank_agent_id_fkey (
          id,
          bank_name,
          position,
          user:profiles!bank_agent_registrations_user_id_fkey (
            display_name
          )
        )
      `)
      .not('bank_agent_id', 'is', null);

    // Calculate bank agent performance metrics
    let bankAgentMetrics = {};
    if (bankAgentPerformance && !bankAgentPerformanceError) {
      const agentStats = bankAgentPerformance.reduce((acc: any, application: any) => {
        const agentId = application.bank_agent?.id;
        const agentName = application.bank_agent?.user?.display_name || 'Unknown';
        const bankName = application.bank_agent?.bank_name || 'Unknown Bank';
        
        if (!acc[agentId]) {
          acc[agentId] = {
            agent_name: agentName,
            bank_name: bankName,
            total_applications: 0,
            approved: 0,
            rejected: 0,
            pending: 0,
            approval_rate: 0
          };
        }
        
        acc[agentId].total_applications++;
        
        if (application.bank_agent_decision === 'approved') {
          acc[agentId].approved++;
        } else if (application.bank_agent_decision === 'rejected') {
          acc[agentId].rejected++;
        } else {
          acc[agentId].pending++;
        }
        
        return acc;
      }, {});
      
      // Calculate approval rates
      Object.keys(agentStats).forEach(agentId => {
        const agent = agentStats[agentId];
        const totalDecided = agent.approved + agent.rejected;
        agent.approval_rate = totalDecided > 0 ? (agent.approved / totalDecided * 100).toFixed(1) : 0;
      });
      
      bankAgentMetrics = {
        top_performers: Object.values(agentStats)
          .sort((a: any, b: any) => parseFloat(b.approval_rate) - parseFloat(a.approval_rate))
          .slice(0, 5),
        total_agents_with_applications: Object.keys(agentStats).length
      };
    }

    const stats = {
      totalUsers: totalUsers || 0,
      totalBankAgentRegistrations: totalBankAgentRegistrations || 0,
      totalProperties: totalProperties || 0,
      totalLoanApplications: totalLoanApplications || 0,
      bankAgentStatusCounts,
      loanApplicationStatusCounts,
      recentActivity: {
        users: recentUsers || 0,
        properties: recentProperties || 0,
        loanApplications: recentLoanApplications || 0,
        bankAgentRequests: recentBankAgentRequests || 0,
      },
      bankAgentMetrics,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
