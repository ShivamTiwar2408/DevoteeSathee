import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert,
  ViewToken,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Match } from '../../types';
import { ProfileCard } from './ProfileCard';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme';
import { matchesApi } from '../../api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 16;

interface SwipeableProfilesProps {
  matches: Match[];
  onChat: (match: Match) => void;
}

export function SwipeableProfiles({ matches, onChat }: SwipeableProfilesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [preferVideo, setPreferVideo] = useState(true); // Global preference
  const flatListRef = useRef<FlatList>(null);

  const toggleMediaPreference = useCallback(() => {
    setPreferVideo(prev => !prev);
  }, []);

  const handleConnect = useCallback(async (match: Match, message?: string) => {
    setConnectingId(match.id);
    try {
      await matchesApi.sendInterest(match.id);
      Alert.alert(
        'Request Sent! 💕',
        `Your connection request has been sent to ${match.name}.\n\nMessage: "${message}"`,
        [{ text: 'OK' }]
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to send request. Please try again.');
    } finally {
      setConnectingId(null);
    }
  }, []);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      setCurrentIndex(newIndex);
    }
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    if (currentIndex < matches.length - 1) {
      const newIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, matches.length]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const renderItem = useCallback(({ item }: { item: Match }) => (
    <View style={styles.cardWrapper}>
      <ProfileCard
        match={item}
        onConnect={(message) => handleConnect(item, message)}
        onChat={() => onChat(item)}
        isConnecting={connectingId === item.id}
        showVideo={preferVideo}
        onToggleMedia={toggleMediaPreference}
      />
    </View>
  ), [connectingId, handleConnect, onChat, preferVideo, toggleMediaPreference]);

  const getItemLayout = useCallback((_: unknown, index: number) => ({
    length: CARD_WIDTH + SPACING.xs,
    offset: (CARD_WIDTH + SPACING.xs) * index,
    index,
  }), []);

  if (matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-dislike-outline" size={48} color={COLORS.text.light} />
        <Text style={styles.emptyText}>No matches found</Text>
        <Text style={styles.emptySubtext}>Check back later</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Counter */}
      <View style={styles.headerRow}>
        <Text style={styles.counterText}>{currentIndex + 1} / {matches.length}</Text>
      </View>

      {/* Cards */}
      <FlatList
        ref={flatListRef}
        data={matches}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING.xs}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={getItemLayout}
      />

      {/* Navigation */}
      {currentIndex > 0 && (
        <TouchableOpacity style={[styles.navButton, styles.navLeft]} onPress={goToPrevious}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text.inverse} />
        </TouchableOpacity>
      )}
      {currentIndex < matches.length - 1 && (
        <TouchableOpacity style={[styles.navButton, styles.navRight]} onPress={goToNext}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.text.inverse} />
        </TouchableOpacity>
      )}

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {matches.slice(0, 10).map((_, index) => (
          <View key={index} style={[styles.dot, index === currentIndex && styles.dotActive]} />
        ))}
        {matches.length > 10 && <Text style={styles.moreText}>+{matches.length - 10}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  counterText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.tertiary,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: SPACING.xs,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: SPACING.xs,
  },
  navButton: {
    position: 'absolute',
    top: '45%',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  navLeft: {
    left: 4,
  },
  navRight: {
    right: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border.default,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 16,
  },
  moreText: {
    fontSize: 10,
    color: COLORS.text.light,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
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
