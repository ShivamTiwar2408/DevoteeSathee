import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme';

interface HeaderProps {
  photoUrl?: string;
  onProfilePress: () => void;
}

export function Header({ photoUrl, onProfilePress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DevoteeSathee</Text>
      <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons name="person" size={20} color={COLORS.text.inverse} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    ...SHADOWS.md,
  },
  logo: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text.inverse,
  },
  profileButton: {
    padding: 2,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.text.inverse,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
