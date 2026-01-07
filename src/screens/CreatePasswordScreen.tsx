import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { authApi } from '../api/authApi';
import { useAlert } from '../components/AlertModal';

interface CreatePasswordScreenProps {
  email: string;
  resetToken: string;
  onBack: () => void;
  onSuccess: (loginData: { token: string; userId: string; email: string; firstName: string; lastName: string }) => void;
}

interface PasswordConstraint {
  label: string;
  test: (password: string) => boolean;
}

const PASSWORD_CONSTRAINTS: PasswordConstraint[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'One lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { label: 'One number (0-9)', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character (!@#$%^&*)', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export const CreatePasswordScreen: React.FC<CreatePasswordScreenProps> = ({
  email,
  resetToken,
  onBack,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { showAlert, AlertComponent } = useAlert();

  const constraintResults = useMemo(() => {
    return PASSWORD_CONSTRAINTS.map(constraint => ({
      ...constraint,
      passed: constraint.test(password),
    }));
  }, [password]);

  const allConstraintsPassed = constraintResults.every(c => c.passed);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleCreatePassword = async () => {
    if (!allConstraintsPassed) {
      showAlert('Weak Password', 'Please meet all password requirements', undefined, 'warning');
      return;
    }
    if (!passwordsMatch) {
      showAlert('Mismatch', 'Passwords do not match', undefined, 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.setPassword(email, resetToken, password);
      // Show success modal
      setShowSuccessModal(true);
    } catch (err) {
      showAlert('Error', err instanceof Error ? err.message : 'Failed to create password', undefined, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const loginResult = await authApi.login(email, password);
      // Small delay to show the signing in state
      setTimeout(() => {
        onSuccess(loginResult);
      }, 500);
    } catch (err) {
      setIsSigningIn(false);
      setShowSuccessModal(false);
      showAlert('Sign In Failed', 'Account created but auto sign-in failed. Please login manually.', undefined, 'error');
    }
  };

  const renderConstraint = (constraint: typeof constraintResults[0], index: number) => (
    <View key={index} style={styles.constraintRow}>
      <Ionicons
        name={constraint.passed ? 'checkmark-circle' : 'ellipse-outline'}
        size={18}
        color={constraint.passed ? COLORS.status.success : COLORS.text.light}
      />
      <Text style={[styles.constraintText, constraint.passed && styles.constraintTextPassed]}>
        {constraint.label}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Password</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark" size={40} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Secure Your Account</Text>
          <Text style={styles.subtitle}>Create a strong password to protect your account</Text>

          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.text.light} />
            <TextInput
              style={styles.input}
              placeholder="Create password"
              placeholderTextColor={COLORS.text.light}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.text.light}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.constraintsContainer}>
            {constraintResults.map(renderConstraint)}
          </View>

          <Text style={styles.fieldLabel}>Confirm Password</Text>
          <View style={[
            styles.inputContainer,
            confirmPassword.length > 0 && (passwordsMatch ? styles.inputSuccess : styles.inputError)
          ]}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.text.light} />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor={COLORS.text.light}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={COLORS.text.light}
              />
            </TouchableOpacity>
          </View>
          
          {confirmPassword.length > 0 && (
            <View style={styles.matchIndicator}>
              <Ionicons
                name={passwordsMatch ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={passwordsMatch ? COLORS.status.success : COLORS.status.error}
              />
              <Text style={[
                styles.matchText,
                { color: passwordsMatch ? COLORS.status.success : COLORS.status.error }
              ]}>
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.createButton,
              (!allConstraintsPassed || !passwordsMatch) && styles.buttonDisabled
            ]}
            onPress={handleCreatePassword}
            activeOpacity={0.9}
            disabled={isLoading || !allConstraintsPassed || !passwordsMatch}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.createButtonText}>Create Account</Text>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {isSigningIn ? (
              <>
                <ActivityIndicator size="large" color={COLORS.primary} style={styles.signingInSpinner} />
                <Text style={styles.modalTitle}>Signing you in...</Text>
                <Text style={styles.modalSubtitle}>Please wait while we set up your account</Text>
              </>
            ) : (
              <>
                <View style={styles.successIconContainer}>
                  <Ionicons name="checkmark-circle" size={60} color={COLORS.status.success} />
                </View>
                <Text style={styles.modalTitle}>Account Created!</Text>
                <Text style={styles.modalSubtitle}>
                  Your account has been created successfully. You're all set to find your perfect match!
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleSignIn}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalButtonText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </>
            )}
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
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
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  fieldLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border.default,
    gap: SPACING.sm,
  },
  inputSuccess: {
    borderColor: COLORS.status.success,
  },
  inputError: {
    borderColor: COLORS.status.error,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
  },
  constraintsContainer: {
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  constraintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  constraintText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.light,
  },
  constraintTextPassed: {
    color: COLORS.status.success,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  matchText: {
    fontSize: FONT_SIZE.sm,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.status.success,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.round,
    marginTop: SPACING.xl,
    gap: SPACING.sm,
  },
  buttonDisabled: {
    backgroundColor: COLORS.text.light,
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: '#fff',
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
  signingInSpinner: {
    marginBottom: SPACING.lg,
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
