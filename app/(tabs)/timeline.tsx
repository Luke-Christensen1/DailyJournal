import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { formatDate, formatShortDate } from '../../constants/prompts';
import { useStore } from '../../lib/store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TimelineScreen() {
  const router = useRouter();
  const entries = useStore((s) => s.entries);

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  // Group by year-month
  const grouped: Record<string, typeof entries> = {};
  sorted.forEach((entry) => {
    const key = entry.date.substring(0, 7); // YYYY-MM
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(entry);
  });

  const groupKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  const formatGroupKey = (key: string) => {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Journal</Text>
        <Text style={styles.subtitle}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <BookOpen size={40} color={Colors.textMuted} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>Your journal is waiting</Text>
          <Text style={styles.emptyText}>
            Capture today's highlights to start your timeline.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {groupKeys.map((key) => (
            <View key={key} style={styles.group}>
              <View style={styles.groupHeader}>
                <View style={styles.groupDot} />
                <Text style={styles.groupTitle}>{formatGroupKey(key)}</Text>
              </View>
              {grouped[key].map((entry, idx) => (
                <TouchableOpacity
                  key={entry.id}
                  style={[
                    styles.entryCard,
                    idx === grouped[key].length - 1 && styles.entryCardLast,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/entry/${entry.id}`)}
                >
                  <View style={styles.entryLeft}>
                    <Text style={styles.entryDay}>
                      {new Date(entry.date + 'T12:00:00').getDate()}
                    </Text>
                    <Text style={styles.entryWeekday}>
                      {new Date(entry.date + 'T12:00:00').toLocaleDateString(
                        'en-US',
                        { weekday: 'short' }
                      )}
                    </Text>
                  </View>
                  <View style={styles.entryLine} />
                  <View style={styles.entryBody}>
                    <Text style={styles.entryHighlight} numberOfLines={2}>
                      {entry.highlight1}
                    </Text>
                    {entry.highlight2 && (
                      <Text
                        style={styles.entryHighlight2}
                        numberOfLines={1}
                      >
                        {entry.highlight2}
                      </Text>
                    )}
                  </View>
                  {entry.photoUri && (
                    <Image
                      source={{ uri: entry.photoUri }}
                      style={styles.entryThumb}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },

  scrollContent: { paddingHorizontal: 20, paddingTop: 24 },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 22,
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },

  group: { marginBottom: 32 },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  groupDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  groupTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.accent,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  entryCardLast: { marginBottom: 0 },
  entryLeft: {
    alignItems: 'center',
    width: 36,
  },
  entryDay: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 22,
    color: Colors.text,
  },
  entryWeekday: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  entryLine: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  entryBody: { flex: 1 },
  entryHighlight: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  entryHighlight2: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  entryThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
  },
});
