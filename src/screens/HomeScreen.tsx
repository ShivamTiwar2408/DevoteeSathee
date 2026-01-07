import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SwipeableProfiles, LoadingScreen, ErrorScreen } from '../components';
import { useMatchesStore, matchesActions } from '../store';
import { Match } from '../types';
import { COLORS } from '../constants/theme';

interface HomeScreenProps {
  onOpenChat: (match: Match) => void;
}

export function HomeScreen({ onOpenChat }: HomeScreenProps) {
  const { matches, dispatch } = useMatchesStore();

  useEffect(() => {
    if (matches.items.length === 0 && !matches.isLoading) {
      matchesActions.fetchMatches()(dispatch);
    }
  }, [dispatch, matches.items.length, matches.isLoading]);

  const handleRetry = () => {
    matchesActions.fetchMatches()(dispatch);
  };

  if (matches.isLoading) {
    return <LoadingScreen message="Finding your matches..." />;
  }

  if (matches.error && matches.items.length === 0) {
    return <ErrorScreen message={matches.error} onRetry={handleRetry} />;
  }

  return (
    <View style={styles.container}>
      <SwipeableProfiles matches={matches.items} onChat={onOpenChat} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
