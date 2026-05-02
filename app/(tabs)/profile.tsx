import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, BookOpen, Calendar, Trash2, X } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { useStore } from '../../lib/store';
import { SafeAreaView } from 'react-native-safe-area-context';

function DeleteConfirmModal({
  visible,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const [input, setInput] = useState('');
  const confirmed = input.trim().toUpperCase() === 'DELETE';

  const handleConfirm = () => {
    if (!confirmed) return;
    setInput('');
    onConfirm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <View style={modal.header}>
            <View style={modal.warningIcon}>
              <Trash2 size={22} color={Colors.danger} />
            </View>
            <TouchableOpacity style={modal.closeBtn} onPress={() => { setInput(''); onCancel(); }}>
              <X size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={modal.title}>Delete all entries?</Text>
          <Text style={modal.body}>
            This will permanently erase every journal entry you've written.
            {'\n\n'}Your memories cannot be recovered after this action.
          </Text>

          <Text style={modal.inputLabel}>
            Type <Text style={modal.inputLabelBold}>DELETE</Text> to confirm
          </Text>
          <TextInput
            style={[modal.input, confirmed && modal.inputConfirmed]}
            value={input}
            onChangeText={setInput}
            placeholder="Type DELETE here"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <View style={modal.actions}>
            <TouchableOpacity
              style={modal.cancelBtn}
              onPress={() => { setInput(''); onCancel(); }}
            >
              <Text style={modal.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modal.deleteBtn, !confirmed && modal.deleteBtnDisabled]}
              onPress={handleConfirm}
              disabled={!confirmed}
            >
              <Text style={[modal.deleteText, !confirmed && modal.deleteTextDisabled]}>
                Delete Everything
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  warningIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dangerDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(224,112,112,0.3)',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: Colors.text,
    marginBottom: 10,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 10,
  },
  inputLabelBold: {
    fontFamily: 'Inter_700Bold',
    color: Colors.danger,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    letterSpacing: 2,
  },
  inputConfirmed: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerDim,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.textSecondary,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: Colors.danger,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteBtnDisabled: {
    backgroundColor: Colors.dangerDim,
    borderWidth: 1,
    borderColor: 'rgba(224,112,112,0.2)',
  },
  deleteText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.white,
  },
  deleteTextDisabled: { color: Colors.danger, opacity: 0.4 },
});

// ── Main Screen ──────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const entries = useStore((s) => s.entries);
  const getStreak = useStore((s) => s.getStreak);
  const deleteEntry = useStore((s) => s.deleteEntry);

  const streak = getStreak();
  const totalEntries = entries.length;
  const thisYear = new Date().getFullYear();
  const entriesThisYear = entries.filter((e) =>
    e.date.startsWith(String(thisYear))
  ).length;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleConfirmDeleteAll = () => {
    entries.forEach((e) => deleteEntry(e.id));
    setShowDeleteModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar */}
        <View style={styles.profileSection}>
          <LinearGradient
            colors={[Colors.accent, '#B8521E']}
            style={styles.avatar}
          >
            <Text style={styles.avatarEmoji}>📓</Text>
          </LinearGradient>
          <Text style={styles.profileName}>My Journal</Text>
          <Text style={styles.profileSub}>Personal highlights archive</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Flame size={22} color={Colors.accent} />
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={[styles.statCard, styles.statCardMid]}>
            <BookOpen size={22} color={Colors.gold} />
            <Text style={styles.statNumber}>{totalEntries}</Text>
            <Text style={styles.statLabel}>Total Entries</Text>
          </View>
          <View style={styles.statCard}>
            <Calendar size={22} color={Colors.success} />
            <Text style={styles.statNumber}>{entriesThisYear}</Text>
            <Text style={styles.statLabel}>This Year</Text>
          </View>
        </View>

        {/* Coming Soon */}
        <Text style={styles.sectionTitle}>Coming Soon</Text>
        {[
          { emoji: '📚', title: 'Compile a Book', desc: 'Turn your highlights into a printed keepsake' },
          { emoji: '👨‍👩‍👧', title: 'Family Circle', desc: 'Share highlights with your closest people' },
          { emoji: '🎁', title: 'Year in Review', desc: 'Auto-generated highlight reel of your year' },
          { emoji: '🔔', title: 'Daily Reminders', desc: 'Custom notifications to keep your streak going' },
        ].map((item) => (
          <View key={item.title} style={styles.featureCard}>
            <Text style={styles.featureEmoji}>{item.emoji}</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDesc}>{item.desc}</Text>
            </View>
            <View style={styles.soonBadge}>
              <Text style={styles.soonBadgeText}>Soon</Text>
            </View>
          </View>
        ))}

        {/* Danger Zone */}
        {totalEntries > 0 && (
          <View style={styles.dangerZone}>
            <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
            <TouchableOpacity
              style={styles.dangerBtn}
              activeOpacity={0.8}
              onPress={() => setShowDeleteModal(true)}
            >
              <Trash2 size={16} color={Colors.danger} />
              <Text style={styles.dangerText}>Clear all journal entries</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.versionText}>Dayloom v1.0 · Beta</Text>
        <View style={{ height: 40 }} />
      </ScrollView>

      <DeleteConfirmModal
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDeleteAll}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24 },

  profileSection: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  avatarEmoji: { fontSize: 36 },
  profileName: {
    fontFamily: 'PlayfairDisplay_700Bold', fontSize: 24, color: Colors.text, marginBottom: 4,
  },
  profileSub: {
    fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textMuted,
  },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  statCard: {
    flex: 1, backgroundColor: Colors.card, borderRadius: 16, padding: 16,
    alignItems: 'center', gap: 6, borderWidth: 1, borderColor: Colors.border,
  },
  statCardMid: {
    borderColor: 'rgba(232,197,96,0.25)', backgroundColor: Colors.goldDim,
  },
  statNumber: {
    fontFamily: 'PlayfairDisplay_700Bold', fontSize: 28, color: Colors.text,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted,
    textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5,
  },

  sectionTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: 18, color: Colors.text, marginBottom: 14,
  },
  featureCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: 14, padding: 16, marginBottom: 10, gap: 14,
    borderWidth: 1, borderColor: Colors.border,
  },
  featureEmoji: { fontSize: 26 },
  featureText: { flex: 1 },
  featureTitle: {
    fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.text, marginBottom: 2,
  },
  featureDesc: {
    fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, lineHeight: 17,
  },
  soonBadge: {
    backgroundColor: Colors.accentDim, borderRadius: 8, paddingHorizontal: 10,
    paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(232,135,74,0.25)',
  },
  soonBadgeText: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.accent,
  },

  dangerZone: {
    marginTop: 32, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(224,112,112,0.2)',
    borderRadius: 16, padding: 16,
  },
  dangerZoneTitle: {
    fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.danger,
    textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12,
  },
  dangerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 12, paddingHorizontal: 4,
  },
  dangerText: {
    fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.danger,
  },

  versionText: {
    fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted,
    textAlign: 'center', marginBottom: 8,
  },
});
