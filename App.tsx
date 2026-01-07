import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { 
  HomeScreen, 
  ChatScreen, 
  ProfileScreen, 
  InboxScreen, 
  ChatListScreen,
  SplashScreen,
  WelcomeScreen,
  RegisterScreen,
  LoginScreen,
  OTPVerificationScreen,
  CreatePasswordScreen,
} from './src/screens';
import { 
  AppHeader, 
  BottomTabs, 
  DrawerMenu,
  ErrorBoundary,
  type TabName 
} from './src/components';
import { 
  StoreProvider, 
  useStore, 
  useUI, 
  useUser,
  userActions, 
  uiActions,
  authActions 
} from './src/store';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from './src/constants/theme';
import { logger } from './src/utils/logger';
import { authApi } from './src/api/authApi';

function AppContent() {
  const { state, dispatch } = useStore();
  const { ui } = useUI();
  const { user } = useUser();
  const [alertModal, setAlertModal] = useState<{
    visible: boolean;
    title: string;
    message: string;
    buttons?: { text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }[];
  }>({ visible: false, title: '', message: '' });

  const showAlert = (
    title: string,
    message: string,
    buttons?: { text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }[]
  ) => {
    setAlertModal({ visible: true, title, message, buttons });
  };

  const hideAlert = () => {
    setAlertModal(prev => ({ ...prev, visible: false }));
  };

  const handleSplashFinish = () => {
    logger.info('App initialized', { screen: 'welcome' });
    uiActions.setScreen('welcome')(dispatch);
  };

  const handleRegister = () => {
    uiActions.setScreen('register')(dispatch);
  };

  const handleLogin = () => {
    uiActions.setScreen('login')(dispatch);
  };

  const handleRegistrationSuccess = (email: string) => {
    logger.info('Registration successful, proceeding to OTP verification');
    uiActions.setRegistrationEmail(email)(dispatch);
    uiActions.setScreen('otp')(dispatch);
  };

  const handleOTPSuccess = (resetToken: string) => {
    logger.info('OTP verified, proceeding to password creation');
    uiActions.setResetToken(resetToken)(dispatch);
    uiActions.setScreen('createPassword')(dispatch);
  };

  const handlePasswordCreated = (loginData: { token: string; userId: string; email: string; firstName: string; lastName: string }) => {
    logger.info('Account created and logged in successfully');
    uiActions.setRegistrationEmail(null)(dispatch);
    uiActions.setResetToken(null)(dispatch);
    // User is already logged in from CreatePasswordScreen
    authActions.login(loginData.userId)(dispatch);
    uiActions.setAuthToken(loginData.token)(dispatch);
    userActions.fetchProfile()(dispatch);
    uiActions.setScreen('main')(dispatch);
  };

  const handleLoginSuccess = (loginData: { token: string; userId: string; email: string; firstName: string; lastName: string }) => {
    logger.info('Login successful', { userId: loginData.userId });
    // Store auth token
    authActions.login(loginData.userId)(dispatch);
    uiActions.setAuthToken(loginData.token)(dispatch);
    userActions.fetchProfile()(dispatch);
    uiActions.setScreen('main')(dispatch);
  };

  const handleBackToWelcome = () => {
    uiActions.setRegistrationEmail(null)(dispatch);
    uiActions.setResetToken(null)(dispatch);
    uiActions.setScreen('welcome')(dispatch);
  };

  const handleBackToRegister = () => {
    uiActions.setScreen('register')(dispatch);
  };

  const handleBackToOTP = () => {
    uiActions.setResetToken(null)(dispatch);
    uiActions.setScreen('otp')(dispatch);
  };

  const handleResendOTP = async () => {
    if (!ui.registrationEmail) return;
    await authApi.sendRegistrationOTP(ui.registrationEmail);
  };

  const handleForgotPassword = () => {
    showAlert('Coming Soon', 'Password reset feature will be available soon.');
  };

  const handleOpenChat = (matchId: string) => {
    logger.debug('Opening chat', { matchId });
    uiActions.openChat(matchId)(dispatch);
  };

  const handleBackToMain = () => {
    uiActions.closeChat()(dispatch);
  };

  const handleTabPress = (tab: TabName) => {
    uiActions.setTab(tab)(dispatch);
  };

  const handleMenuPress = (menuId: string) => {
    uiActions.setDrawer(false)(dispatch);
    
    switch (menuId) {
      case 'matches':
        uiActions.setTab('home')(dispatch);
        break;
      case 'interests':
        uiActions.setTab('inbox')(dispatch);
        break;
      case 'logout':
        showAlert('Logout', 'Are you sure you want to logout?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: () => {
            logger.info('User logged out');
            uiActions.setScreen('welcome')(dispatch);
          }},
        ]);
        break;
      default:
        showAlert('Coming Soon', `${menuId} feature will be available soon!`);
    }
  };

  const handleProfileSave = async (profile: any) => {
    return await userActions.updateProfile(profile)(dispatch);
  };

  // Get selected match from state
  const selectedMatch = ui.selectedMatchId 
    ? state.matches.items.find(m => m.id === ui.selectedMatchId) 
    : null;

  // Splash screen
  if (ui.currentScreen === 'splash') {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onFinish={handleSplashFinish} />
      </>
    );
  }

  // Welcome screen
  if (ui.currentScreen === 'welcome') {
    return (
      <>
        <StatusBar style="light" />
        <WelcomeScreen onRegister={handleRegister} onLogin={handleLogin} />
      </>
    );
  }

  // Login screen
  if (ui.currentScreen === 'login') {
    return (
      <>
        <StatusBar style="light" />
        <LoginScreen 
          onBack={handleBackToWelcome} 
          onSuccess={handleLoginSuccess}
          onForgotPassword={handleForgotPassword}
        />
      </>
    );
  }

  // Register screen
  if (ui.currentScreen === 'register') {
    return (
      <>
        <StatusBar style="light" />
        <RegisterScreen onBack={handleBackToWelcome} onSuccess={handleRegistrationSuccess} />
      </>
    );
  }

  // OTP Verification screen
  if (ui.currentScreen === 'otp') {
    return (
      <>
        <StatusBar style="light" />
        <OTPVerificationScreen 
          email={ui.registrationEmail || ''}
          onBack={handleBackToRegister}
          onSuccess={handleOTPSuccess}
          onResendOTP={handleResendOTP}
        />
      </>
    );
  }

  // Create Password screen
  if (ui.currentScreen === 'createPassword') {
    return (
      <>
        <StatusBar style="light" />
        <CreatePasswordScreen 
          email={ui.registrationEmail || ''}
          resetToken={ui.resetToken || ''}
          onBack={handleBackToOTP}
          onSuccess={handlePasswordCreated}
        />
      </>
    );
  }

  // Chat screen (full screen)
  if (ui.currentScreen === 'chat' && selectedMatch) {
    return (
      <ErrorBoundary>
        <ChatScreen match={selectedMatch} onBack={handleBackToMain} />
      </ErrorBoundary>
    );
  }

  // Main app with tabs - only show after login
  if (ui.currentScreen === 'main') {
    // Fetch profile if not loaded
    if (!user.profile && !user.isLoading) {
      userActions.fetchProfile()(dispatch);
    }

    const renderTabContent = () => {
      switch (ui.activeTab) {
        case 'home':
          return <HomeScreen onOpenChat={(match) => handleOpenChat(match.id)} />;
        case 'inbox':
          return <InboxScreen />;
        case 'chat':
          return <ChatListScreen onOpenChat={(match) => handleOpenChat(match.id)} />;
        case 'profile':
          return (
            <ProfileScreen 
              profile={user.profile} 
              onSave={handleProfileSave} 
              isSaving={user.isSaving} 
            />
          );
        default:
          return <HomeScreen onOpenChat={(match) => handleOpenChat(match.id)} />;
      }
    };

    const getHeaderTitle = () => {
      switch (ui.activeTab) {
        case 'home': return 'DevoteeSaathi';
        case 'inbox': return 'Inbox';
        case 'chat': return 'Messages';
        case 'profile': return 'My Profile';
        default: return 'DevoteeSaathi';
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <AppHeader 
          title={getHeaderTitle()}
          onMenuPress={() => uiActions.setDrawer(true)(dispatch)}
          onNotificationPress={() => uiActions.setTab('inbox')(dispatch)}
          notificationCount={state.inbox.unreadCount}
        />
        
        <View style={styles.content}>
          <ErrorBoundary>
            {renderTabContent()}
          </ErrorBoundary>
        </View>
        
        <BottomTabs 
          activeTab={ui.activeTab} 
          onTabPress={handleTabPress}
          unreadCount={state.inbox.unreadCount}
        />
        
        <DrawerMenu
          visible={ui.isDrawerOpen}
          profile={user.profile}
          onClose={() => uiActions.setDrawer(false)(dispatch)}
          onMenuPress={handleMenuPress}
        />

        {/* Alert Modal for web compatibility */}
        <Modal visible={alertModal.visible} transparent animationType="fade">
          <View style={styles.alertOverlay}>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>{alertModal.title}</Text>
              <Text style={styles.alertMessage}>{alertModal.message}</Text>
              <View style={styles.alertButtonContainer}>
                {(alertModal.buttons || [{ text: 'OK' }]).map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.alertButton,
                      button.style === 'cancel' && styles.alertCancelButton,
                      button.style === 'destructive' && styles.alertDestructiveButton,
                      (alertModal.buttons?.length || 1) > 1 && styles.alertButtonFlex,
                    ]}
                    onPress={() => {
                      if (button.onPress) button.onPress();
                      hideAlert();
                    }}
                  >
                    <Text style={[
                      styles.alertButtonText,
                      button.style === 'cancel' && styles.alertCancelButtonText,
                    ]}>
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // Fallback to welcome
  return (
    <>
      <StatusBar style="light" />
      <WelcomeScreen onRegister={handleRegister} onLogin={handleLogin} />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logger.error('Root ErrorBoundary caught error', {
          error: error.message,
          componentStack: errorInfo.componentStack,
        });
      }}
    >
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ErrorBoundary>
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
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  alertContent: {
    backgroundColor: '#fff',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  alertTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  alertMessage: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  alertButtonContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  alertButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  alertButtonFlex: {
    flex: 1,
  },
  alertCancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },
  alertDestructiveButton: {
    backgroundColor: '#dc3545',
  },
  alertButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: '#fff',
  },
  alertCancelButtonText: {
    color: COLORS.text.secondary,
  },
});
