import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Profile } from '../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';

interface ProfileEditScreenProps {
  profile: Profile | null;
  onSave: (profile: Profile) => Promise<boolean>;
  isSaving: boolean;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

function Field({ label, value, onChangeText, placeholder, multiline, keyboardType }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldInputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text.light}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}

function SelectField({ label, value, options, onSelect }: SelectFieldProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity 
        style={styles.selectButton}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={[styles.selectText, !value && styles.selectPlaceholder]}>
          {value || 'Select ' + label}
        </Text>
        <Ionicons 
          name={expanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color={COLORS.text.tertiary} 
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.optionsList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.option, value === option && styles.optionSelected]}
              onPress={() => { onSelect(option); setExpanded(false); }}
            >
              <Text style={[styles.optionText, value === option && styles.optionTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

export function ProfileEditScreen({ profile, onSave, isSaving }: ProfileEditScreenProps) {
  const [formData, setFormData] = useState<Profile | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({ ...profile });
    }
  }, [profile]);

  const updateField = (field: keyof Profile, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    const success = await onSave(formData);
    if (success) {
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  if (!formData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.photoSection}>
        <Image source={{ uri: formData.photo }} style={styles.photo} />
        <TouchableOpacity style={styles.changePhotoBtn}>
          <Ionicons name="camera" size={18} color={COLORS.text.inverse} />
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
        <Text style={styles.photoHint}>Add up to 6 photos to get more responses</Text>
      </View>

      <Section title="Basic Information">
        <Field label="Full Name" value={formData.name} onChangeText={(v) => updateField('name', v)} />
        <Field label="Age" value={String(formData.age)} onChangeText={(v) => updateField('age', v)} keyboardType="numeric" />
        <Field label="Height" value={formData.height || ''} onChangeText={(v) => updateField('height', v)} placeholder="e.g., 5 ft 6 in" />
        <SelectField 
          label="Marital Status" 
          value={formData.maritalStatus || ''} 
          options={['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce']}
          onSelect={(v) => updateField('maritalStatus', v)}
        />
      </Section>

      <Section title="Religious Background">
        <SelectField 
          label="Religion" 
          value={formData.religion || ''} 
          options={['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']}
          onSelect={(v) => updateField('religion', v)}
        />
        <Field label="Caste" value={formData.caste || ''} onChangeText={(v) => updateField('caste', v)} />
        <Field label="Mother Tongue" value={formData.motherTongue || ''} onChangeText={(v) => updateField('motherTongue', v)} />
      </Section>

      <Section title="Location">
        <Field label="Current City" value={formData.place} onChangeText={(v) => updateField('place', v)} />
      </Section>

      <Section title="Education and Career">
        <Field label="Highest Education" value={formData.education} onChangeText={(v) => updateField('education', v)} />
        <Field label="Profession" value={formData.profession} onChangeText={(v) => updateField('profession', v)} />
        <SelectField 
          label="Working Status" 
          value={formData.workingStatus || ''} 
          options={['Working', 'Not Working', 'Student']}
          onSelect={(v) => updateField('workingStatus', v as Profile['workingStatus'])}
        />
        <Field label="Annual Income" value={formData.salary || ''} onChangeText={(v) => updateField('salary', v)} placeholder="e.g., Rs 10-15 LPA" />
      </Section>

      <Section title="About Me">
        <Field 
          label="About Yourself" 
          value={formData.about} 
          onChangeText={(v) => updateField('about', v)} 
          multiline 
          placeholder="Write about yourself, your interests, hobbies..."
        />
      </Section>

      <TouchableOpacity 
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color={COLORS.text.inverse} />
        ) : (
          <Text style={styles.saveButtonText}>Save Profile</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photoSection: { alignItems: 'center', paddingVertical: SPACING.lg, backgroundColor: COLORS.surface },
  photo: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: COLORS.primary },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.round, marginTop: SPACING.sm, gap: SPACING.xs },
  changePhotoText: { color: COLORS.text.inverse, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  photoHint: { fontSize: FONT_SIZE.xs, color: COLORS.text.light, marginTop: SPACING.sm },
  section: { backgroundColor: COLORS.surface, marginTop: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.md },
  sectionContent: { gap: SPACING.sm },
  field: { marginBottom: SPACING.sm },
  fieldLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text.tertiary, marginBottom: SPACING.xs },
  fieldInput: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, fontSize: FONT_SIZE.md, color: COLORS.text.primary, borderWidth: 1, borderColor: COLORS.border.light },
  fieldInputMultiline: { minHeight: 100, textAlignVertical: 'top' },
  selectButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderWidth: 1, borderColor: COLORS.border.light },
  selectText: { fontSize: FONT_SIZE.md, color: COLORS.text.primary },
  selectPlaceholder: { color: COLORS.text.light },
  optionsList: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.sm, marginTop: SPACING.xs, borderWidth: 1, borderColor: COLORS.border.light, overflow: 'hidden' },
  option: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border.light },
  optionSelected: { backgroundColor: COLORS.primaryLight },
  optionText: { fontSize: FONT_SIZE.md, color: COLORS.text.secondary },
  optionTextSelected: { color: COLORS.primary, fontWeight: '600' },
  saveButton: { backgroundColor: COLORS.primary, marginHorizontal: SPACING.md, marginTop: SPACING.lg, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: COLORS.text.inverse, fontSize: FONT_SIZE.md, fontWeight: '700' },
  bottomPadding: { height: SPACING.xxxl },
});
