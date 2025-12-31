import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { Profile } from '../types';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS } from '../constants/theme';

interface ProfileScreenProps { profile: Profile | null; onSave: (profile: Profile) => Promise<boolean>; isSaving: boolean; }

const PROFILE_FIELDS = ['name', 'age', 'gender', 'photo', 'height', 'weight', 'bodyType', 'complexion', 'place', 'state', 'country', 'religion', 'caste', 'motherTongue', 'education', 'profession', 'workingStatus', 'salary', 'familyType', 'familyStatus', 'diet', 'maritalStatus', 'about'];

const calculateCompleteness = (profile: Profile): number => {
  const filled = PROFILE_FIELDS.filter(field => { const value = profile[field as keyof Profile]; return value !== undefined && value !== null && value !== ''; }).length;
  return Math.round((filled / PROFILE_FIELDS.length) * 100);
};

const formatHeight = (cm: number): string => { const feet = Math.floor(cm / 30.48); const inches = Math.round((cm % 30.48) / 2.54); return `${feet}'${inches}"`; };
const formatSalary = (lpa: number): string => lpa >= 100 ? `₹${(lpa / 100).toFixed(1)} Cr` : `₹${lpa} LPA`;

function CircularProgress({ percentage, size = 80 }: { percentage: number; size?: number }) {
  const color = percentage >= 80 ? '#4CAF50' : percentage >= 50 ? COLORS.primary : '#FF9800';
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 6, borderColor: color, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: FONT_SIZE.md, fontWeight: '700', color }}>{percentage}%</Text>
    </View>
  );
}

function ViewSection({ title, icon, children }: { title: string; icon: keyof typeof Ionicons.glyphMap; children: React.ReactNode }) {
  return (<View style={styles.viewSection}><View style={styles.viewSectionHeader}><Ionicons name={icon} size={18} color={COLORS.primary} /><Text style={styles.viewSectionTitle}>{title}</Text></View><View>{children}</View></View>);
}

