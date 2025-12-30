import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Profile } from '../../types';
import { ProfileView } from './ProfileView';
import { ProfileEditForm } from './ProfileEditForm';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';

interface ProfileModalProps {
  visible: boolean;
  profile: Profile | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (profile: Profile) => Promise<boolean>;
}

export function ProfileModal({
  visible,
  profile,
  isSaving,
  onClose,
  onSave,
}: ProfileModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const handleClose = () => {
    setEditMode(false);
    setEditedProfile(profile);
    onClose();
  };

  const handleSave = async () => {
    if (editedProfile) {
      const success = await onSave(editedProfile);
      if (success) {
        setEditMode(false);
      }
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setEditMode(false);
  };

  if (!profile || !editedProfile) return null;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={28} color={COLORS.text.secondary} />
          </TouchableOpacity>
          <Text style={styles.title}>My Profile</Text>
          {!editMode ? (
            <TouchableOpacity onPress={() => setEditMode(true)}>
              <Ionicons name="create-outline" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 28 }} />
          )}
        </View>

        <ScrollView style={styles.scroll}>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: editMode ? editedProfile.photo : profile.photo }}
              style={styles.photo}
            />
            {editMode && (
              <TouchableOpacity style={styles.changePhotoButton}>
                <Ionicons name="camera" size={20} color={COLORS.text.inverse} />
              </TouchableOpacity>
            )}
          </View>

          {editMode ? (
            <ProfileEditForm
              profile={editedProfile}
              onChange={setEditedProfile}
              onSave={handleSave}
              onCancel={handleCancel}
              saving={isSaving}
            />
          ) : (
            <ProfileView profile={profile} />
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.dark,
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  scroll: {
    flex: 1,
  },
  photoContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 28,
    right: '35%',
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
});
