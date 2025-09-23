import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

interface LoanApplication {
  id: string;
  applicantName: string;
  propertyTitle: string;
  propertyPrice: number;
  loanAmount: number;
  downPayment: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedDate: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    ssn: string;
  };
  financialInfo: {
    annualIncome: number;
    monthlyIncome: number;
    creditScore?: number;
    employmentStatus: string;
    employer: string;
    jobTitle: string;
    yearsEmployed: number;
  };
  propertyInfo: {
    title: string;
    location: string;
    price: number;
    images: string[];
    bedrooms: number;
    bathrooms: number;
    area: number;
  };
}

interface InsuranceOffer {
  id: string;
  provider: string;
  type: string;
  monthlyPremium: number;
  coverage: number;
  description: string;
}

export default function LoanDetails() {
  const { id } = useLocalSearchParams();
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [insuranceOffers, setInsuranceOffers] = useState<InsuranceOffer[]>([]);
  const [newInsuranceOffer, setNewInsuranceOffer] = useState({
    provider: '',
    type: '',
    monthlyPremium: '',
    coverage: '',
    description: '',
  });
  const [showAddInsurance, setShowAddInsurance] = useState(false);

  useEffect(() => {
    // In a real app, fetch application data by ID
    // Mock data for demonstration
    setApplication({
      id: id as string,
      applicantName: 'John Doe',
      propertyTitle: 'Modern Medical Office',
      propertyPrice: 750000,
      loanAmount: 600000,
      downPayment: 150000,
      status: 'pending',
      submittedDate: '2024-01-15',
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '(555) 123-4567',
        dateOfBirth: '1985-03-15',
        ssn: '***-**-1234',
      },
      financialInfo: {
        annualIncome: 120000,
        monthlyIncome: 10000,
        creditScore: 750,
        employmentStatus: 'employed',
        employer: 'Medical Corp',
        jobTitle: 'Senior Doctor',
        yearsEmployed: 5,
      },
      propertyInfo: {
        title: 'Modern Medical Office',
        location: 'Downtown Medical District',
        price: 750000,
        images: [],
        bedrooms: 0,
        bathrooms: 3,
        area: 2500,
      },
    });
  }, [id]);

  const handleApprove = () => {
    Alert.alert(
      'Approve Loan',
      'Are you sure you want to approve this loan application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            setApplication(prev => prev ? { ...prev, status: 'approved' } : null);
            Alert.alert('Success', 'Loan application has been approved!');
          }
        }
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Reject Loan',
      'Are you sure you want to reject this loan application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setApplication(prev => prev ? { ...prev, status: 'rejected' } : null);
            Alert.alert('Rejected', 'Loan application has been rejected.');
          }
        }
      ]
    );
  };

  const handleAddInsuranceOffer = () => {
    if (!newInsuranceOffer.provider || !newInsuranceOffer.type || !newInsuranceOffer.monthlyPremium) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const offer: InsuranceOffer = {
      id: Date.now().toString(),
      provider: newInsuranceOffer.provider,
      type: newInsuranceOffer.type,
      monthlyPremium: Number(newInsuranceOffer.monthlyPremium),
      coverage: Number(newInsuranceOffer.coverage),
      description: newInsuranceOffer.description,
    };

    setInsuranceOffers([...insuranceOffers, offer]);
    setNewInsuranceOffer({
      provider: '',
      type: '',
      monthlyPremium: '',
      coverage: '',
      description: '',
    });
    setShowAddInsurance(false);
    Alert.alert('Success', 'Insurance offer added successfully!');
  };

  const getCreditScoreColor = (score?: number) => {
    if (!score) return '#6b7280';
    if (score >= 750) return '#10b981';
    if (score >= 700) return '#60a5fa';
    if (score >= 650) return '#f59e0b';
    return '#ef4444';
  };

  const getCreditScoreLabel = (score?: number) => {
    if (!score) return 'N/A';
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  };

  if (!application) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Loan Application Review</Text>
        <Text style={styles.subtitle}>Application ID: {application.id}</Text>
      </View>

      {/* Applicant Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Applicant Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>
              {application.personalInfo.firstName} {application.personalInfo.lastName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{application.personalInfo.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{application.personalInfo.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoValue}>{application.personalInfo.dateOfBirth}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>SSN:</Text>
            <Text style={styles.infoValue}>{application.personalInfo.ssn}</Text>
          </View>
        </View>
      </View>

      {/* Financial Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Annual Income:</Text>
            <Text style={styles.infoValue}>${application.financialInfo.annualIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Monthly Income:</Text>
            <Text style={styles.infoValue}>${application.financialInfo.monthlyIncome.toLocaleString()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Credit Score:</Text>
            <View style={styles.creditScoreContainer}>
              <Text style={[styles.infoValue, { color: getCreditScoreColor(application.financialInfo.creditScore) }]}>
                {application.financialInfo.creditScore || 'N/A'}
              </Text>
              <Text style={[styles.creditScoreLabel, { color: getCreditScoreColor(application.financialInfo.creditScore) }]}>
                {getCreditScoreLabel(application.financialInfo.creditScore)}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Employment:</Text>
            <Text style={styles.infoValue}>{application.financialInfo.employmentStatus}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Employer:</Text>
            <Text style={styles.infoValue}>{application.financialInfo.employer}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Job Title:</Text>
            <Text style={styles.infoValue}>{application.financialInfo.jobTitle}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Years Employed:</Text>
            <Text style={styles.infoValue}>{application.financialInfo.yearsEmployed} years</Text>
          </View>
        </View>
      </View>

      {/* Property Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Information</Text>
        <View style={styles.infoCard}>
          <Text style={styles.propertyTitle}>{application.propertyInfo.title}</Text>
          <Text style={styles.propertyLocation}>{application.propertyInfo.location}</Text>
          
          <View style={styles.propertyDetails}>
            <View style={styles.propertyDetailItem}>
              <Text style={styles.propertyDetailLabel}>Price</Text>
              <Text style={styles.propertyDetailValue}>${application.propertyInfo.price.toLocaleString()}</Text>
            </View>
            <View style={styles.propertyDetailItem}>
              <Text style={styles.propertyDetailLabel}>Area</Text>
              <Text style={styles.propertyDetailValue}>{application.propertyInfo.area} sqft</Text>
            </View>
            <View style={styles.propertyDetailItem}>
              <Text style={styles.propertyDetailLabel}>Bedrooms</Text>
              <Text style={styles.propertyDetailValue}>{application.propertyInfo.bedrooms}</Text>
            </View>
            <View style={styles.propertyDetailItem}>
              <Text style={styles.propertyDetailLabel}>Bathrooms</Text>
              <Text style={styles.propertyDetailValue}>{application.propertyInfo.bathrooms}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Loan Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Loan Details</Text>
        <View style={styles.infoCard}>
          <View style={styles.loanDetails}>
            <View style={styles.loanDetailItem}>
              <Text style={styles.loanDetailLabel}>Loan Amount</Text>
              <Text style={styles.loanDetailValue}>${application.loanAmount.toLocaleString()}</Text>
            </View>
            <View style={styles.loanDetailItem}>
              <Text style={styles.loanDetailLabel}>Down Payment</Text>
              <Text style={styles.loanDetailValue}>${application.downPayment.toLocaleString()}</Text>
            </View>
            <View style={styles.loanDetailItem}>
              <Text style={styles.loanDetailLabel}>LTV Ratio</Text>
              <Text style={styles.loanDetailValue}>
                {((application.loanAmount / application.propertyPrice) * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Review Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Review Notes</Text>
        <TextInput
          style={styles.notesInput}
          value={reviewNotes}
          onChangeText={setReviewNotes}
          placeholder="Add your review notes here..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      {/* Insurance Offers */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Insurance Offers</Text>
          <TouchableOpacity
            style={styles.addInsuranceButton}
            onPress={() => setShowAddInsurance(!showAddInsurance)}
          >
            <Text style={styles.addInsuranceButtonText}>+ Add Offer</Text>
          </TouchableOpacity>
        </View>

        {showAddInsurance && (
          <View style={styles.addInsuranceForm}>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                value={newInsuranceOffer.provider}
                onChangeText={(value) => setNewInsuranceOffer(prev => ({ ...prev, provider: value }))}
                placeholder="Insurance Provider"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 8 }]}
                value={newInsuranceOffer.type}
                onChangeText={(value) => setNewInsuranceOffer(prev => ({ ...prev, type: value }))}
                placeholder="Insurance Type"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
              />
            </View>
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                value={newInsuranceOffer.monthlyPremium}
                onChangeText={(value) => setNewInsuranceOffer(prev => ({ ...prev, monthlyPremium: value }))}
                placeholder="Monthly Premium ($)"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, { flex: 1, marginLeft: 8 }]}
                value={newInsuranceOffer.coverage}
                onChangeText={(value) => setNewInsuranceOffer(prev => ({ ...prev, coverage: value }))}
                placeholder="Coverage Amount ($)"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="numeric"
              />
            </View>
            
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newInsuranceOffer.description}
              onChangeText={(value) => setNewInsuranceOffer(prev => ({ ...prev, description: value }))}
              placeholder="Description"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddInsurance(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddInsuranceOffer}
              >
                <Text style={styles.addButtonText}>Add Offer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {insuranceOffers.map((offer) => (
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
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={handleReject}
        >
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.approveButton}
          onPress={handleApprove}
        >
          <Text style={styles.approveButtonText}>Approve</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  infoValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  creditScoreContainer: {
    alignItems: 'flex-end',
  },
  creditScoreLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
  },
  propertyDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  propertyDetailItem: {
    width: '50%',
    marginBottom: 12,
  },
  propertyDetailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  propertyDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  loanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loanDetailItem: {
    alignItems: 'center',
  },
  loanDetailLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
  loanDetailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
  notesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    height: 100,
  },
  addInsuranceButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addInsuranceButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  addInsuranceForm: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  rejectButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  approveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

