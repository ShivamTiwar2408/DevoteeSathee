import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertType;
  buttons?: AlertButton[];
  onClose: () => void;
}

const getIconForType = (type: AlertType): { name: keyof typeof Ionicons.glyphMap; color: string } => {
  switch (type) {
    case 'success':
      return { name: 'checkmark-circle', color: COLORS.status.success };
    case 'error':
      return { name: 'close-circle', color: COLORS.status.error };
    case 'warning':
      return { name: 'warning', color: COLORS.status.warning };
    case 'info':
    default:
      return { name: 'information-circle', color: COLORS.primary };
  }
};

export const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  title,
  message,
  type = 'info',
  buttons = [{ text: 'OK' }],
  onClose,
}) => {
  const icon = getIconForType(type);

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: `${icon.color}20` }]}>
            <Ionicons name={icon.name} size={40} color={icon.color} />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === 'cancel' && styles.cancelButton,
                  button.style === 'destructive' && styles.destructiveButton,
                  buttons.length > 1 && styles.buttonFlex,
                ]}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    button.style === 'cancel' && styles.cancelButtonText,
                    button.style === 'destructive' && styles.destructiveButtonText,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Hook for easier usage
interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  buttons: AlertButton[];
}

export const useAlert = () => {
  const [alertState, setAlertState] = React.useState<AlertState>({
    visible: false,
    title: '',
    message: '',
    type: 'info',
    buttons: [{ text: 'OK' }],
  });

  const showAlert = (
    title: string,
    message: string,
    buttons?: AlertButton[],
    type?: AlertType
  ) => {
    setAlertState({
      visible: true,
      title,
      message,
      type: type || 'info',
      buttons: buttons || [{ text: 'OK' }],
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, visible: false }));
  };

  const AlertComponent = () => (
    <AlertModal
      visible={alertState.visible}
      title={alertState.title}
      message={alertState.message}
      type={alertState.type}
      buttons={alertState.buttons}
      onClose={hideAlert}
    />
  );

  return { showAlert, hideAlert, AlertComponent };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  content: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text.tertiary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  buttonFlex: {
    flex: 1,
  },
  cancelButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border.default,
  },
  destructiveButton: {
    backgroundColor: COLORS.status.error,
  },
  buttonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButtonText: {
    color: COLORS.text.secondary,
  },
  destructiveButtonText: {
    color: '#fff',
  },
});
