import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Match } from '../types';
import { COLORS, SPACING, FONT_SIZE } from '../constants/theme';

interface ChatPreview {
  id: string;
  match: Match;
  lastMessage: string;
  time: string;
  unread: number;
}

const MOCK_CHATS: ChatPreview[] = [
  {
    id: '1',
    match: { id: '1', name: 'Priya Sharma', age: 26, place: 'Mumbai', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', profession: 'Software Engineer', education: 'B.Tech', about: '' },
    lastMessage: 'That sounds great! Would love to know more about you.',
    time: '2m ago',
    unread: 2,
  },
  {
    id: '2',
    match: { id: '2', name: 'Ananya Reddy', age: 24, place: 'Hyderabad', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200', profession: 'Doctor', education: 'MBBS', about: '' },
    lastMessage: 'Hi! Thanks for connecting 😊',
    time: '1h ago',
    unread: 0,
  },
  {
    id: '3',
    match: { id: '3', name: 'Kavya Nair', age: 27, place: 'Kochi', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', profession: 'CA', education: 'B.Com', about: '' },
    lastMessage: 'Yes, I love traveling too!',
    time: '3h ago',
    unread: 0,
  },
];

interface ChatListScreenProps {
  onOpenChat: (match: Match) => void;
}

export function ChatListScreen({ onOpenChat }: ChatListScreenProps) {
  const renderItem = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => onOpenChat(item.match)}
    >
      <Image source={{ uri: item.match.photo }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.match.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text style={[styles.message, item.unread > 0 && styles.messageUnread]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_CHATS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={48} color={COLORS.text.light} />
            <Text style={styles.emptyText}>No conversations yet</Text>
            <Text style={styles.emptySubtext}>Connect with matches to start chatting</Text>
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
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  content: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  time: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.light,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  message: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.tertiary,
  },
  messageUnread: {
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: SPACING.sm,
  },
  badgeText: {
    color: COLORS.text.inverse,
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginTop: SPACING.md,
  },
  emptySubtext: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text.tertiary,
    marginTop: SPACING.xs,
  },
});
