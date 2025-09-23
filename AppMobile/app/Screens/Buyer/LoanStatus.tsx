import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import BuyerBottomNavigation from '../../../components/Buyer/BottomNavigation';

interface LoanApplication {
  id: string;
  propertyTitle: string;
  loanAmount: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedDate: string;
  lastUpdated: string;
  bankAgent?: string;
  insuranceOffers?: InsuranceOffer[];
}

interface InsuranceOffer {
  id: string;
  provider: string;
  type: string;
  monthlyPremium: number;
  coverage: number;
  description: string;
}

export default function LoanStatus() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'under_review': return '#3b82f6';
      case 'approved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending Review';
      case 'under_review': return 'Under Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const handleSelectInsurance = (applicationId: string, insuranceId: string) => {
    Alert.alert(
      'Select Insurance',
      'Are you sure you want to select this insurance offer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Select',
          onPress: () => {
            Alert.alert('Success', 'Insurance selected successfully!');
          }
        }
      ]
    );
  };

  const renderInsuranceOffers = (offers: InsuranceOffer[], applicationId: string) => {
    if (!offers || offers.length === 0) return null;

    return (
      <View style={styles.insuranceSection}>
        <Text style={styles.insuranceTitle}>Insurance Offers</Text>
        {offers.map((offer) => (
          <View key={offer.id} style={styles.insuranceCard}>
            <View style={styles.insuranceHeader}>
              <Text style={styles.insuranceProvider}>{offer.provider}</Text>
              <Text style={styles.insuranceType}>{offer.type}</Text>
            </View>
            <Text style={styles.insuranceDescription}>{offer.description}</Text>
            <View style={styles.insuranceDetails}>
              <View style={styles.insuranceDetail}>
                <Text style={styles.insuranceLabel}>Monthly Premium</Text>
                <Text style={styles.insuranceValue}>${offer.monthlyPremium}/mo</Text>
              </View>
              <View style={styles.insuranceDetail}>
                <Text style={styles.insuranceLabel}>Coverage</Text>
                <Text style={styles.insuranceValue}>${offer.coverage.toLocaleString()}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.selectInsuranceButton}
              onPress={() => handleSelectInsurance(applicationId, offer.id)}
            >
              <Text style={styles.selectInsuranceButtonText}>Select This Plan</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderApplication = (application: LoanApplication) => (
    <View key={application.id} style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <Text style={styles.propertyTitle}>{application.propertyTitle}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) }]}>
          <Text style={styles.statusText}>{getStatusText(application.status)}</Text>
        </View>
      </View>

      <View style={styles.applicationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Loan Amount:</Text>
          <Text style={styles.detailValue}>${application.loanAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Submitted:</Text>
          <Text style={styles.detailValue}>{application.submittedDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Updated:</Text>
          <Text style={styles.detailValue}>{application.lastUpdated}</Text>
        </View>
        {application.bankAgent && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bank Agent:</Text>
            <Text style={styles.detailValue}>{application.bankAgent}</Text>
          </View>
        )}
      </View>

      {application.status === 'approved' && renderInsuranceOffers(application.insuranceOffers || [], application.id)}

      {application.status === 'rejected' && (
        <View style={styles.rejectionSection}>
          <Text style={styles.rejectionTitle}>Application Rejected</Text>
          <Text style={styles.rejectionText}>
            Unfortunately, your loan application was not approved at this time. 
            You can contact our support team for more information or consider reapplying in the future.
          </Text>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>No Loan Applications</Text>
      <Text style={styles.emptyText}>
        You haven't submitted any loan applications yet
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/Screens/Buyer/BrowseProperties')}
      >
        <Text style={styles.browseButtonText}>Browse Properties</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Loan Applications</Text>
        <Text style={styles.subtitle}>
          {applications.length} {applications.length === 1 ? 'application' : 'applications'}
        </Text>
      </View>

      {applications.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {applications.map(renderApplication)}
        </ScrollView>
      )}

      <BuyerBottomNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom navigation
  },
  applicationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  applicationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  insuranceSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  insuranceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  insuranceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  insuranceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insuranceProvider: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  insuranceType: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  insuranceDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    lineHeight: 20,
  },
  insuranceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  insuranceDetail: {
    flex: 1,
  },
  insuranceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  insuranceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  selectInsuranceButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectInsuranceButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectionSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  rejectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
  },
  rejectionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  contactButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