function ViewRow({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;
  return <View style={styles.viewRow}><Text style={styles.viewRowLabel}>{label}</Text><Text style={styles.viewRowValue}>{value}</Text></View>;
}

function EditSection({ title, icon, expanded, onToggle, children }: { title: string; icon: keyof typeof Ionicons.glyphMap; expanded: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (<View style={styles.editSection}><TouchableOpacity style={styles.editSectionHeader} onPress={onToggle} activeOpacity={0.7}><View style={styles.editSectionLeft}><Ionicons name={icon} size={20} color={COLORS.primary} /><Text style={styles.editSectionTitle}>{title}</Text></View><Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.text.tertiary} /></TouchableOpacity>{expanded && <View style={styles.editSectionContent}>{children}</View>}</View>);
}

function TextField({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (<View style={styles.fieldContainer}><Text style={styles.fieldLabel}>{label}</Text><TextInput style={styles.textInput} value={value || ''} onChangeText={onChange} placeholder={`Enter ${label.toLowerCase()}`} placeholderTextColor={COLORS.text.light} /></View>);
}

function TextAreaField({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string }) {
  return (<View style={styles.fieldContainer}><Text style={styles.fieldLabel}>{label}</Text><TextInput style={[styles.textInput, styles.textArea]} value={value || ''} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={COLORS.text.light} multiline numberOfLines={4} textAlignVertical="top" /></View>);
}

function SliderField({ label, value, min, max, onChange, suffix, format }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void; suffix?: string; format?: (v: number) => string }) {
  const displayValue = format ? format(value) : `${value}${suffix || ''}`;
  return (<View style={styles.fieldContainer}><View style={styles.sliderHeader}><Text style={styles.fieldLabel}>{label}</Text><Text style={styles.sliderValue}>{displayValue}</Text></View><Slider style={styles.slider} minimumValue={min} maximumValue={max} step={1} value={value} onValueChange={onChange} minimumTrackTintColor={COLORS.primary} maximumTrackTintColor={COLORS.border.default} thumbTintColor={COLORS.primary} /></View>);
}

function ChipSelect({ label, value, options, onChange }: { label: string; value?: string; options: string[]; onChange: (v: string) => void }) {
  return (<View style={styles.fieldContainer}><Text style={styles.fieldLabel}>{label}</Text><View style={styles.chipContainer}>{options.map(option => (<TouchableOpacity key={option} style={[styles.chip, value === option && styles.chipSelected]} onPress={() => onChange(option)} activeOpacity={0.7}><Text style={[styles.chipText, value === option && styles.chipTextSelected]}>{option}</Text></TouchableOpacity>))}</View></View>);
}

const SAMPLE_MEDIA = [{ type: 'photo', uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }, { type: 'video', uri: 'https://example.com/video.mp4' }];

export function ProfileScreen({ profile, onSave, isSaving }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Profile | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');

  useEffect(() => { if (profile) setFormData({ ...profile }); }, [profile]);

  if (!profile || !formData) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  const completeness = calculateCompleteness(formData);
  const updateField = (field: keyof Profile, value: string | number) => setFormData(prev => prev ? { ...prev, [field]: value } : null);
  const handleSave = async () => { if (!formData) return; const success = await onSave(formData); if (success) { setIsEditing(false); Alert.alert('Success', 'Profile updated!'); } };
  const toggleSection = (section: string) => setExpandedSection(expandedSection === section ? null : section);
  const handleAddMedia = () => Alert.alert('Add Media', 'Choose an option', [{ text: 'Take Photo' }, { text: 'Record Video' }, { text: 'Choose from Gallery' }, { text: 'Cancel', style: 'cancel' }]);

  if (!isEditing) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={{ uri: formData.photo }} style={styles.photo} />
          <Text style={styles.name}>{formData.name}, {formData.age}</Text>
          <Text style={styles.subtitle}>{formData.profession}</Text>
          <View style={styles.completenessContainer}><CircularProgress percentage={completeness} /><Text style={styles.completenessLabel}>Profile Complete</Text></View>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}><Ionicons name="pencil" size={16} color="#fff" /><Text style={styles.editButtonText}>Edit Profile</Text></TouchableOpacity>
        </View>
        <View style={styles.mediaSection}>
          <View style={styles.mediaSectionHeader}><Text style={styles.mediaSectionTitle}>My Photos & Videos</Text><TouchableOpacity onPress={handleAddMedia}><Ionicons name="add-circle" size={28} color={COLORS.primary} /></TouchableOpacity></View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>{SAMPLE_MEDIA.map((item, index) => (<View key={index} style={styles.mediaItem}><Image source={{ uri: item.uri }} style={styles.mediaThumbnail} />{item.type === 'video' && <View style={styles.videoOverlay}><Ionicons name="play-circle" size={32} color="#fff" /></View>}</View>))}<TouchableOpacity style={styles.addMediaButton} onPress={handleAddMedia}><Ionicons name="camera" size={28} color={COLORS.primary} /><Text style={styles.addMediaText}>Add</Text></TouchableOpacity></ScrollView>
        </View>
        <ViewSection title="Basic Information" icon="person-outline"><ViewRow label="Gender" value={formData.gender} /><ViewRow label="Height" value={formData.height ? formatHeight(formData.height) : undefined} /><ViewRow label="Weight" value={formData.weight ? `${formData.weight} kg` : undefined} /><ViewRow label="Body Type" value={formData.bodyType} /><ViewRow label="Complexion" value={formData.complexion} /><ViewRow label="Marital Status" value={formData.maritalStatus} /></ViewSection>
        <ViewSection title="Location" icon="location-outline"><ViewRow label="City" value={formData.place} /><ViewRow label="State" value={formData.state} /><ViewRow label="Country" value={formData.country} /></ViewSection>
        <ViewSection title="Religious Background" icon="heart-outline"><ViewRow label="Religion" value={formData.religion} /><ViewRow label="Caste" value={formData.caste} /><ViewRow label="Mother Tongue" value={formData.motherTongue} /></ViewSection>
        <ViewSection title="Education & Career" icon="briefcase-outline"><ViewRow label="Education" value={formData.education} /><ViewRow label="Profession" value={formData.profession} /><ViewRow label="Company" value={formData.company} /><ViewRow label="Annual Income" value={formData.salary ? formatSalary(formData.salary) : undefined} /></ViewSection>
        <ViewSection title="Family Details" icon="people-outline"><ViewRow label="Family Type" value={formData.familyType} /><ViewRow label="Family Status" value={formData.familyStatus} /></ViewSection>
        <ViewSection title="Lifestyle" icon="leaf-outline"><ViewRow label="Diet" value={formData.diet} /><ViewRow label="Smoking" value={formData.smoking} /><ViewRow label="Drinking" value={formData.drinking} /></ViewSection>
        <ViewSection title="About Me" icon="document-text-outline"><Text style={styles.aboutText}>{formData.about || 'Not specified'}</Text></ViewSection>
        <View style={styles.bottomPadding} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.editHeader}><TouchableOpacity onPress={() => setIsEditing(false)} style={styles.backButton}><Ionicons name="arrow-back" size={24} color={COLORS.text.primary} /></TouchableOpacity><Text style={styles.editTitle}>Edit Profile</Text><TouchableOpacity onPress={handleSave} disabled={isSaving} style={styles.saveBtn}>{isSaving ? <ActivityIndicator size="small" color={COLORS.primary} /> : <Text style={styles.saveBtnText}>Save</Text>}</TouchableOpacity></View>
      <View style={styles.photoEditSection}><Image source={{ uri: formData.photo }} style={styles.photoEdit} /><TouchableOpacity style={styles.changePhotoBtn}><Ionicons name="camera" size={20} color="#fff" /></TouchableOpacity></View>
      <EditSection title="Basic Information" icon="person-outline" expanded={expandedSection === 'basic'} onToggle={() => toggleSection('basic')}><TextField label="Full Name" value={formData.name} onChange={v => updateField('name', v)} /><SliderField label="Age" value={formData.age} min={18} max={70} onChange={v => updateField('age', v)} suffix=" years" /><ChipSelect label="Gender" value={formData.gender} options={['Male', 'Female', 'Other']} onChange={v => updateField('gender', v)} /><SliderField label="Height" value={formData.height || 150} min={120} max={220} onChange={v => updateField('height', v)} format={formatHeight} /><SliderField label="Weight" value={formData.weight || 50} min={30} max={150} onChange={v => updateField('weight', v)} suffix=" kg" /><ChipSelect label="Body Type" value={formData.bodyType} options={['Slim', 'Average', 'Athletic', 'Heavy']} onChange={v => updateField('bodyType', v)} /><ChipSelect label="Complexion" value={formData.complexion} options={['Fair', 'Wheatish', 'Dark']} onChange={v => updateField('complexion', v)} /><ChipSelect label="Marital Status" value={formData.maritalStatus} options={['Never Married', 'Divorced', 'Widowed']} onChange={v => updateField('maritalStatus', v)} /></EditSection>
      <EditSection title="Location" icon="location-outline" expanded={expandedSection === 'location'} onToggle={() => toggleSection('location')}><TextField label="City" value={formData.place} onChange={v => updateField('place', v)} /><TextField label="State" value={formData.state || ''} onChange={v => updateField('state', v)} /><TextField label="Country" value={formData.country || ''} onChange={v => updateField('country', v)} /></EditSection>
      <EditSection title="Religious Background" icon="heart-outline" expanded={expandedSection === 'religious'} onToggle={() => toggleSection('religious')}><ChipSelect label="Religion" value={formData.religion} options={['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other']} onChange={v => updateField('religion', v)} /><TextField label="Caste" value={formData.caste || ''} onChange={v => updateField('caste', v)} /><TextField label="Mother Tongue" value={formData.motherTongue || ''} onChange={v => updateField('motherTongue', v)} /></EditSection>
      <EditSection title="Education & Career" icon="briefcase-outline" expanded={expandedSection === 'career'} onToggle={() => toggleSection('career')}><TextField label="Highest Education" value={formData.education} onChange={v => updateField('education', v)} /><TextField label="Profession" value={formData.profession} onChange={v => updateField('profession', v)} /><TextField label="Company" value={formData.company || ''} onChange={v => updateField('company', v)} /><SliderField label="Annual Income" value={formData.salary || 5} min={1} max={100} onChange={v => updateField('salary', v)} format={formatSalary} /></EditSection>
      <EditSection title="Family Details" icon="people-outline" expanded={expandedSection === 'family'} onToggle={() => toggleSection('family')}><ChipSelect label="Family Type" value={formData.familyType} options={['Joint', 'Nuclear']} onChange={v => updateField('familyType', v)} /><ChipSelect label="Family Status" value={formData.familyStatus} options={['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent']} onChange={v => updateField('familyStatus', v)} /></EditSection>
      <EditSection title="Lifestyle" icon="leaf-outline" expanded={expandedSection === 'lifestyle'} onToggle={() => toggleSection('lifestyle')}><ChipSelect label="Diet" value={formData.diet} options={['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan']} onChange={v => updateField('diet', v)} /><ChipSelect label="Smoking" value={formData.smoking} options={['No', 'Occasionally', 'Yes']} onChange={v => updateField('smoking', v)} /><ChipSelect label="Drinking" value={formData.drinking} options={['No', 'Occasionally', 'Yes']} onChange={v => updateField('drinking', v)} /></EditSection>
      <EditSection title="About Me" icon="document-text-outline" expanded={expandedSection === 'about'} onToggle={() => toggleSection('about')}><TextAreaField label="Tell us about yourself" value={formData.about} onChange={v => updateField('about', v)} placeholder="Your interests, hobbies..." /></EditSection>
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: { alignItems: 'center', paddingVertical: SPACING.xl, backgroundColor: COLORS.surface, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  photo: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: COLORS.primary },
  name: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text.primary, marginTop: SPACING.md },
  subtitle: { fontSize: FONT_SIZE.sm, color: COLORS.text.tertiary, marginTop: 2 },
  completenessContainer: { alignItems: 'center', marginTop: SPACING.lg },
  completenessLabel: { fontSize: FONT_SIZE.xs, color: COLORS.text.tertiary, marginTop: SPACING.xs },
  editButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg, marginTop: SPACING.md, gap: SPACING.xs },
  editButtonText: { color: '#fff', fontWeight: '600', fontSize: FONT_SIZE.sm },
  mediaSection: { backgroundColor: COLORS.surface, marginTop: SPACING.md, padding: SPACING.md },
  mediaSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  mediaSectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text.primary },
  mediaItem: { width: 80, height: 80, borderRadius: BORDER_RADIUS.sm, marginRight: SPACING.sm, overflow: 'hidden' },
  mediaThumbnail: { width: '100%', height: '100%' },
  videoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  addMediaButton: { width: 80, height: 80, borderRadius: BORDER_RADIUS.sm, borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  addMediaText: { fontSize: FONT_SIZE.xs, color: COLORS.primary, marginTop: 2 },
  viewSection: { backgroundColor: COLORS.surface, marginTop: SPACING.md, padding: SPACING.md },
  viewSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm, paddingBottom: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border.light },
  viewSectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text.primary },
  viewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm },
  viewRowLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text.tertiary },
  viewRowValue: { fontSize: FONT_SIZE.sm, fontWeight: '500', color: COLORS.text.primary },
  aboutText: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary, lineHeight: 22 },
  bottomPadding: { height: 40 },
  editHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, backgroundColor: COLORS.surface },
  backButton: { padding: SPACING.xs },
  editTitle: { fontSize: FONT_SIZE.lg, fontWeight: '600', color: COLORS.text.primary },
  saveBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  saveBtnText: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.primary },
  photoEditSection: { alignItems: 'center', paddingVertical: SPACING.lg, backgroundColor: COLORS.surface },
  photoEdit: { width: 100, height: 100, borderRadius: 50 },
  changePhotoBtn: { position: 'absolute', bottom: SPACING.lg, right: '35%', backgroundColor: COLORS.primary, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  editSection: { backgroundColor: COLORS.surface, marginTop: SPACING.md },
  editSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md },
  editSectionLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  editSectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text.primary },
  editSectionContent: { padding: SPACING.md, paddingTop: 0 },
  fieldContainer: { marginBottom: SPACING.md },
  fieldLabel: { fontSize: FONT_SIZE.sm, fontWeight: '500', color: COLORS.text.secondary, marginBottom: SPACING.xs },
  textInput: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md, fontSize: FONT_SIZE.sm, color: COLORS.text.primary, borderWidth: 1, borderColor: COLORS.border.light },
  textArea: { height: 100, textAlignVertical: 'top' },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sliderValue: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.primary },
  slider: { width: '100%', height: 40 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  chip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.lg, backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border.default },
  chipSelected: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  chipText: { fontSize: FONT_SIZE.xs, color: COLORS.text.secondary },
  chipTextSelected: { color: COLORS.primary, fontWeight: '600' },
});
