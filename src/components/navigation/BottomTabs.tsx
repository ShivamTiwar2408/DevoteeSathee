import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

export type TabName = 'home' | 'inbox' | 'chat' | 'profile';

interface TabItem {
  name: TabName;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  label: string;
}

const TABS: TabItem[] = [
  { name: 'home', icon: 'home-outline', iconActive: 'home', label: 'Home' },
  { name: 'inbox', icon: 'mail-outline', iconActive: 'mail', label: 'Inbox' },
  { name: 'chat', icon: 'chatbubbles-outline', iconActive: 'chatbubbles', label: 'Chat' },
  { name: 'profile', icon: 'person-outline', iconActive: 'person', label: 'Profile' },
];

interface BottomTabsProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
  unreadCount?: number;
}

export function BottomTabs({ activeTab, onTabPress, unreadCount = 0 }: BottomTabsProps) {
  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.name;
        const showBadge = tab.name === 'inbox' && unreadCount > 0;
        
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => onTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={isActive ? tab.iconActive : tab.icon}
                size={24}
                color={isActive ? COLORS.primary : COLORS.text.tertiary}
              />
              {showBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    paddingBottom: SPACING.xs,
    paddingTop: SPACING.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.text.inverse,
    fontSize: 10,
    fontWeight: '700',
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.tertiary,
    marginTop: 2,
  },
  labelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
