import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { authApi, LoginResponse } from '../api/authApi';
import { useAlert } from '../components/AlertModal';

const { height } = Dimensions.get('window');

interface LoginScreenProps {
  onBack: () => void;
  onSuccess: (loginData: LoginResponse) => void;
  onForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBack, onSuccess, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showAlert, AlertComponent } = useAlert();

  const handleLogin = async () => {
    if (!email.trim()) {
      showAlert('Required', 'Please enter your email', undefined, 'warning');
      return;
    }
    if (!password) {
      showAlert('Required', 'Please enter your password', undefined, 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authApi.login(email.trim(), password);
      onSuccess(result);
    } catch (err) {
      showAlert('Login Failed', err instanceof Error ? err.message : 'Invalid email or password', undefined, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Welcome Back</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="heart" size={40} color={COLORS.primary} />
          </View>
          
          <Text style={styles.title}>Log In</Text>
          <Text style={styles.subtitle}>Enter your credentials to continue</Text>

          <Text style={styles.fieldLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.text.light} />
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor={COLORS.text.light}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.text.light} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
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

          <TouchableOpacity style={styles.forgotPassword} onPress={onForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>Log In</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ for devotees</Text>
      </View>

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
    marginTop: -height * 0.1,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.md,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
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
    borderWidth: 1,
    borderColor: COLORS.border.default,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.primary,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: SPACING.md,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.round,
    marginTop: SPACING.xl,
    gap: SPACING.sm,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FONT_SIZE.xs,
  },
});
