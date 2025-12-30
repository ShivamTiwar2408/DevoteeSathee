import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Match } from '../../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, SHADOWS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height - 180; // Compact: account for header + tabs

interface ProfileCardProps {
  match: Match;
  onConnect: () => void;
  onChat: () => void;
  isConnecting: boolean;
}

export function ProfileCard({ match, onConnect, onChat, isConnecting }: ProfileCardProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo */}
        <View style={styles.photoContainer}>
          <Image source={{ uri: match.photo }} style={styles.photo} />
          <View style={styles.photoOverlay}>
            <Text style={styles.nameOnPhoto}>{match.name}, {match.age}</Text>
            <View style={styles.locationOnPhoto}>
              <Ionicons name="location" size={14} color={COLORS.text.inverse} />
              <Text style={styles.locationText}>{match.place}</Text>
            </View>
          </View>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          {/* Quick Info Grid - Compact */}
          <View style={styles.quickInfoGrid}>
            <InfoTile icon="resize-outline" label="Height" value={match.height || '-'} />
            <InfoTile icon="briefcase-outline" label="Status" value={match.workingStatus || '-'} />
            <InfoTile icon="cash-outline" label="Salary" value={match.salary || '-'} />
            <InfoTile icon="people-outline" label="Caste" value={match.caste || '-'} />
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText} numberOfLines={4}>{match.about}</Text>
          </View>

          {/* Details List - Compact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <DetailRow icon="school-outline" label="Education" value={match.education} />
            <DetailRow icon="briefcase-outline" label="Profession" value={match.profession} />
            <DetailRow icon="language-outline" label="Mother Tongue" value={match.motherTongue || '-'} />
            <DetailRow icon="heart-outline" label="Religion" value={match.religion || '-'} />
            <DetailRow icon="person-outline" label="Marital Status" value={match.maritalStatus || '-'} />
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.chatButton} onPress={onChat} activeOpacity={0.8}>
          <Ionicons name="chatbubble-ellipses" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.connectButton}
          onPress={onConnect}
          disabled={isConnecting}
          activeOpacity={0.8}
        >
          {isConnecting ? (
            <ActivityIndicator size="small" color={COLORS.text.inverse} />
          ) : (
            <>
              <Ionicons name="heart" size={18} color={COLORS.text.inverse} />
              <Text style={styles.connectButtonText}>Connect</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface InfoTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

function InfoTile({ icon, label, value }: InfoTileProps) {
  return (
    <View style={styles.infoTile}>
      <Ionicons name={icon} size={16} color={COLORS.primary} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

interface DetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <Ionicons name={icon} size={16} color={COLORS.text.tertiary} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 16,
    height: CARD_HEIGHT,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.md,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 70,
  },
  photoContainer: {
    width: '100%',
    height: width - 16,
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.md,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  nameOnPhoto: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text.inverse,
  },
  locationOnPhoto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.inverse,
    opacity: 0.9,
  },
  detailsContainer: {
    padding: SPACING.md,
  },
  quickInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  infoTile: {
    width: '48%',
    backgroundColor: COLORS.background,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    gap: 2,
  },
  infoLabel: {
    fontSize: 10,
    color: COLORS.text.tertiary,
  },
  infoValue: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  section: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  aboutText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  detailLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.tertiary,
  },
  detailValue: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
    color: COLORS.text.primary,
    maxWidth: '50%',
    textAlign: 'right',
  },
  actionButtons: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  chatButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  connectButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  connectButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text.inverse,
  },
});
