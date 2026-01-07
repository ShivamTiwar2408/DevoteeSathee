import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { logger } from '../../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log to our logging service
    logger.error('ErrorBoundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning-outline" size={64} color={COLORS.status.error} />
          </View>
          
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            We're sorry, but something unexpected happened. Please try again.
          </Text>

          {__DEV__ && this.state.error && (
            <ScrollView style={styles.debugContainer}>
              <Text style={styles.debugTitle}>Debug Info:</Text>
              <Text style={styles.debugText}>{this.state.error.message}</Text>
              {this.state.errorInfo && (
                <Text style={styles.debugStack}>
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Ionicons name="refresh" size={20} color={COLORS.text.inverse} />
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: 22,
  },
  debugContainer: {
    maxHeight: 200,
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  debugTitle: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.status.error,
    marginBottom: SPACING.sm,
  },
  debugText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.secondary,
    fontFamily: 'monospace',
  },
  debugStack: {
    fontSize: 10,
    color: COLORS.text.light,
    fontFamily: 'monospace',
    marginTop: SPACING.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
  },
  buttonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text.inverse,
  },
});
