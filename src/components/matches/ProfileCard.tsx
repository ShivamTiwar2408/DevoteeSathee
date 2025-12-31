import React, { useState, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Match } from '../../types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZE, SHADOWS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height - 180;

interface ProfileCardProps {
  match: Match;
  onConnect: (message?: string) => void;
  onChat: () => void;
  isConnecting: boolean;
  showVideo: boolean;
  onToggleMedia: () => void;
}

const DEFAULT_MSG = "Hi! I found your profile interesting and would love to connect with you.";

export function ProfileCard({ match, onConnect, onChat, isConnecting, showVideo, onToggleMedia }: ProfileCardProps) {
  const videoRef = useRef<Video>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [msg, setMsg] = useState('');

  const onStatus = (status: AVPlaybackStatus) => { if (status.isLoaded) { setIsVideoLoading(false); setIsPlaying(status.isPlaying); } };
  const toggleMute = async () => { if (videoRef.current) { await videoRef.current.setIsMutedAsync(!isMuted); setIsMuted(!isMuted); } };
  const togglePlay = async () => { if (videoRef.current) { isPlaying ? await videoRef.current.pauseAsync() : await videoRef.current.playAsync(); } };
  const openConnect = () => { setShowModal(true); setMsg(''); };
  const sendConnect = () => { onConnect(msg.trim() || DEFAULT_MSG); setShowModal(false); };
  const skipConnect = () => { onConnect(DEFAULT_MSG); setShowModal(false); };

  return (
    <View style={styles.container}>
      {/* Centered Floating Connect Button with Gradient */}
      <TouchableOpacity style={styles.floatingBtn} onPress={openConnect} activeOpacity={0.85} disabled={isConnecting}>
        <LinearGradient colors={['#00D4AA', '#00B4D8', '#0096C7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientBtn}>
          {isConnecting ? <ActivityIndicator size="small" color="#fff" /> : (
            <><Ionicons name="heart" size={20} color="#fff" /><Text style={styles.floatingBtnText}>Connect</Text></>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Connect Modal */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Connect with {match.name}</Text><TouchableOpacity onPress={() => setShowModal(false)}><Ionicons name="close" size={24} color={COLORS.text.tertiary} /></TouchableOpacity></View>
            <TextInput style={styles.msgInput} placeholder="Write a message (optional)" placeholderTextColor={COLORS.text.light} value={msg} onChangeText={setMsg} multiline numberOfLines={3} textAlignVertical="top" />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.skipBtn} onPress={skipConnect}><Text style={styles.skipText}>Skip</Text></TouchableOpacity>
              <TouchableOpacity onPress={sendConnect}><LinearGradient colors={['#00D4AA', '#00B4D8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.sendBtn}><Ionicons name="send" size={16} color="#fff" /><Text style={styles.sendText}>Send</Text></LinearGradient></TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.media}>
          {match.introVideo && showVideo ? (
            <>
              <Video ref={videoRef} source={{ uri: match.introVideo }} style={styles.video} resizeMode={ResizeMode.COVER} shouldPlay isLooping isMuted={isMuted} onPlaybackStatusUpdate={onStatus} />
              {isVideoLoading && <View style={styles.videoLoading}><Image source={{ uri: match.photo }} style={styles.photo} /><View style={styles.loadingOverlay}><ActivityIndicator size="large" color="#fff" /></View></View>}
              <View style={styles.videoControls}>
                <TouchableOpacity style={styles.ctrlBtn} onPress={togglePlay}><Ionicons name={isPlaying ? "pause" : "play"} size={18} color="#fff" /></TouchableOpacity>
                <TouchableOpacity style={styles.ctrlBtn} onPress={toggleMute}><Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={18} color="#fff" /></TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.mediaBadge} onPress={onToggleMedia}><Ionicons name="image" size={12} color="#fff" /><Text style={styles.badgeText}>Photo</Text></TouchableOpacity>
            </>
          ) : (
            <>
              <Image source={{ uri: match.photo }} style={styles.photo} />
              {match.introVideo && <TouchableOpacity style={styles.mediaBadge} onPress={onToggleMedia}><Ionicons name="videocam" size={12} color="#fff" /><Text style={styles.badgeText}>Video</Text></TouchableOpacity>}
            </>
          )}
          <View style={styles.overlay}><Text style={styles.name}>{match.name}, {match.age}</Text><View style={styles.loc}><Ionicons name="location" size={14} color="#fff" /><Text style={styles.locText}>{match.place}</Text></View></View>
        </View>

        <View style={styles.details}>
          <View style={styles.grid}>
            <Tile icon="resize-outline" label="Height" value={match.height ? `${match.height}` : '-'} />
            <Tile icon="briefcase-outline" label="Status" value={match.workingStatus || '-'} />
            <Tile icon="cash-outline" label="Salary" value={match.salary ? `₹${match.salary}L` : '-'} />
            <Tile icon="people-outline" label="Caste" value={match.caste || '-'} />
          </View>
          <View style={styles.section}><Text style={styles.secTitle}>About</Text><Text style={styles.about} numberOfLines={4}>{match.about}</Text></View>
          <View style={styles.section}>
            <Text style={styles.secTitle}>Details</Text>
            <Row icon="school-outline" label="Education" value={match.education} />
            <Row icon="briefcase-outline" label="Profession" value={match.profession} />
            <Row icon="language-outline" label="Mother Tongue" value={match.motherTongue || '-'} />
            <Row icon="heart-outline" label="Religion" value={match.religion || '-'} />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Chat Button */}
      <TouchableOpacity style={styles.chatBtn} onPress={onChat}><Ionicons name="chatbubble-ellipses" size={22} color={COLORS.primary} /></TouchableOpacity>
    </View>
  );
}

function Tile({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return <View style={styles.tile}><Ionicons name={icon} size={16} color={COLORS.primary} /><Text style={styles.tileLabel}>{label}</Text><Text style={styles.tileValue} numberOfLines={1}>{value}</Text></View>;
}

function Row({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return <View style={styles.row}><View style={styles.rowLeft}><Ionicons name={icon} size={16} color={COLORS.text.tertiary} /><Text style={styles.rowLabel}>{label}</Text></View><Text style={styles.rowValue} numberOfLines={1}>{value}</Text></View>;
}


const styles = StyleSheet.create({
  container: { width: width - 16, height: CARD_HEIGHT, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, ...SHADOWS.md, overflow: 'hidden' },
  floatingBtn: { position: 'absolute', bottom: 80, alignSelf: 'center', zIndex: 100, ...SHADOWS.lg },
  gradientBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 30, gap: 10 },
  floatingBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  modalContent: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, width: '100%', maxWidth: 340 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  modalTitle: { fontSize: FONT_SIZE.lg, fontWeight: '600', color: COLORS.text.primary },
  msgInput: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.sm, padding: SPACING.md, fontSize: FONT_SIZE.sm, color: COLORS.text.primary, borderWidth: 1, borderColor: COLORS.border.light, minHeight: 80, textAlignVertical: 'top' },
  modalBtns: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  skipBtn: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.sm, borderWidth: 1, borderColor: COLORS.border.default, alignItems: 'center' },
  skipText: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary, fontWeight: '500' },
  sendBtn: { flex: 1, flexDirection: 'row', paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center', gap: 6 },
  sendText: { fontSize: FONT_SIZE.sm, color: '#fff', fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  media: { width: '100%', height: width - 16, position: 'relative', backgroundColor: '#000' },
  video: { width: '100%', height: '100%' },
  photo: { width: '100%', height: '100%' },
  videoLoading: { ...StyleSheet.absoluteFillObject },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  videoControls: { position: 'absolute', top: SPACING.md, right: SPACING.md, flexDirection: 'row', gap: SPACING.sm },
  ctrlBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  mediaBadge: { position: 'absolute', top: SPACING.md, left: SPACING.md, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm, gap: 4 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.md, paddingTop: 40, backgroundColor: 'rgba(0,0,0,0.4)' },
  name: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: '#fff' },
  loc: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locText: { fontSize: FONT_SIZE.sm, color: '#fff', opacity: 0.9 },
  details: { padding: SPACING.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md },
  tile: { width: '48%', backgroundColor: COLORS.background, padding: SPACING.sm, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', gap: 2 },
  tileLabel: { fontSize: 10, color: COLORS.text.tertiary },
  tileValue: { fontSize: FONT_SIZE.xs, fontWeight: '600', color: COLORS.text.primary },
  section: { marginBottom: SPACING.md },
  secTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text.primary, marginBottom: SPACING.sm },
  about: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary, lineHeight: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border.light },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  rowLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text.tertiary },
  rowValue: { fontSize: FONT_SIZE.sm, fontWeight: '500', color: COLORS.text.primary, maxWidth: '50%', textAlign: 'right' },
  chatBtn: { position: 'absolute', bottom: SPACING.lg, right: SPACING.lg, width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary, ...SHADOWS.md },
});
