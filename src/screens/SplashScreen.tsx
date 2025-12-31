import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [statusText, setStatusText] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const heartBeat = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Heart beat animation
    const heartAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(heartBeat, {
          toValue: 1.15,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(heartBeat, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    heartAnimation.start();

    // Status text sequence
    const timer1 = setTimeout(() => setStatusText('Connecting...'), 500);
    const timer2 = setTimeout(() => setStatusText('Already logged in'), 1500);
    const timer3 = setTimeout(() => setStatusText('Welcome back!'), 2500);
    const timer4 = setTimeout(() => onFinish(), 3500);

    return () => {
      heartAnimation.stop();
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Background gradient effect */}
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo with heart icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ scale: heartBeat }] },
          ]}
        >
          <View style={styles.heartBackground}>
            <Ionicons name="heart" size={80} color="#fff" />
          </View>
          <View style={styles.innerIcon}>
            <Ionicons name="people" size={32} color={COLORS.primary} />
          </View>
        </Animated.View>

        {/* App Name */}
        <Text style={styles.appName}>DevoteeSathee</Text>
        <Text style={styles.tagline}>Find Your Divine Match</Text>

        {/* Decorative elements */}
        <View style={styles.decorativeLine}>
          <View style={styles.line} />
          <Ionicons name="sparkles" size={20} color="rgba(255,255,255,0.6)" />
          <View style={styles.line} />
        </View>

        {/* Loading section */}
        <View style={styles.loadingSection}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
      </Animated.View>

      {/* Footer */}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: height * 0.15,
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
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
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
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: FONT_SIZE.lg,
    color: 'rgba(255,255,255,0.9)',
    marginTop: SPACING.sm,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  decorativeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xxxl,
  },
  line: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: SPACING.md,
  },
  loadingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },
  statusText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.md,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: FONT_SIZE.xs,
  },
});
