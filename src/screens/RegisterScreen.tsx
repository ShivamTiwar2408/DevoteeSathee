import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { authApi, RegistrationData } from '../api/authApi';
import { useAlert } from '../components/AlertModal';

const { width } = Dimensions.get('window');
const STEP_COUNT = 4;

interface RegisterScreenProps {
  onBack: () => void;
  onSuccess: (registrationId: string) => void;
}

type FormData = Partial<RegistrationData>;

const PROFILE_FOR_OPTIONS = ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend'] as const;
const GENDER_OPTIONS = ['Male', 'Female'] as const;
const MARITAL_STATUS_OPTIONS = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'] as const;

const COMMUNITY_OPTIONS = [
  'Hindu',
  'Sikh',
  'Jain',
  'Buddhist',
  'Christian',
  'Muslim',
  'Parsi',
  'Jewish',
  'Other',
];

const SUB_COMMUNITY_OPTIONS: Record<string, string[]> = {
  Hindu: ['Brahmin', 'Kshatriya', 'Vaishya', 'Kayastha', 'Rajput', 'Maratha', 'Agarwal', 'Gupta', 'Jat', 'Yadav', 'Other'],
  Sikh: ['Jat Sikh', 'Khatri', 'Arora', 'Ramgarhia', 'Saini', 'Other'],
  Jain: ['Digambar', 'Shwetambar', 'Other'],
  Buddhist: ['Mahayana', 'Theravada', 'Vajrayana', 'Other'],
  Christian: ['Catholic', 'Protestant', 'Orthodox', 'Other'],
  Muslim: ['Sunni', 'Shia', 'Other'],
  Parsi: ['Parsi'],
  Jewish: ['Orthodox', 'Conservative', 'Reform', 'Other'],
  Other: ['Other'],
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBack, onSuccess }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCommunityPicker, setShowCommunityPicker] = useState(false);
  const [showSubCommunityPicker, setShowSubCommunityPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const { showAlert, AlertComponent } = useAlert();
  
  const [formData, setFormData] = useState<FormData>({
    profileIsFor: 'Self',
    gender: 'Male',
    maritalStatus: 'Never Married',
    religionId: 1,
    cityId: 101,
    country: 'India',
    termsAgreed: false,
  });

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    scrollRef.current?.scrollTo({ x: step * width, animated: true });
  };

  const validateStep = (step: number): string | null => {
    switch (step) {
      case 0:
        if (!formData.profileIsFor || !formData.gender) return 'Please select all options';
        break;
      case 1:
        if (!formData.firstName?.trim()) return 'First name is required';
        if (!formData.lastName?.trim()) return 'Last name is required';
        if (!formData.dateOfBirth) return 'Date of birth is required';
        break;
      case 2:
        if (!formData.email?.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
        if (!formData.mobileNumber?.trim()) return 'Mobile number is required';
        break;
      case 3:
        if (!formData.community?.trim()) return 'Community is required';
        if (!formData.termsAgreed) return 'Please accept terms and conditions';
        break;
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      showAlert('Required', error, undefined, 'warning');
      return;
    }
    if (currentStep < STEP_COUNT - 1) {
      goToStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    const error = validateStep(currentStep);
    if (error) {
      showAlert('Required', error, undefined, 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authApi.register(formData as RegistrationData);
      
      // Show custom modal instead of Alert.alert (which doesn't work on web)
      // OTP will be sent when user clicks "Verify Email" button
      setRegistrationId(result.data?.registrationID || '');
      setShowSuccessModal(true);
    } catch (err) {
      showAlert('Error', err instanceof Error ? err.message : 'Registration failed', undefined, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      const formatted = date.toISOString().split('T')[0];
      updateField('dateOfBirth', formatted);
    }
  };

  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return 'Select date of birth';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: STEP_COUNT }).map((_, i) => (
        <View key={i} style={styles.stepDotContainer}>
          <View style={[styles.stepDot, i <= currentStep && styles.stepDotActive]} />
          {i < STEP_COUNT - 1 && (
            <View style={[styles.stepLine, i < currentStep && styles.stepLineActive]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderChip = (label: string, selected: boolean, onPress: () => void) => (
    <TouchableOpacity
      key={label}
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderInput = (
    placeholder: string,
    value: string | undefined,
    onChangeText: (text: string) => void,
    options?: { keyboardType?: 'email-address' | 'phone-pad'; autoCapitalize?: 'none' | 'words' }
  ) => (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={COLORS.text.light}
      value={value}
      onChangeText={onChangeText}
      keyboardType={options?.keyboardType}
      autoCapitalize={options?.autoCapitalize}
    />
  );

  const renderDropdown = (
    label: string,
    value: string | undefined,
    placeholder: string,
    onPress: () => void
  ) => (
    <TouchableOpacity style={styles.dropdown} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.dropdownText, !value && styles.dropdownPlaceholder]}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={20} color={COLORS.text.tertiary} />
    </TouchableOpacity>
  );

  const renderPickerModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    options: string[],
    selectedValue: string | undefined,
    onSelect: (value: string) => void
  ) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={COLORS.text.primary} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScroll}>
            {options.map(option => (
              <TouchableOpacity
                key={option}
                style={[styles.modalOption, selectedValue === option && styles.modalOptionSelected]}
                onPress={() => { onSelect(option); onClose(); }}
              >
                <Text style={[styles.modalOptionText, selectedValue === option && styles.modalOptionTextSelected]}>
                  {option}
                </Text>
                {selectedValue === option && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderStep0 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Let's Get Started</Text>
      <Text style={styles.stepSubtitle}>Who is this profile for?</Text>
      
      <View style={styles.chipGroup}>
        {PROFILE_FOR_OPTIONS.map(opt => 
          renderChip(opt, formData.profileIsFor === opt, () => updateField('profileIsFor', opt))
        )}
      </View>

      <Text style={styles.fieldLabel}>Gender</Text>
      <View style={styles.chipGroup}>
        {GENDER_OPTIONS.map(opt => 
          renderChip(opt, formData.gender === opt, () => updateField('gender', opt))
        )}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Personal Details</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <Text style={styles.fieldLabel}>First Name</Text>
      {renderInput('Enter first name', formData.firstName, t => updateField('firstName', t), { autoCapitalize: 'words' })}

      <Text style={styles.fieldLabel}>Last Name</Text>
      {renderInput('Enter last name', formData.lastName, t => updateField('lastName', t), { autoCapitalize: 'words' })}

      <Text style={styles.fieldLabel}>Date of Birth</Text>
      {Platform.OS === 'web' ? (
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={COLORS.text.light}
          value={formData.dateOfBirth || ''}
          onChangeText={(text) => updateField('dateOfBirth', text)}
        />
      ) : (
        <TouchableOpacity style={styles.dropdown} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.primary} style={{ marginRight: SPACING.sm }} />
          <Text style={[styles.dropdownText, !formData.dateOfBirth && styles.dropdownPlaceholder]}>
            {formatDisplayDate(formData.dateOfBirth)}
          </Text>
          <Ionicons name="chevron-down" size={20} color={COLORS.text.tertiary} />
        </TouchableOpacity>
      )}

      {(showDatePicker && Platform.OS === 'ios') && (
        <Modal visible={showDatePicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date of Birth</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate || new Date(2000, 0, 1)}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1950, 0, 1)}
              />
            </View>
          </View>
        </Modal>
      )}

      {(showDatePicker && Platform.OS === 'android') && (
        <DateTimePicker
          value={selectedDate || new Date(2000, 0, 1)}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1950, 0, 1)}
        />
      )}
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Contact Info</Text>
      <Text style={styles.stepSubtitle}>How can we reach you?</Text>

      <Text style={styles.fieldLabel}>Email</Text>
      {renderInput('your.email@example.com', formData.email, t => updateField('email', t), { keyboardType: 'email-address', autoCapitalize: 'none' })}

      <Text style={styles.fieldLabel}>Mobile Number</Text>
      {renderInput('+919876543210', formData.mobileNumber, t => updateField('mobileNumber', t), { keyboardType: 'phone-pad' })}

      <Text style={styles.fieldLabel}>Country</Text>
      {renderInput('India', formData.country, t => updateField('country', t))}
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Background</Text>
      <Text style={styles.stepSubtitle}>A few more details</Text>

      <Text style={styles.fieldLabel}>Community</Text>
      {renderDropdown('Community', formData.community, 'Select community', () => setShowCommunityPicker(true))}

      <Text style={styles.fieldLabel}>Sub-Community (Optional)</Text>
      {renderDropdown(
        'Sub-Community',
        formData.subCommunity,
        formData.community ? 'Select sub-community' : 'Select community first',
        () => formData.community && setShowSubCommunityPicker(true)
      )}

      <Text style={styles.fieldLabel}>Marital Status</Text>
      <View style={styles.chipGroup}>
        {MARITAL_STATUS_OPTIONS.map(opt => 
          renderChip(opt, formData.maritalStatus === opt, () => updateField('maritalStatus', opt))
        )}
      </View>

      <TouchableOpacity
        style={styles.termsRow}
        onPress={() => updateField('termsAgreed', !formData.termsAgreed)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, formData.termsAgreed && styles.checkboxChecked]}>
          {formData.termsAgreed && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
        <Text style={styles.termsText}>I agree to the Terms & Conditions</Text>
      </TouchableOpacity>

      {renderPickerModal(
        showCommunityPicker,
        () => setShowCommunityPicker(false),
        'Select Community',
        COMMUNITY_OPTIONS,
        formData.community,
        (value) => {
          updateField('community', value);
          updateField('subCommunity', undefined);
        }
      )}

      {renderPickerModal(
        showSubCommunityPicker,
        () => setShowSubCommunityPicker(false),
        'Select Sub-Community',
        SUB_COMMUNITY_OPTIONS[formData.community || 'Other'] || ['Other'],
        formData.subCommunity,
        (value) => updateField('subCommunity', value)
      )}
    </View>
  );

  const steps = [renderStep0, renderStep1, renderStep2, renderStep3];

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={currentStep === 0 ? onBack : () => goToStep(currentStep - 1)}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={{ width: 24 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      >
        {steps.map((renderFn, i) => (
          <ScrollView key={i} style={styles.stepWrapper} contentContainerStyle={styles.stepScrollContent}>
            {renderFn()}
          </ScrollView>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep < STEP_COUNT - 1 ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.9}>
            <Text style={styles.nextButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.nextButton, styles.submitButton]} 
            onPress={handleSubmit} 
            activeOpacity={0.9}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.nextButtonText}>Complete Registration</Text>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* Success Modal - works on web unlike Alert.alert */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={60} color={COLORS.status.success} />
            </View>
            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successMessage}>
              Registration ID: {registrationId}
            </Text>
            <Text style={styles.successSubMessage}>
              Please verify your email to continue.
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={async () => {
                // Send OTP when user clicks Verify Email
                try {
                  await authApi.sendRegistrationOTP(formData.email || '');
                } catch (otpError) {
                  console.warn('Failed to send OTP:', otpError);
                }
                setShowSuccessModal(false);
                onSuccess(formData.email || '');
              }}
              activeOpacity={0.9}
            >
              <Text style={styles.successButtonText}>Verify Email</Text>
              <Ionicons name="mail" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AlertComponent />
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 50 : SPACING.xl,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: '#fff',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  stepDotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  stepDotActive: {
    backgroundColor: '#fff',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: '#fff',
  },
  carousel: {
    flex: 1,
  },
  stepWrapper: {
    width,
  },
  stepScrollContent: {
    paddingBottom: 40,
  },
  stepContent: {
    backgroundColor: COLORS.surface,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.md,
  },
  stepTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  stepSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xl,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.primary,
  },
  chipTextSelected: {
    color: '#fff',
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },
  dropdownText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
  },
  dropdownPlaceholder: {
    color: COLORS.text.light,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  doneButton: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  modalScroll: {
    paddingBottom: 34,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  modalOptionSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  modalOptionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
  },
  modalOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  termsText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    flex: 1,
  },
  footer: {
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.sm,
    ...SHADOWS.md,
  },
  submitButton: {
    backgroundColor: COLORS.status.success,
  },
  nextButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  successModalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  successIconContainer: {
    marginBottom: SPACING.md,
  },
  successTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  successMessage: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  successSubMessage: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  successButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.sm,
    width: '100%',
  },
  successButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: '#fff',
  },
});
