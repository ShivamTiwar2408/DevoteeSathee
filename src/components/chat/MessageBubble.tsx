import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE } from '../../constants/theme';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showTimestamp?: boolean;
}

export function MessageBubble({ message, isOwnMessage, showTimestamp = true }: MessageBubbleProps) {
  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <View style={[styles.container, isOwnMessage ? styles.ownContainer : styles.otherContainer]}>
      <View style={[styles.bubble, isOwnMessage ? styles.ownBubble : styles.otherBubble]}>
        <Text style={[styles.text, isOwnMessage ? styles.ownText : styles.otherText]}>
          {message.text}
        </Text>
      </View>
      {showTimestamp && (
        <View style={[styles.metaContainer, isOwnMessage && styles.ownMeta]}>
          <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
          {isOwnMessage && (
            <Text style={styles.status}>
              {message.status === 'sending' ? '○' : message.status === 'sent' ? '✓' : '✓✓'}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
    maxWidth: '80%',
  },
  ownContainer: {
    alignSelf: 'flex-end',
    marginLeft: '20%',
  },
  otherContainer: {
    alignSelf: 'flex-start',
    marginRight: '20%',
  },
  bubble: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  ownBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: SPACING.xs,
  },
  otherBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  text: {
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
  ownText: {
    color: COLORS.text.inverse,
  },
  otherText: {
    color: COLORS.text.primary,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: SPACING.xs,
  },
  ownMeta: {
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.light,
  },
  status: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text.light,
  },
});
