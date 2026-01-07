import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onRegister: () => void;
  onLogin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onRegister, onLogin }) => {
  const heartBeat = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(heartBeat, { toValue: 1.1, duration: 600, useNativeDriver: true }),
        Animated.timing(heartBeat, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: heartBeat }] }]}>
          <View style={styles.heartBackground}>
            <Ionicons name="heart" size={80} color="#fff" />
          </View>
          <View style={styles.innerIcon}>
            <Ionicons name="people" size={32} color={COLORS.primary} />
          </View>
        </Animated.View>

        <Text style={styles.appName}>DevoteeSaathi</Text>
        <Text style={styles.tagline}>Find Your Divine Match</Text>

        <View style={styles.decorativeLine}>
          <View style={styles.line} />
          <Ionicons name="sparkles" size={20} color="rgba(255,255,255,0.6)" />
          <View style={styles.line} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.registerButton} onPress={onRegister} activeOpacity={0.9}>
          <Ionicons name="person-add" size={22} color={COLORS.primary} />
          <Text style={styles.registerButtonText}>Register Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={onLogin} activeOpacity={0.8}>
          <Ionicons name="log-in" size={22} color="#fff" />
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ for devotees</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderTopLeftRadius: width,
    borderTopRightRadius: width,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  logoContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  heartBackground: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 70,
  },
  innerIcon: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: FONT_SIZE.lg,
    color: 'rgba(255,255,255,0.9)',
    marginTop: SPACING.sm,
    fontWeight: '500',
  },
  decorativeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  line: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: SPACING.md,
  },
  buttonContainer: {
    paddingHorizontal: SPACING.xxl,
    paddingBottom: 80,
    gap: SPACING.md,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: SPACING.lg,
    borderRadius: 30,
    gap: SPACING.sm,
    ...SHADOWS.md,
  },
  registerButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.primary,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: SPACING.lg,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    gap: SPACING.sm,
  },
  loginButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FONT_SIZE.xs,
  },
});
