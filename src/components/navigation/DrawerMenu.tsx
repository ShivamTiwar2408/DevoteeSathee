import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Profile } from '../../types';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

interface MenuItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badge?: number;
  divider?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'matches', icon: 'heart', label: 'My Matches' },
  { id: 'interests', icon: 'star', label: 'Interests Received', badge: 5 },
  { id: 'sent', icon: 'paper-plane', label: 'Interests Sent' },
  { id: 'shortlist', icon: 'bookmark', label: 'Shortlisted', divider: true },
  { id: 'search', icon: 'search', label: 'Search Profiles' },
  { id: 'filters', icon: 'options', label: 'Partner Preferences' },
  { id: 'premium', icon: 'diamond', label: 'Premium Plans', divider: true },
  { id: 'privacy', icon: 'shield-checkmark', label: 'Privacy Settings' },
  { id: 'blocked', icon: 'ban', label: 'Blocked Profiles' },
  { id: 'notifications', icon: 'notifications', label: 'Notifications' },
  { id: 'help', icon: 'help-circle', label: 'Help & Support', divider: true },
  { id: 'about', icon: 'information-circle', label: 'About Us' },
  { id: 'logout', icon: 'log-out', label: 'Logout' },
];

interface DrawerMenuProps {
  visible: boolean;
  profile: Profile | null;
  onClose: () => void;
  onMenuPress: (menuId: string) => void;
}

export function DrawerMenu({ visible, profile, onClose, onMenuPress }: DrawerMenuProps) {
  return (
    <Modal
      animationType="none"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        
        <View style={styles.drawer}>
          {/* Profile Header */}
          <View style={styles.profileSection}>
            <Image
              source={{ uri: profile?.photo || 'https://via.placeholder.com/80' }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile?.name || 'User'}</Text>
              <Text style={styles.profileId}>ID: DS{profile?.id?.slice(0, 6) || '000000'}</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color={COLORS.status.success} />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            </View>
          </View>

          {/* Membership Status */}
          <TouchableOpacity 
            style={styles.membershipBanner}
            onPress={() => onMenuPress('premium')}
          >
            <Ionicons name="diamond" size={20} color="#FFD700" />
            <Text style={styles.membershipText}>Upgrade to Premium</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.text.inverse} />
          </TouchableOpacity>

          {/* Menu Items */}
          <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
            {MENU_ITEMS.map((item) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => onMenuPress(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={item.icon} size={22} color={COLORS.text.secondary} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.badge && (
                    <View style={styles.menuBadge}>
                      <Text style={styles.menuBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={18} color={COLORS.text.light} />
                </TouchableOpacity>
                {item.divider && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </ScrollView>

          {/* App Version */}
          <Text style={styles.version}>DevoteeSaathi v1.0.0</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay.medium,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: COLORS.surface,
    ...SHADOWS.lg,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xxxl + SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.text.inverse,
  },
  profileInfo: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  profileName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text.inverse,
  },
  profileId: {
    fontSize: FONT_SIZE.xs,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  verifiedText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.inverse,
  },
  membershipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  membershipText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text.inverse,
  },
  menuList: {
    flex: 1,
    paddingTop: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.text.secondary,
  },
  menuBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  menuBadgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    color: COLORS.text.inverse,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border.light,
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.lg,
  },
  version: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.light,
    textAlign: 'center',
    paddingVertical: SPACING.md,
  },
});
