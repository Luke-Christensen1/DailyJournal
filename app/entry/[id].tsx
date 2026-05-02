import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Trash2, Calendar, AlertTriangle } from 'lucide-react-native';
import { useState } from 'react';
import { Colors } from '../../constants/colors';
import { formatDate } from '../../constants/prompts';
import { useStore } from '../../lib/store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EntryDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const entries = useStore((s) => s.entries);
  const deleteEntry = useStore((s) => s.deleteEntry);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Chapter not found.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.goBack}>Return to archive</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    deleteEntry(entry.id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Editorial Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>chapter detail</Text>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => setConfirmingDelete(true)}
        >
          <Trash2 size={18} color={confirmingDelete ? Colors.danger : Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Inline Delete Confirmation */}
      {confirmingDelete && (
        <View style={styles.confirmBanner}>
          <Text style={styles.confirmText}>
            Erase this stillness permanently?
          </Text>
          <View style={styles.confirmActions}>
            <TouchableOpacity onPress={handleDelete} style={styles.confirmYes}>
              <Text style={styles.confirmYesText}>erase</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setConfirmingDelete(false)}>
              <Text style={styles.confirmNo}>cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Photo Integration */}
        {entry.photoUri && (
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: entry.photoUri }}
              style={styles.photo}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Date Staggered Header */}
        <View style={styles.metaRow}>
          <View style={styles.verticalLine} />
          <View>
            <Text style={styles.metaLabel}>RECORDED ON</Text>
            <Text style={styles.metaDate}>{formatDate(entry.date)}</Text>
          </View>
        </View>

        {/* Prompt - Editorial Style */}
        <View style={styles.promptBox}>
          <Text style={styles.promptLabel}>QUERY</Text>
          <Text style={styles.promptText}>{entry.prompt}</Text>
        </View>

        {/* Highlights - High Contrast */}
        <View style={styles.contentWrap}>
           <View style={styles.highlightBlock}>
              <Text style={styles.bullet}>✦</Text>
              <Text style={styles.highlightMain}>{entry.highlight1}</Text>
           </View>

           {entry.highlight2 && (
             <View style={styles.highlightBlock}>
                <Text style={styles.bullet}>✦</Text>
                <Text style={styles.highlightSub}>{entry.highlight2}</Text>
             </View>
           )}
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.savedTimestamp}>
             Captured at {new Date(entry.createdAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }).toLowerCase()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.text,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  backBtn: { padding: 4 },
  deleteBtn: { padding: 4 },

  confirmBanner: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  confirmText: {
    fontFamily: 'Newsreader_600SemiBold',
    fontSize: 16,
    color: Colors.danger,
    marginBottom: 12,
  },
  confirmActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  confirmYes: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 2,
  },
  confirmYesText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.white,
    textTransform: 'lowercase',
  },
  confirmNo: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textSecondary,
    textTransform: 'lowercase',
  },

  scrollContent: {
    paddingBottom: 60,
  },

  photoContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  photo: {
    width: '100%',
    height: 340,
    borderRadius: 4,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 40,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  verticalLine: {
    width: 2,
    height: 32,
    backgroundColor: Colors.accent,
  },
  metaLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  metaDate: {
    fontFamily: 'Newsreader_600SemiBold',
    fontSize: 18,
    color: Colors.text,
  },

  promptBox: {
    paddingHorizontal: 24,
    marginBottom: 48,
  },
  promptLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 12,
  },
  promptText: {
    fontFamily: 'Newsreader_400Regular_Italic',
    fontSize: 19,
    color: Colors.textSecondary,
    lineHeight: 28,
  },

  contentWrap: {
    paddingHorizontal: 24,
    gap: 40,
  },
  highlightBlock: {
    flexDirection: 'row',
    gap: 16,
  },
  bullet: {
    fontFamily: 'Newsreader_600SemiBold',
    fontSize: 18,
    color: Colors.accent,
    marginTop: 6,
  },
  highlightMain: {
    flex: 1,
    fontFamily: 'Newsreader_500Medium',
    fontSize: 24,
    color: Colors.text,
    lineHeight: 36,
  },
  highlightSub: {
    flex: 1,
    fontFamily: 'Newsreader_400Regular_Italic',
    fontSize: 22,
    color: Colors.textSecondary,
    lineHeight: 32,
  },

  footerInfo: {
    paddingHorizontal: 24,
    marginTop: 80,
    alignItems: 'center',
  },
  savedTimestamp: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'lowercase',
    letterSpacing: 1,
  },

  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  notFoundText: {
    fontFamily: 'Newsreader_600SemiBold',
    fontSize: 20,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  goBack: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.accent,
    textTransform: 'lowercase',
  },
});
