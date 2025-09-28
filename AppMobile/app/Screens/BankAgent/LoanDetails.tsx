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
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { API_BASE_URL } from '@/constants/api';

interface LoanApplication {
  id: string;
  applicant_id: string;
  property_id?: string;
  loan_amount: number;
  loan_term_years: number;
  interest_rate?: number;
  monthly_payment?: number;
  employment_status: string;
  annual_income: number;
  identity_card_image?: string;
  proof_of_income_image?: string;
  bank_agent_id?: string;
  include_insurance: boolean;
  monthly_insurance_amount?: number;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submitted_documents: string[];
  bank_agent_decision?: string;
  bank_agent_notes?: string;
  created_at: string;
  updated_at: string;
  property?: {
    id: string;
    title: string;
    price: number;
    location: string;
    images?: string[];
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
  };
  applicant?: {
    id: string;
    display_name: string;
    phone?: string;
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
  const [bankAgentDecision, setBankAgentDecision] = useState('');
  const [decisionText, setDecisionText] = useState('');
  const [insuranceOffers, setInsuranceOffers] = useState<InsuranceOffer[]>([]);
  const [newInsuranceOffer, setNewInsuranceOffer] = useState({
    provider: '',
    type: '',
    monthlyPremium: '',
    coverage: '',
    description: '',
  });
  const [showAddInsurance, setShowAddInsurance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [selectedImageTitle, setSelectedImageTitle] = useState('');

  useEffect(() => {
    if (id) {
      fetchLoanApplication();
    }
  }, [id]);

  const fetchLoanApplication = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/loan-applications/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log('Loan application data received:', JSON.stringify(result.data, null, 2));
        setApplication(result.data);
        setReviewNotes(result.data.bank_agent_notes || '');
        setBankAgentDecision(result.data.bank_agent_decision || '');
        setDecisionText(result.data.bank_agent_decision || '');
      } else {
        console.error('API response error:', result);
        Alert.alert('Error', result.error || 'Failed to fetch loan application');
      }
    } catch (error) {
      console.error('Error fetching loan application:', error);
      Alert.alert('Error', 'Failed to fetch loan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    Alert.alert(
      'Approve Loan',
      'Are you sure you want to approve this loan application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: () => {
            submitDecision('approved');
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
            submitDecision('rejected');
          }
        }
      ]
    );
  };

  const openImageModal = (imageUrl: string, title: string) => {
    console.log('Opening image modal:', { imageUrl, title });
    setSelectedImageUrl(imageUrl);
    setSelectedImageTitle(title);
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
    setSelectedImageUrl('');
    setSelectedImageTitle('');
  };

  const submitDecision = async (decision: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/loan-applications/${application?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: decision,
          bank_agent_decision: decisionText.trim() || `Loan application ${decision}`,
          bank_agent_notes: reviewNotes.trim() || `Additional notes for ${decision} decision`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setApplication(prev => prev ? { 
          ...prev, 
          status: decision as 'approved' | 'rejected',
          bank_agent_decision: decisionText.trim() || `Loan application ${decision}`,
          bank_agent_notes: reviewNotes.trim() || `Additional notes for ${decision} decision`
        } : null);
        
        Alert.alert(
          'Success', 
          `Loan application has been ${decision}!`,
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to update loan application');
      }
    } catch (error) {
      console.error('Error updating loan application:', error);
      Alert.alert('Error', 'Failed to update loan application. Please try again.');
    }
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

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading loan application...</Text>
        </View>
      </View>
    );
  }

  if (!application) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load loan application</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchLoanApplication}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
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
              {application.applicant?.display_name || 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{application.applicant?.phone || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Applicant ID:</Text>
            <Text style={styles.infoValue}>{application.applicant_id}</Text>
          </View>
        </View>
      </View>

      {/* Financial Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Annual Income:</Text>
            <Text style={styles.infoValue}>{application.annual_income.toLocaleString()} د.ت</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Monthly Income:</Text>
            <Text style={styles.infoValue}>{(application.annual_income / 12).toLocaleString()} د.ت</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Employment Status:</Text>
            <Text style={styles.infoValue}>{application.employment_status}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Insurance Included:</Text>
            <Text style={styles.infoValue}>{application.include_insurance ? 'Yes' : 'No'}</Text>
          </View>
          {application.include_insurance && application.monthly_insurance_amount && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Monthly Insurance:</Text>
              <Text style={styles.infoValue}>{application.monthly_insurance_amount} د.ت/month</Text>
            </View>
          )}
        </View>
      </View>

      {/* Document Images */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Submitted Documents</Text>
        <View style={styles.documentsContainer}>
          {application.identity_card_image && (
            <View style={styles.documentCard}>
              <Text style={styles.documentTitle}>Identity Card</Text>
              <TouchableOpacity 
                style={styles.imageContainer}
                onPress={() => openImageModal(application.identity_card_image!, 'Identity Card')}
              >
                <Image 
                  source={{ uri: application.identity_card_image }} 
                  style={styles.documentImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.log('Identity card image error:', error);
                    Alert.alert('Image Error', 'Failed to load identity card image');
                  }}
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageOverlayText}>Tap to view full size</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          
          {application.proof_of_income_image && (
            <View style={styles.documentCard}>
              <Text style={styles.documentTitle}>Proof of Income</Text>
              <TouchableOpacity 
                style={styles.imageContainer}
                onPress={() => openImageModal(application.proof_of_income_image!, 'Proof of Income')}
              >
                <Image 
                  source={{ uri: application.proof_of_income_image }} 
                  style={styles.documentImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.log('Proof of income image error:', error);
                    Alert.alert('Image Error', 'Failed to load proof of income image');
                  }}
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageOverlayText}>Tap to view full size</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          
          {!application.identity_card_image && !application.proof_of_income_image && (
            <View style={styles.noDocumentsContainer}>
              <Text style={styles.noDocumentsText}>No documents uploaded</Text>
            </View>
          )}
        </View>
      </View>

      {/* Property Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property Information</Text>
        <View style={styles.infoCard}>
          {application.property ? (
            <>
              <Text style={styles.propertyTitle}>{application.property.title}</Text>
              <Text style={styles.propertyLocation}>{application.property.location}</Text>
              
              <View style={styles.propertyDetails}>
                <View style={styles.propertyDetailItem}>
                  <Text style={styles.propertyDetailLabel}>Price</Text>
                  <Text style={styles.propertyDetailValue}>{application.property.price.toLocaleString()} د.ت</Text>
                </View>
                {application.property.area && (
                  <View style={styles.propertyDetailItem}>
                    <Text style={styles.propertyDetailLabel}>Area</Text>
                    <Text style={styles.propertyDetailValue}>{application.property.area} sqft</Text>
                  </View>
                )}
                {application.property.bedrooms && (
                  <View style={styles.propertyDetailItem}>
                    <Text style={styles.propertyDetailLabel}>Bedrooms</Text>
                    <Text style={styles.propertyDetailValue}>{application.property.bedrooms}</Text>
                  </View>
                )}
                {application.property.bathrooms && (
                  <View style={styles.propertyDetailItem}>
                    <Text style={styles.propertyDetailLabel}>Bathrooms</Text>
                    <Text style={styles.propertyDetailValue}>{application.property.bathrooms}</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <Text style={styles.infoValue}>No property information available</Text>
          )}
        </View>
      </View>

      {/* Loan Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Loan Details</Text>
        <View style={styles.infoCard}>
          <View style={styles.loanDetails}>
            <View style={styles.loanDetailItem}>
              <Text style={styles.loanDetailLabel}>Loan Amount</Text>
              <Text style={styles.loanDetailValue}>{application.loan_amount.toLocaleString()} د.ت</Text>
            </View>
            <View style={styles.loanDetailItem}>
              <Text style={styles.loanDetailLabel}>Term</Text>
              <Text style={styles.loanDetailValue}>{application.loan_term_years} years</Text>
            </View>
            {application.interest_rate && (
              <View style={styles.loanDetailItem}>
                <Text style={styles.loanDetailLabel}>Interest Rate</Text>
                <Text style={styles.loanDetailValue}>{(application.interest_rate * 100).toFixed(2)}%</Text>
              </View>
            )}
            {application.monthly_payment && (
              <View style={styles.loanDetailItem}>
                <Text style={styles.loanDetailLabel}>Monthly Payment</Text>
                <Text style={styles.loanDetailValue}>{application.monthly_payment.toLocaleString()} د.ت</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Bank Agent Decision */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bank Agent Decision</Text>
        <View style={styles.enhancedCard}>
          <Text style={styles.fieldLabel}>Decision Details *</Text>
          <TextInput
            style={styles.enhancedTextInput}
            value={decisionText}
            onChangeText={setDecisionText}
            placeholder="Enter your decision details (e.g., 'Approved - Good credit score, stable income', 'Rejected - Insufficient income, high debt ratio')"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Additional Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Notes</Text>
        <View style={styles.enhancedCard}>
          <Text style={styles.fieldLabel}>Notes & Requirements</Text>
          <TextInput
            style={styles.enhancedTextInput}
            value={reviewNotes}
            onChangeText={setReviewNotes}
            placeholder="Add additional notes, requirements, or next steps (e.g., 'Submit additional documents', 'Schedule next meeting', 'Bring extra papers')"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
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

    {/* Full Screen Image Modal */}
    <Modal
      visible={imageModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={closeImageModal}
    >
      <View style={styles.imageModalContainer}>
        <TouchableOpacity 
          style={styles.imageModalBackground} 
          activeOpacity={1}
          onPress={closeImageModal}
        >
          <View style={styles.imageModalContent}>
            <View style={styles.imageModalHeader}>
              <Text style={styles.imageModalTitle}>{selectedImageTitle}</Text>
              <TouchableOpacity 
                style={styles.imageModalCloseButton}
                onPress={closeImageModal}
              >
                <Text style={styles.imageModalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.imageModalImageContainer}>
              <Image 
                source={{ uri: selectedImageUrl }} 
                style={styles.imageModalImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    paddingBottom: 15,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
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
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
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
    borderWidth: 2,
    borderColor: '#10b981',
  },
  approveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  enhancedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  fieldLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginBottom: 12,
  },
  enhancedTextInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 100,
  },
  documentsContainer: {
    gap: 16,
  },
  documentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  documentImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 12,
    alignItems: 'center',
  },
  imageOverlayText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  noDocumentsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  noDocumentsText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    fontStyle: 'italic',
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalBackground: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContent: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 100,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  imageModalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageModalImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageModalImage: {
    width: '100%',
    height: '100%',
  },
  bottomPadding: {
    height: 40,
  },
});



