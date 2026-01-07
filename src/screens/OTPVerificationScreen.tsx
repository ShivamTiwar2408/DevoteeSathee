import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { authApi } from '../api/authApi';
import { useAlert } from '../components/AlertModal';

const OTP_LENGTH = 6;

interface OTPVerificationScreenProps {
  email: string;
  onBack: () => void;
  onSuccess: (resetToken: string) => void;
  onResendOTP: () => Promise<void>;
}

export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  email,
  onBack,
  onSuccess,
  onResendOTP,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { showAlert, AlertComponent } = useAlert();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedOtp.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) {
      showAlert('Required', 'Please enter the complete OTP', undefined, 'warning');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Verifying OTP:', { email, otp: otpString });
      const result = await authApi.verifyRegistrationOTP(email, otpString);
      console.log('Verify result:', result);
      
      // Store reset token and show success modal
      setResetToken(result.resetToken || 'verified');
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Verify error:', err);
      showAlert('Verification Failed', err instanceof Error ? err.message : 'Verification failed', undefined, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToPassword = () => {
    setShowSuccessModal(false);
    onSuccess(resetToken || 'verified');
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setIsResending(true);
    try {
      await onResendOTP();
      setResendTimer(30);
      showAlert('Success', 'OTP has been resent to your email', undefined, 'success');
    } catch (err) {
      showAlert('Error', 'Failed to resend OTP', undefined, 'error');
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify Email</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-open" size={40} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to{'\n'}
            <Text style={styles.emailText}>{maskedEmail}</Text>
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => { inputRefs.current[index] = ref; }}
                style={[styles.otpInput, digit && styles.otpInputFilled]}
                value={digit}
                onChangeText={value => handleOtpChange(value, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={index === 0 ? OTP_LENGTH : 1}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity
            style={[styles.verifyButton, isLoading && styles.buttonDisabled]}
            onPress={handleVerify}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.verifyButtonText}>Verify Email</Text>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            {resendTimer > 0 ? (
              <Text style={styles.timerText}>Resend in {resendTimer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={isResending}>
                <Text style={styles.resendLink}>
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={60} color={COLORS.status.success} />
            </View>
            <Text style={styles.modalTitle}>OTP Verified Successfully!</Text>
            <Text style={styles.modalSubtitle}>
              Your email has been verified. Now let's create a secure password for your account.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleContinueToPassword}
              activeOpacity={0.9}
            >
              <Text style={styles.modalButtonText}>Create Password</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.md,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  emailText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border.default,
    backgroundColor: COLORS.background,
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.text.primary,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.round,
    gap: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: '#fff',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  resendText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.tertiary,
  },
  timerText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.light,
  },
  resendLink: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
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
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  modalSubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  modalButton: {
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
  modalButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: '#fff',
  },
});
