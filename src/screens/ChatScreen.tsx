import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ListRenderItem,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  ChatHeader,
  ChatInput,
  MessageBubble,
  TypingIndicator,
  EmptyChat,
  LoadingScreen,
} from '../components';
import { useChat } from '../hooks';
import { Message, Match } from '../types';
import { COLORS, SPACING } from '../constants/theme';

interface ChatScreenProps {
  match: Match;
  onBack: () => void;
}

export function ChatScreen({ match, onBack }: ChatScreenProps) {
  const flatListRef = useRef<FlatList>(null);
  
  const {
    messages,
    isLoading,
    isSending,
    isTyping,
    currentUserId,
    sendMessage,
  } = useChat({
    conversationId: `conv_${match.id}`,
    participantId: match.id,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isTyping]);

  const renderMessage: ListRenderItem<Message> = ({ item, index }) => {
    const isOwnMessage = item.senderId === currentUserId;
    const prevMessage = messages[index - 1];
    const showTimestamp = !prevMessage || 
      new Date(item.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() > 60000;

    return (
      <MessageBubble
        message={item}
        isOwnMessage={isOwnMessage}
        showTimestamp={showTimestamp}
      />
    );
  };

  const renderFooter = () => {
    if (isTyping) {
      return <TypingIndicator />;
    }
    return null;
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return <EmptyChat name={match.name.split(' ')[0]} />;
  };

  if (isLoading) {
    return <LoadingScreen message="Loading conversation..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ChatHeader
        name={match.name}
        photo={match.photo}
        isTyping={isTyping}
        onBack={onBack}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.messagesList,
          messages.length === 0 && styles.emptyList,
        ]}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
      />

      <ChatInput
        onSend={sendMessage}
        isSending={isSending}
        placeholder={`Message ${match.name.split(' ')[0]}...`}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesList: {
    padding: SPACING.lg,
    flexGrow: 1,
  },
  emptyList: {
    flex: 1,
  },
});
