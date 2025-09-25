import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';

interface LoanSimulatorState {
  propertyValue: string;
  interestRate: string;
  loanTerm: string;
  includeInsurance: boolean;
  insuranceType: string;
  insuranceAmount: string;
}

interface SimulationResult {
  monthlyPayment: string;
  totalInterest: string;
  totalPayment: string;
  monthlyInsurance: string;
  totalMonthlyPayment: string;
}

export default function LoanSimulator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loanData, setLoanData] = useState<LoanSimulatorState>({
    propertyValue: '',
    interestRate: '6.5',
    loanTerm: '30',
    includeInsurance: false,
    insuranceType: 'homeowners',
    insuranceAmount: ''
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);

  const steps = [
    { id: 1, title: 'Property Value', description: 'Enter property details' },
    { id: 2, title: 'Loan Terms', description: 'Interest rate and term' },
    { id: 3, title: 'Insurance', description: 'Property insurance options' },
    { id: 4, title: 'Results', description: 'View your calculations' }
  ];

  const updateLoanData = (field: keyof LoanSimulatorState, value: string) => {
    setLoanData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate if enabled and we have enough data
    if (autoCalculate && value && loanData.propertyValue && loanData.interestRate && loanData.loanTerm) {
      setTimeout(() => calculateLoan(), 500);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return loanData.propertyValue && parseFloat(loanData.propertyValue) > 0;
      case 2:
        return loanData.interestRate && loanData.loanTerm;
      case 3:
        // If insurance is enabled, insurance amount must be provided
        if (loanData.includeInsurance) {
          return loanData.insuranceAmount && parseFloat(loanData.insuranceAmount) > 0;
        }
        return true; // Insurance is optional
      case 4:
        return result !== null;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      if (currentStep === 3) {
        // When moving from insurance step to results, calculate loan first
        calculateLoan();
        // Move to results step after calculation
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 100);
      } else if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateLoan = () => {
    const propertyValue = parseFloat(loanData.propertyValue);
    const interestRate = parseFloat(loanData.interestRate);
    const loanTerm = parseInt(loanData.loanTerm);

    if (!propertyValue || !interestRate || !loanTerm) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      const principal = propertyValue; // No down payment, full loan amount
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;

      if (monthlyRate === 0) {
        // Handle zero interest rate
        const monthlyPayment = principal / numberOfPayments;
        const totalInterest = 0;
        const totalPayment = principal;

        // Calculate insurance
        const monthlyInsurance = loanData.includeInsurance && loanData.insuranceAmount 
          ? parseFloat(loanData.insuranceAmount) / 12 
          : 0;
        const totalMonthlyPayment = monthlyPayment + monthlyInsurance;

        setResult({
          monthlyPayment: monthlyPayment.toFixed(2),
          totalInterest: totalInterest.toFixed(2),
          totalPayment: totalPayment.toFixed(2),
          monthlyInsurance: monthlyInsurance.toFixed(2),
          totalMonthlyPayment: totalMonthlyPayment.toFixed(2)
        });
      } else {
        const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        const totalInterest = (monthlyPayment * numberOfPayments) - principal;
        const totalPayment = monthlyPayment * numberOfPayments;

        // Calculate insurance
        const monthlyInsurance = loanData.includeInsurance && loanData.insuranceAmount 
          ? parseFloat(loanData.insuranceAmount) / 12 
          : 0;
        const totalMonthlyPayment = monthlyPayment + monthlyInsurance;

        setResult({
          monthlyPayment: monthlyPayment.toFixed(2),
          totalInterest: totalInterest.toFixed(2),
          totalPayment: totalPayment.toFixed(2),
          monthlyInsurance: monthlyInsurance.toFixed(2),
          totalMonthlyPayment: totalMonthlyPayment.toFixed(2)
        });
      }

      setIsCalculating(false);
    }, 1000);
  };

  const resetCalculator = () => {
    setLoanData({
      propertyValue: '',
      interestRate: '6.5',
      loanTerm: '30',
      includeInsurance: false,
      insuranceType: 'homeowners',
      insuranceAmount: ''
    });
    setResult(null);
    setCurrentStep(1);
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Property Value</Text>
            <Text style={styles.stepContentSubtitle}>Enter the purchase price of the property</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Property Value (TND) *</Text>
              <TextInput
                style={styles.input}
                value={loanData.propertyValue}
                onChangeText={(value) => updateLoanData('propertyValue', value)}
                placeholder="Enter property value"
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.presetButtons}>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => updateLoanData('propertyValue', '500000')}
              >
                <Text style={styles.presetButtonText}>500K TND</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => updateLoanData('propertyValue', '750000')}
              >
                <Text style={styles.presetButtonText}>750K TND</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => updateLoanData('propertyValue', '1000000')}
              >
                <Text style={styles.presetButtonText}>1M TND</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Loan Terms</Text>
            <Text style={styles.stepContentSubtitle}>Set your interest rate and loan term</Text>
            
            <View style={styles.inputRow}>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Interest Rate (%) *</Text>
                <TextInput
                  style={styles.input}
                  value={loanData.interestRate}
                  onChangeText={(value) => updateLoanData('interestRate', value)}
                  placeholder="6.5"
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View style={styles.inputGroupHalf}>
                <Text style={styles.inputLabel}>Loan Term (Years) *</Text>
                <TextInput
                  style={styles.input}
                  value={loanData.loanTerm}
                  onChangeText={(value) => updateLoanData('loanTerm', value)}
                  placeholder="30"
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.presetButtons}>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => updateLoanData('loanTerm', '15')}
              >
                <Text style={styles.presetButtonText}>15 Years</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => updateLoanData('loanTerm', '20')}
              >
                <Text style={styles.presetButtonText}>20 Years</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => updateLoanData('loanTerm', '30')}
              >
                <Text style={styles.presetButtonText}>30 Years</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.autoCalculateToggle}>
              <TouchableOpacity 
                style={styles.toggleButton}
                onPress={() => setAutoCalculate(!autoCalculate)}
              >
                <Text style={styles.toggleButtonText}>
                  {autoCalculate ? '✓' : '○'} Auto-calculate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Property Insurance</Text>
            <Text style={styles.stepContentSubtitle}>Protect your investment with property insurance</Text>
            
            <View style={styles.inputGroup}>
              <TouchableOpacity 
                style={styles.insuranceToggle}
                onPress={() => updateLoanData('includeInsurance', (!loanData.includeInsurance).toString())}
              >
                <View style={styles.toggleRow}>
                  <Text style={styles.toggleLabel}>Include Property Insurance</Text>
                  <View style={[styles.toggleSwitch, loanData.includeInsurance && styles.toggleSwitchActive]}>
                    <View style={[styles.toggleThumb, loanData.includeInsurance && styles.toggleThumbActive]} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {loanData.includeInsurance && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Insurance Type</Text>
                  <View style={styles.insuranceTypeContainer}>
                    {[
                      { id: 'homeowners', label: 'Homeowners Insurance', description: 'Comprehensive coverage' },
                      { id: 'condo', label: 'Condo Insurance', description: 'For condominiums' },
                      { id: 'renters', label: 'Renters Insurance', description: 'Personal property coverage' }
                    ].map((type) => (
                      <TouchableOpacity
                        key={type.id}
                        style={[
                          styles.insuranceTypeOption,
                          loanData.insuranceType === type.id && styles.insuranceTypeOptionSelected
                        ]}
                        onPress={() => updateLoanData('insuranceType', type.id)}
                      >
                        <Text style={[
                          styles.insuranceTypeLabel,
                          loanData.insuranceType === type.id && styles.insuranceTypeLabelSelected
                        ]}>
                          {type.label}
                        </Text>
                        <Text style={[
                          styles.insuranceTypeDescription,
                          loanData.insuranceType === type.id && styles.insuranceTypeDescriptionSelected
                        ]}>
                          {type.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Annual Insurance Premium (TND)</Text>
                  <TextInput
                    style={styles.input}
                    value={loanData.insuranceAmount}
                    onChangeText={(value) => updateLoanData('insuranceAmount', value)}
                    placeholder="Enter annual premium"
                    keyboardType="numeric"
                    placeholderTextColor="#64748b"
                  />
                </View>

                <View style={styles.insuranceInfo}>
                  <Text style={styles.insuranceInfoTitle}>🛡️ Why Property Insurance?</Text>
                  <Text style={styles.insuranceInfoText}>
                    • Protects your property from damage (fire, storms, theft)
                    • Covers liability if someone is injured on your property
                    • Required by most lenders for mortgage approval
                    • Provides peace of mind for your investment
                  </Text>
                </View>
              </>
            )}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Your Loan Calculation</Text>
            <Text style={styles.stepContentSubtitle}>Here's your estimated mortgage details</Text>
            
            {result ? (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Monthly Payment</Text>
                <Text style={styles.monthlyPaymentAmount}>{result.monthlyPayment} TND</Text>
                
                {loanData.includeInsurance && parseFloat(result.monthlyInsurance) > 0 && (
                  <View style={styles.insuranceBreakdown}>
                    <View style={styles.insuranceRow}>
                      <Text style={styles.insuranceLabel}>Monthly Insurance:</Text>
                      <Text style={styles.insuranceValue}>{result.monthlyInsurance} TND</Text>
                    </View>
                    <View style={styles.totalPaymentRow}>
                      <Text style={styles.totalPaymentLabel}>Total Monthly Payment:</Text>
                      <Text style={styles.totalPaymentValue}>{result.totalMonthlyPayment} TND</Text>
                    </View>
                  </View>
                )}
                
                <View style={styles.resultGrid}>
                  <View style={styles.resultItem}>
                    <View style={styles.resultItemContent}>
                      <Text style={styles.resultLabel}>Total Interest</Text>
                      <Text style={styles.resultValue}>{result.totalInterest} TND</Text>
                    </View>
                  </View>
                  <View style={styles.resultItem}>
                    <View style={styles.resultItemContent}>
                      <Text style={styles.resultLabel}>Total Payment</Text>
                      <Text style={styles.resultValue}>{result.totalPayment} TND</Text>
                    </View>
                  </View>
                  <View style={styles.resultItem}>
                    <View style={styles.resultItemContent}>
                      <Text style={styles.resultLabel}>Loan Amount</Text>
                      <Text style={styles.resultValue}>{loanData.propertyValue} TND</Text>
                    </View>
                  </View>
                  <View style={styles.resultItem}>
                    <View style={styles.resultItemContent}>
                      <Text style={styles.resultLabel}>Interest Rate</Text>
                      <Text style={styles.resultValue}>{loanData.interestRate}%</Text>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.noResultCard}>
                <Text style={styles.noResultText}>Complete the previous steps to see your calculation</Text>
              </View>
            )}
          </View>
        );

      default:
        return null;
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Loan Calculator 💰</Text>
            <Text style={styles.userName}>Calculate Your Mortgage</Text>
          </View>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpIcon}>❓</Text>
          </TouchableOpacity>
        </View>

        {/* Compact Step Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Step {currentStep} of {steps.length}</Text>
            <Text style={styles.progressSubtitle}>{steps[currentStep - 1]?.title}</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(currentStep / steps.length) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressPercentage}>
              {Math.round((currentStep / steps.length) * 100)}%
            </Text>
          </View>
          
          <View style={styles.stepDots}>
            {steps.map((step, index) => (
              <View key={step.id} style={styles.stepDotContainer}>
                <View style={[
                  styles.stepDot,
                  currentStep >= step.id && styles.stepDotActive,
                  currentStep > step.id && styles.stepDotCompleted
                ]}>
                  {currentStep > step.id ? (
                    <Text style={styles.stepDotCheckmark}>✓</Text>
                  ) : (
                    <Text style={[
                      styles.stepDotNumber,
                      currentStep === step.id && styles.stepDotNumberActive
                    ]}>
                      {step.id}
                    </Text>
                  )}
                </View>
                <Text style={[
                  styles.stepDotLabel,
                  currentStep === step.id && styles.stepDotLabelActive
                ]}>
                  {step.title.split(' ')[0]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Step Content */}
        <View style={styles.stepContentContainer}>
          {renderStepContent()}
        </View>

        {/* Continue Button */}
        <View style={styles.continueButtonContainer}>
          {currentStep < 4 ? (
            <TouchableOpacity 
              style={[
                currentStep === 3 ? styles.calculateButton : styles.continueButton,
                (!validateStep(currentStep) && currentStep !== 3) && styles.continueButtonDisabled,
                isCalculating && styles.calculateButtonDisabled
              ]} 
              onPress={nextStep}
              disabled={(!validateStep(currentStep) && currentStep !== 3) || isCalculating}
            >
              <Text style={[
                currentStep === 3 ? styles.calculateButtonText : styles.continueButtonText,
                (!validateStep(currentStep) && currentStep !== 3) && styles.continueButtonTextDisabled
              ]}>
                {currentStep === 3 ? (isCalculating ? 'Calculating...' : 'Calculate Loan') : 'Continue'}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {result && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>🎉 Your Loan Calculation</Text>
              <View style={styles.resultBadge}>
                <Text style={styles.resultBadgeText}>Complete</Text>
              </View>
            </View>
            
            <View style={styles.monthlyPaymentHighlight}>
              <Text style={styles.monthlyPaymentLabel}>Monthly Payment</Text>
              <Text style={styles.monthlyPaymentAmount}>{result.monthlyPayment} TND</Text>
            </View>
            
            <View style={styles.resultGrid}>
              <View style={styles.resultItem}>
                <View style={styles.resultItemIcon}>
                  <Text style={styles.resultItemEmoji}>💰</Text>
                </View>
                <View style={styles.resultItemContent}>
                  <Text style={styles.resultLabel}>Total Interest</Text>
                  <Text style={styles.resultValue}>{result.totalInterest} TND</Text>
                </View>
              </View>
              
              <View style={styles.resultItem}>
                <View style={styles.resultItemIcon}>
                  <Text style={styles.resultItemEmoji}>📊</Text>
                </View>
                <View style={styles.resultItemContent}>
                  <Text style={styles.resultLabel}>Total Payment</Text>
                  <Text style={styles.resultValue}>{result.totalPayment} TND</Text>
                </View>
              </View>
              
              <View style={styles.resultItem}>
                <View style={styles.resultItemIcon}>
                  <Text style={styles.resultItemEmoji}>📈</Text>
                </View>
                <View style={styles.resultItemContent}>
                  <Text style={styles.resultLabel}>Loan Amount</Text>
                  <Text style={styles.resultValue}>{loanData.propertyValue} TND</Text>
                </View>
              </View>
              
              <View style={styles.resultItem}>
                <View style={styles.resultItemIcon}>
                  <Text style={styles.resultItemEmoji}>🏠</Text>
                </View>
                <View style={styles.resultItemContent}>
                  <Text style={styles.resultLabel}>Interest Rate</Text>
                  <Text style={styles.resultValue}>{loanData.interestRate}%</Text>
                </View>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#1e293b',
  },
  greeting: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpIcon: {
    fontSize: 20,
  },
  // Compact Progress Design
  progressContainer: {
    backgroundColor: '#334155',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#475569',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0ea5e9',
    borderRadius: 3,
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0ea5e9',
    minWidth: 35,
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepDotContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepDotActive: {
    backgroundColor: '#0ea5e9',
  },
  stepDotCompleted: {
    backgroundColor: '#10b981',
  },
  stepDotNumber: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
  },
  stepDotNumberActive: {
    color: 'white',
  },
  stepDotCheckmark: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  stepDotLabel: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
  stepDotLabelActive: {
    color: '#0ea5e9',
    fontWeight: '600',
  },
  // Step Content
  stepContentContainer: {
    backgroundColor: '#334155',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroupHalf: {
    flex: 1,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#475569',
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#64748b',
    color: '#f8fafc',
  },
  presetButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  presetButton: {
    backgroundColor: '#475569',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#64748b',
  },
  presetButtonText: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  calculateButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calculateButtonDisabled: {
    backgroundColor: '#e2e8f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  calculateButtonIcon: {
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  resetButtonIcon: {
    fontSize: 16,
  },
  resetButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#334155',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  resultBadge: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  resultBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  monthlyPaymentHighlight: {
    backgroundColor: '#475569',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  monthlyPaymentLabel: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '500',
  },
  resultGrid: {
    gap: 16,
  },
  resultItem: {
    backgroundColor: '#475569',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#64748b',
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultItemEmoji: {
    fontSize: 20,
  },
  resultItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  stepContent: {
    marginBottom: 0,
  },
  stepContentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  stepContentSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 32,
  },
  // Continue Button
  continueButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#64748b',
  },
  calculationPreview: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#64748b',
  },
  calculationPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 8,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  calculationLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  calculationValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f8fafc',
  },
  autoCalculateToggle: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#475569',
    borderWidth: 1,
    borderColor: '#64748b',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '500',
  },
  noResultCard: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#64748b',
  },
  noResultText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  monthlyPaymentAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Insurance Styles
  insuranceToggle: {
    marginBottom: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  toggleSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#475569',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#0ea5e9',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f8fafc',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  insuranceTypeContainer: {
    gap: 12,
  },
  insuranceTypeOption: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#64748b',
  },
  insuranceTypeOptionSelected: {
    backgroundColor: '#334155',
    borderColor: '#0ea5e9',
  },
  insuranceTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  insuranceTypeLabelSelected: {
    color: '#f8fafc',
  },
  insuranceTypeDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  insuranceTypeDescriptionSelected: {
    color: '#e2e8f0',
  },
  insuranceInfo: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
  },
  insuranceInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 8,
  },
  insuranceInfoText: {
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
  },
  insuranceBreakdown: {
    backgroundColor: '#475569',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#0ea5e9',
  },
  insuranceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insuranceLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  insuranceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  totalPaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#64748b',
  },
  totalPaymentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  totalPaymentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
});
