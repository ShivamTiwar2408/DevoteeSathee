import { useState, useEffect, useCallback } from 'react';
import { Match } from '../types';
import { matchesApi } from '../api';

interface MatchesState {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
}

export function useMatches() {
  const [state, setState] = useState<MatchesState>({
    matches: [],
    isLoading: true,
    error: null,
  });

  const fetchMatches = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await matchesApi.getMatches();
      setState({
        matches: response.data,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch matches';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    ...state,
    retry: fetchMatches,
  };
}
