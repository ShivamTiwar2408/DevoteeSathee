import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Profile } from '../../types';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

interface ProfileViewProps {
  profile: Profile;
}

export function ProfileView({ profile }: ProfileViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{profile.name}, {profile.age}</Text>

      <ProfileInfoRow icon="location-outline" text={profile.place} />
      <ProfileInfoRow icon="briefcase-outline" text={profile.profession} />
      <ProfileInfoRow icon="school-outline" text={profile.education} />
      {profile.height && <ProfileInfoRow icon="resize-outline" text={profile.height} />}
      {profile.motherTongue && <ProfileInfoRow icon="language-outline" text={profile.motherTongue} />}

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About Me</Text>
        <Text style={styles.aboutText}>{profile.about}</Text>
      </View>
    </View>
  );
}

interface ProfileInfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

function ProfileInfoRow({ icon, text }: ProfileInfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={COLORS.text.tertiary} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xxl,
  },
  name: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  infoText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary,
  },
  aboutSection: {
    marginTop: SPACING.xxl,
  },
  aboutTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  aboutText: {
    fontSize: 15,
    color: COLORS.text.tertiary,
    lineHeight: 22,
  },
});
