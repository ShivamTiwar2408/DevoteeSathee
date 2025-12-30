import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SwipeableProfiles, LoadingScreen, ErrorScreen } from '../components';
import { useMatches } from '../hooks';
import { Match } from '../types';
import { COLORS } from '../constants/theme';

interface HomeScreenProps {
  onOpenChat: (match: Match) => void;
}

export function HomeScreen({ onOpenChat }: HomeScreenProps) {
  const { matches, isLoading, error, retry } = useMatches();

  if (isLoading) {
    return <LoadingScreen message="Finding your matches..." />;
  }

  if (error && matches.length === 0) {
    return <ErrorScreen message={error} onRetry={retry} />;
  }

  return (
    <View style={styles.container}>
      <SwipeableProfiles matches={matches} onChat={onOpenChat} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
