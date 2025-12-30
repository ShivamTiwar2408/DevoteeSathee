import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface InboxItem {
  id: string;
  type: 'interest' | 'accept' | 'view' | 'shortlist';
  name: string;
  photo: string;
  time: string;
  isNew: boolean;
}

const MOCK_INBOX: InboxItem[] = [
  { id: '1', type: 'interest', name: 'Priya Sharma', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', time: '2h ago', isNew: true },
  { id: '2', type: 'accept', name: 'Ananya Reddy', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200', time: '5h ago', isNew: true },
  { id: '3', type: 'view', name: 'Kavya Nair', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', time: '1d ago', isNew: false },
  { id: '4', type: 'shortlist', name: 'Meera Patel', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200', time: '2d ago', isNew: false },
  { id: '5', type: 'interest', name: 'Divya Iyer', photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200', time: '3d ago', isNew: false },
];

const getTypeInfo = (type: InboxItem['type']) => {
  switch (type) {
    case 'interest': return { icon: 'heart', color: COLORS.primary, text: 'sent you an interest' };
    case 'accept': return { icon: 'checkmark-circle', color: COLORS.status.success, text: 'accepted your interest' };
    case 'view': return { icon: 'eye', color: COLORS.text.tertiary, text: 'viewed your profile' };
    case 'shortlist': return { icon: 'bookmark', color: '#FFD700', text: 'shortlisted you' };
  }
};

export function InboxScreen() {
  const renderItem = ({ item }: { item: InboxItem }) => {
    const typeInfo = getTypeInfo(item.type);
    
    return (
      <TouchableOpacity style={[styles.item, item.isNew && styles.itemNew]}>
        <Image source={{ uri: item.photo }} style={styles.avatar} />
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            {item.isNew && <View style={styles.newDot} />}
          </View>
          <View style={styles.typeRow}>
            <Ionicons name={typeInfo.icon as any} size={14} color={typeInfo.color} />
            <Text style={styles.typeText}>{typeInfo.text}</Text>
          </View>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.text.light} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_INBOX}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="mail-open-outline" size={48} color={COLORS.text.light} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    paddingVertical: SPACING.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  itemNew: {
    backgroundColor: COLORS.primaryLight,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  content: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  newDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: 2,
  },
  typeText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.secondary,
  },
  time: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.light,
    marginTop: 2,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.tertiary,
    marginTop: SPACING.md,
  },
});
