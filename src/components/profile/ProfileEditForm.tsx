import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Profile } from '../../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';

interface ProfileEditFormProps {
  profile: Profile;
  onChange: (profile: Profile) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}

export function ProfileEditForm({
  profile,
  onChange,
  onSave,
  onCancel,
  saving,
}: ProfileEditFormProps) {
  const updateField = (field: keyof Profile, value: string | number) => {
    onChange({ ...profile, [field]: value });
  };

  return (
    <View style={styles.container}>
      <FormInput
        label="Name"
        value={profile.name}
        onChangeText={(text) => updateField('name', text)}
        placeholder="Your name"
      />
      <FormInput
        label="Age"
        value={String(profile.age)}
        onChangeText={(text) => updateField('age', parseInt(text) || 0)}
        placeholder="Your age"
        keyboardType="numeric"
      />
      <FormInput
        label="Location"
        value={profile.place}
        onChangeText={(text) => updateField('place', text)}
        placeholder="City, State"
      />
      <FormInput
        label="Profession"
        value={profile.profession}
        onChangeText={(text) => updateField('profession', text)}
        placeholder="Your profession"
      />
      <FormInput
        label="Education"
        value={profile.education}
        onChangeText={(text) => updateField('education', text)}
        placeholder="Your education"
      />
      <FormInput
        label="Height"
        value={profile.height || ''}
        onChangeText={(text) => updateField('height', text)}
        placeholder="e.g., 5 feet 10 inches"
      />
      <FormInput
        label="Mother Tongue"
        value={profile.motherTongue || ''}
        onChangeText={(text) => updateField('motherTongue', text)}
        placeholder="Your mother tongue"
      />
      <FormInput
        label="About Me"
        value={profile.about}
        onChangeText={(text) => updateField('about', text)}
        placeholder="Tell us about yourself"
        multiline
      />

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={onSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={COLORS.text.inverse} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
}

function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
}: FormInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xxl,
  },
  inputGroup: {
    marginBottom: SPACING.xl,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border.default,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    backgroundColor: COLORS.background,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text.tertiary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text.inverse,
  },
});
