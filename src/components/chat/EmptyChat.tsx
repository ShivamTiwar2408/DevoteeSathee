import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

interface EmptyChatProps {
  name: string;
}

export function EmptyChat({ name }: EmptyChatProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="chatbubbles-outline" size={48} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>Start a conversation</Text>
      <Text style={styles.subtitle}>
        Say hi to {name} and begin your journey together
      </Text>
      <View style={styles.suggestions}>
        <Text style={styles.suggestionsTitle}>Conversation starters:</Text>
        <Text style={styles.suggestion}>• "Hi! I loved reading your profile"</Text>
        <Text style={styles.suggestion}>• "What do you enjoy doing on weekends?"</Text>
        <Text style={styles.suggestion}>• "I noticed we share similar interests!"</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  suggestions: {
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
    borderRadius: SPACING.md,
    width: '100%',
  },
  suggestionsTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  suggestion: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
});
