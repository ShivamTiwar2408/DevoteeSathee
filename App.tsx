import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { 
  HomeScreen, 
  ChatScreen, 
  ProfileScreen, 
  InboxScreen, 
  ChatListScreen,
  SplashScreen 
} from './src/screens';
import { 
  AppHeader, 
  BottomTabs, 
  DrawerMenu,
  type TabName 
} from './src/components';
import { useProfile } from './src/hooks';
import { Match } from './src/types';
import { COLORS } from './src/constants/theme';

type Screen = 'splash' | 'main' | 'chat';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  
  const { profile, isSaving, updateProfile } = useProfile();

  const handleSplashFinish = () => {
    setCurrentScreen('main');
  };

  const handleOpenChat = (match: Match) => {
    setSelectedMatch(match);
    setCurrentScreen('chat');
  };

  const handleBackToMain = () => {
    setCurrentScreen('main');
    setSelectedMatch(null);
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
  };

  const handleMenuPress = (menuId: string) => {
    setDrawerVisible(false);
    
    switch (menuId) {
      case 'matches':
        setActiveTab('home');
        break;
      case 'interests':
        setActiveTab('inbox');
        break;
      case 'logout':
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: () => {} },
        ]);
        break;
      default:
        Alert.alert('Coming Soon', `${menuId} feature will be available soon!`);
    }
  };

  // Splash screen
  if (currentScreen === 'splash') {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onFinish={handleSplashFinish} />
      </>
    );
  }

  // Chat screen (full screen)
  if (currentScreen === 'chat' && selectedMatch) {
    return (
      <ChatScreen match={selectedMatch} onBack={handleBackToMain} />
    );
  }

  // Main app with tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onOpenChat={handleOpenChat} />;
      case 'inbox':
        return <InboxScreen />;
      case 'chat':
        return <ChatListScreen onOpenChat={handleOpenChat} />;
      case 'profile':
        return (
          <ProfileScreen 
            profile={profile} 
            onSave={updateProfile} 
            isSaving={isSaving} 
          />
        );
      default:
        return <HomeScreen onOpenChat={handleOpenChat} />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'home': return 'DevoteeSathee';
      case 'inbox': return 'Inbox';
      case 'chat': return 'Messages';
      case 'profile': return 'My Profile';
      default: return 'DevoteeSathee';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <AppHeader 
        title={getHeaderTitle()}
        onMenuPress={() => setDrawerVisible(true)}
        onNotificationPress={() => setActiveTab('inbox')}
        notificationCount={3}
      />
      
      <View style={styles.content}>
        {renderTabContent()}
      </View>
      
      <BottomTabs 
        activeTab={activeTab} 
        onTabPress={handleTabPress}
        unreadCount={2}
      />
      
      <DrawerMenu
        visible={drawerVisible}
        profile={profile}
        onClose={() => setDrawerVisible(false)}
        onMenuPress={handleMenuPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
