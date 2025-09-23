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
import { BuyerBottomNav } from '../../../components/Buyer/BuyerBottomNav';

interface LoanSimulatorState {
  propertyValue: string;
  downPayment: string;
  interestRate: string;
  loanTerm: string;
}

interface SimulationResult {
  monthlyPayment: string;
  totalInterest: string;
  totalPayment: string;
  downPaymentPercent: string;
  loanToValue: string;
}

export default function LoanSimulator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loanData, setLoanData] = useState<LoanSimulatorState>({
    propertyValue: '',
    downPayment: '',
    interestRate: '6.5',
    loanTerm: '30'
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [autoCalculate, setAutoCalculate] = useState(true);

  const steps = [
    { id: 1, title: 'Property Value', description: 'Enter property details' },
    { id: 2, title: 'Down Payment', description: 'Set your down payment' },
    { id: 3, title: 'Loan Terms', description: 'Interest rate and term' },
    { id: 4, title: 'Results', description: 'View your calculations' }
  ];

  const updateLoanData = (field: keyof LoanSimulatorState, value: string) => {
    setLoanData(prev => ({ ...prev, [field]: value }));
    
    // Auto-calculate if enabled and we have enough data
    if (autoCalculate && value && loanData.propertyValue && loanData.downPayment && loanData.interestRate && loanData.loanTerm) {
      setTimeout(() => calculateLoan(), 500);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return loanData.propertyValue && parseFloat(loanData.propertyValue) > 0;
      case 2:
        return loanData.downPayment && parseFloat(loanData.downPayment) > 0;
      case 3:
        return loanData.interestRate && loanData.loanTerm;
      case 4:
        return result !== null;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
      if (currentStep === 3) {
        calculateLoan();
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
    const downPayment = parseFloat(loanData.downPayment);
    const interestRate = parseFloat(loanData.interestRate);
    const loanTerm = parseInt(loanData.loanTerm);

    if (!propertyValue || !downPayment || !interestRate || !loanTerm) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (downPayment >= propertyValue) {
      Alert.alert('Error', 'Down payment cannot be greater than or equal to property value');
      return;
    }

    setIsCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      const principal = propertyValue - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const numberOfPayments = loanTerm * 12;

      if (monthlyRate === 0) {
        // Handle zero interest rate
        const monthlyPayment = principal / numberOfPayments;
        const totalInterest = 0;
        const totalPayment = principal;

        setResult({
          monthlyPayment: monthlyPayment.toFixed(2),
          totalInterest: totalInterest.toFixed(2),
          totalPayment: totalPayment.toFixed(2),
          downPaymentPercent: ((downPayment / propertyValue) * 100).toFixed(1),
          loanToValue: ((principal / propertyValue) * 100).toFixed(1)
        });
      } else {
        const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        const totalInterest = (monthlyPayment * numberOfPayments) - principal;
        const totalPayment = monthlyPayment * numberOfPayments;

        setResult({
          monthlyPayment: monthlyPayment.toFixed(2),
          totalInterest: totalInterest.toFixed(2),
          totalPayment: totalPayment.toFixed(2),
          downPaymentPercent: ((downPayment / propertyValue) * 100).toFixed(1),
          loanToValue: ((principal / propertyValue) * 100).toFixed(1)
        });
      }

      setIsCalculating(false);
    }, 1000);
  };

  const resetCalculator = () => {
    setLoanData({
      propertyValue: '',
      downPayment: '',
      interestRate: '6.5',
      loanTerm: '30'
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
              <Text style={styles.inputLabel}>Property Value ($) *</Text>
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
                <Text style={styles.presetButtonText}>$500K</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => updateLoanData('propertyValue', '750000')}
              >
                <Text style={styles.presetButtonText}>$750K</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => updateLoanData('propertyValue', '1000000')}
              >
                <Text style={styles.presetButtonText}>$1M</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Down Payment</Text>
            <Text style={styles.stepContentSubtitle}>How much will you pay upfront?</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Down Payment ($) *</Text>
              <TextInput
                style={styles.input}
                value={loanData.downPayment}
                onChangeText={(value) => updateLoanData('downPayment', value)}
                placeholder="Enter down payment"
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {loanData.propertyValue && loanData.downPayment && (
              <View style={styles.calculationPreview}>
                <Text style={styles.calculationPreviewTitle}>Quick Preview</Text>
                <View style={styles.calculationRow}>
                  <Text style={styles.calculationLabel}>Down Payment %:</Text>
                  <Text style={styles.calculationValue}>
                    {((parseFloat(loanData.downPayment) / parseFloat(loanData.propertyValue)) * 100).toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.calculationRow}>
                  <Text style={styles.calculationLabel}>Loan Amount:</Text>
                  <Text style={styles.calculationValue}>
                    ${(parseFloat(loanData.propertyValue) - parseFloat(loanData.downPayment)).toLocaleString()}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.presetButtons}>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => {
                  const value = (parseFloat(loanData.propertyValue) * 0.1).toString();
                  updateLoanData('downPayment', value);
                }}
              >
                <Text style={styles.presetButtonText}>10%</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => {
                  const value = (parseFloat(loanData.propertyValue) * 0.2).toString();
                  updateLoanData('downPayment', value);
                }}
              >
                <Text style={styles.presetButtonText}>20%</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.presetButton}
                onPress={() => {
                  const value = (parseFloat(loanData.propertyValue) * 0.25).toString();
                  updateLoanData('downPayment', value);
                }}
              >
                <Text style={styles.presetButtonText}>25%</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
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

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Your Loan Calculation</Text>
            <Text style={styles.stepContentSubtitle}>Here's your estimated mortgage details</Text>
            
            {result ? (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Monthly Payment</Text>
                <Text style={styles.monthlyPaymentAmount}>${result.monthlyPayment}</Text>
                
                <View style={styles.resultGrid}>
                  <View style={styles.resultItem}>
                    <View style={styles.resultItemContent}>
                      <Text style={styles.resultLabel}>Total Interest</Text>
                      <Text style={styles.resultValue}>${result.totalInterest}</Text>
                    </View>
                  </View>
                  <View style={styles.resultItem}>
                    <View style={styles.resultItemContent}>
                      <Text style={styles.resultLabel}>Total Payment</Text>
                      <Text style={styles.resultValue}>${result.totalPayment}</Text>
                    </View>
                  </View>
                  <View style={styles.resultItem}>
                    <View style={styles.resultItemContent}>
                      <Text style={styles.resultLabel}>Down Payment %</Text>
                      <Text style={styles.resultValue}>{result.downPaymentPercent}</Text>
                    </View>
                  </View>
                  <View style={styles.resultItem}>
                    <View style={styles.resultItemContent}>
                      <Text style={styles.resultLabel}>Loan-to-Value</Text>
                      <Text style={styles.resultValue}>{result.loanToValue}</Text>
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

  const quickPresets = [
    { label: '20% Down', value: () => {
      const propertyValue = parseFloat(loanData.propertyValue);
      if (propertyValue) {
        updateLoanData('downPayment', (propertyValue * 0.2).toString());
      }
    }},
    { label: '10% Down', value: () => {
      const propertyValue = parseFloat(loanData.propertyValue);
      if (propertyValue) {
        updateLoanData('downPayment', (propertyValue * 0.1).toString());
      }
    }},
    { label: '5% Down', value: () => {
      const propertyValue = parseFloat(loanData.propertyValue);
      if (propertyValue) {
        updateLoanData('downPayment', (propertyValue * 0.05).toString());
      }
    }}
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f9ff" />
      
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

        {/* Step Tabs */}
        <View style={styles.stepTabs}>
          {steps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              style={[
                styles.stepTab,
                currentStep === step.id && styles.stepTabActive
              ]}
              onPress={() => setCurrentStep(step.id)}
            >
              <Text style={[
                styles.stepTabText,
                currentStep === step.id && styles.stepTabTextActive
              ]}>
                {step.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Step Indicators */}
        <View style={styles.stepIndicators}>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.indicatorContainer}>
              <View style={[
                styles.indicator,
                currentStep >= step.id && styles.indicatorActive,
                currentStep > step.id && styles.indicatorCompleted
              ]}>
                {currentStep > step.id ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text style={[
                    styles.indicatorNumber,
                    currentStep === step.id && styles.indicatorNumberActive
                  ]}>
                    {step.id}
                  </Text>
                )}
              </View>
              {index < steps.length - 1 && (
                <View style={[
                  styles.indicatorLine,
                  currentStep > step.id && styles.indicatorLineActive
                ]} />
              )}
            </View>
          ))}
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
                styles.continueButton, 
                !validateStep(currentStep) && styles.continueButtonDisabled
              ]} 
              onPress={nextStep}
              disabled={!validateStep(currentStep)}
            >
              <Text style={[
                styles.continueButtonText,
                !validateStep(currentStep) && styles.continueButtonTextDisabled
              ]}>
                Continue
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[
                styles.calculateButton, 
                isCalculating && styles.calculateButtonDisabled
              ]} 
              onPress={calculateLoan}
              disabled={isCalculating}
            >
              <Text style={styles.calculateButtonText}>
                {isCalculating ? 'Calculating...' : 'Calculate Loan'}
              </Text>
            </TouchableOpacity>
          )}
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
              <Text style={styles.monthlyPaymentAmount}>${result.monthlyPayment}</Text>
            </View>
            
            <View style={styles.resultGrid}>
              <View style={styles.resultItem}>
                <View style={styles.resultItemIcon}>
                  <Text style={styles.resultItemEmoji}>💰</Text>
                </View>
                <View style={styles.resultItemContent}>
                  <Text style={styles.resultLabel}>Total Interest</Text>
                  <Text style={styles.resultValue}>${result.totalInterest}</Text>
                </View>
              </View>
              
              <View style={styles.resultItem}>
                <View style={styles.resultItemIcon}>
                  <Text style={styles.resultItemEmoji}>📊</Text>
                </View>
                <View style={styles.resultItemContent}>
                  <Text style={styles.resultLabel}>Total Payment</Text>
                  <Text style={styles.resultValue}>${result.totalPayment}</Text>
                </View>
              </View>
              
              <View style={styles.resultItem}>
                <View style={styles.resultItemIcon}>
                  <Text style={styles.resultItemEmoji}>📈</Text>
                </View>
                <View style={styles.resultItemContent}>
                  <Text style={styles.resultLabel}>Down Payment %</Text>
                  <Text style={styles.resultValue}>{result.downPaymentPercent}%</Text>
                </View>
              </View>
              
              <View style={styles.resultItem}>
                <View style={styles.resultItemIcon}>
                  <Text style={styles.resultItemEmoji}>🏠</Text>
                </View>
                <View style={styles.resultItemContent}>
                  <Text style={styles.resultLabel}>Loan-to-Value</Text>
                  <Text style={styles.resultValue}>{result.loanToValue}%</Text>
                </View>
              </View>
            </View>
          </View>
        )}

      </ScrollView>

      <BuyerBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
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
    backgroundColor: '#f0f9ff',
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
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
  // Step Tabs
  stepTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepTab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  stepTabActive: {
    backgroundColor: '#3b82f6',
  },
  stepTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
  },
  stepTabTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  // Step Indicators
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorActive: {
    backgroundColor: '#3b82f6',
  },
  indicatorCompleted: {
    backgroundColor: '#10b981',
  },
  indicatorNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  indicatorNumberActive: {
    color: 'white',
  },
  checkmark: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  indicatorLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  indicatorLineActive: {
    backgroundColor: '#10b981',
  },
  // Step Content
  stepContentContainer: {
    backgroundColor: 'white',
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
    color: '#1e293b',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    color: '#1e293b',
  },
  presetButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  presetButton: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bae6fd',
  },
  presetButtonText: {
    fontSize: 14,
    color: '#0369a1',
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
    backgroundColor: '#f0f9ff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: '#bae6fd',
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
    color: '#1e293b',
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
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#bae6fd',
  },
  monthlyPaymentLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '500',
  },
  resultGrid: {
    gap: 16,
  },
  resultItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0f2fe',
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
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
    color: '#64748b',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  stepContent: {
    marginBottom: 0,
  },
  stepContentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  stepContentSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 32,
  },
  // Continue Button
  continueButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#e2e8f0',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#94a3b8',
  },
  calculationPreview: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  calculationPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
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
    color: '#64748b',
  },
  calculationValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  autoCalculateToggle: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toggleButtonText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  noResultCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  noResultText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  monthlyPaymentAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 20,
  },
});
