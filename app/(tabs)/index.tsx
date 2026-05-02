import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Flame, Sparkles } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { getTodayString, getDailyPrompt, formatDate } from '../../constants/prompts';
import { useStore } from '../../lib/store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const entries = useStore((s) => s.entries);
  const getStreak = useStore((s) => s.getStreak);
  
  const todayStr = getTodayString();
  const todayEntry = entries.find((e) => e.date === todayStr);
  const prompt = getDailyPrompt();
  const streak = getStreak();
  
  const recentEntries = entries
    .filter((e) => e.date !== todayStr)
    .slice(0, 3);

  const today = new Date();
  const formattedDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Editorial Header */}
        <View style={styles.header}>
          <Text style={styles.dateLabel}>{formattedDayName}, {formattedDate}</Text>
          <Text style={styles.greeting}>Good morning.</Text>
        </View>

        {/* Hero Prompt Section */}
        <View style={styles.heroContainer}>
          <View style={styles.editorialLine} />
          <Text style={styles.heroLabel}>THE DAILY REFLECTION</Text>
          <Text style={styles.heroPrompt}>{prompt}</Text>
          
          {todayEntry ? (
            <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => router.push(`/entry/${todayEntry.id}`)}
              style={styles.todayPreview}
            >
              {todayEntry.photoUri && (
                <Image 
                  source={{ uri: todayEntry.photoUri }} 
                  style={styles.todayPhoto} 
                  resizeMode="cover"
                />
              )}
              <Text style={styles.todayText}>✦ {todayEntry.highlight1}</Text>
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>view recorded highlight</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              activeOpacity={0.8} 
              onPress={() => router.push('/new-entry')}
              style={styles.captureBtn}
            >
              <Plus size={20} color={Colors.white} />
              <Text style={styles.captureBtnText}>Capture stillness</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Row — Subtle */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>day streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{entries.length}</Text>
            <Text style={styles.statLabel}>total entries</Text>
          </View>
        </View>

        {/* Recent Rhythm Section */}
        {recentEntries.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>recent chapters</Text>
            {recentEntries.map((entry, index) => (
              <TouchableOpacity 
                key={entry.id}
                onPress={() => router.push(`/entry/${entry.id}`)}
                style={[
                  styles.recentItem,
                  index % 2 === 1 ? styles.asymmetricItem : null
                ]}
              >
                <View style={styles.recentItemHeader}>
                  <Text style={styles.recentDate}>{formatDate(entry.date)}</Text>
                </View>
                <Text style={styles.recentHighlight} numberOfLines={2}>
                  {entry.highlight1}
                </Text>
                {entry.photoUri && (
                  <Image 
                    source={{ uri: entry.photoUri }} 
                    style={styles.miniPhoto} 
                    resizeMode="cover"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: 24, paddingTop: 32 },

  header: { marginBottom: 48 },
  dateLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  greeting: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 42,
    color: Colors.text,
  },

  heroContainer: {
    marginBottom: 48,
    paddingRight: 12,
  },
  editorialLine: {
    width: 40,
    height: 1,
    backgroundColor: Colors.text,
    marginBottom: 16,
  },
  heroLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 3,
    marginBottom: 12,
  },
  heroPrompt: {
    fontFamily: 'Newsreader_500Medium',
    fontSize: 26,
    color: Colors.text,
    lineHeight: 34,
    marginBottom: 28,
  },

  captureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.text,
    paddingVertical: 18,
    paddingHorizontal: 28,
    alignSelf: 'flex-start',
    borderRadius: 2, // Sharp editorial feel
  },
  captureBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.background,
    marginLeft: 12,
  },

  todayPreview: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  todayPhoto: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  todayText: {
    fontFamily: 'Newsreader_400Regular_Italic',
    fontSize: 18,
    color: Colors.text,
    lineHeight: 26,
  },
  editBadge: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  editBadgeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.accent,
    textTransform: 'lowercase',
    letterSpacing: 1,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 64,
  },
  statItem: { flex: 1 },
  statNumber: {
    fontFamily: 'Newsreader_600SemiBold',
    fontSize: 28,
    color: Colors.text,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'lowercase',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
    marginHorizontal: 20,
  },

  recentSection: { marginBottom: 32 },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'lowercase',
    letterSpacing: 2,
    marginBottom: 24,
  },
  recentItem: {
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 24,
  },
  asymmetricItem: {
    marginLeft: 40, // Asymmetrical shift
  },
  recentItemHeader: {
    marginBottom: 8,
  },
  recentDate: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  recentHighlight: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 19,
    color: Colors.text,
    lineHeight: 28,
  },
  miniPhoto: {
    width: 60,
    height: 60,
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: 2,
  },
});
