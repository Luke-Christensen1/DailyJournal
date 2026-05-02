import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { formatDate } from '../../constants/prompts';
import { useStore, Entry } from '../../lib/store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JournalScreen() {
  const router = useRouter();
  const entries = useStore((s) => s.entries);

  // Group entries by month/year
  const groupedEntries = entries.reduce((acc, entry) => {
    const date = new Date(entry.date + 'T12:00:00');
    const key = date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    if (!acc[key]) acc[key] = [];
    acc[key].push(entry);
    return acc;
  }, {} as Record<string, Entry[]>);

  const sortedMonthKeys = Object.keys(groupedEntries).sort((a, b) => {
    const dateA = new Date(groupedEntries[a][0].date);
    const dateB = new Date(groupedEntries[b][0].date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>your archive</Text>
        <Text style={styles.headerSub}>A table of contents for your life.</Text>
      </View>

      {entries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>The pages are blank.</Text>
          <Text style={styles.emptyText}>
            Capture your first highlight to begin your story.
          </Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {sortedMonthKeys.map((monthKey) => (
            <View key={monthKey} style={styles.monthSection}>
              <View style={styles.monthHeader}>
                <Text style={styles.monthLabel}>{monthKey}</Text>
                <View style={styles.monthLine} />
              </View>

              {groupedEntries[monthKey]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((entry) => (
                  <TouchableOpacity
                    key={entry.id}
                    activeOpacity={0.7}
                    onPress={() => router.push(`/entry/${entry.id}`)}
                    style={styles.entryRow}
                  >
                    <View style={styles.entryDateCol}>
                      <Text style={styles.entryDay}>
                        {new Date(entry.date + 'T12:00:00').getDate()}
                      </Text>
                      <Text style={styles.entryWeekday}>
                        {new Date(entry.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase()}
                      </Text>
                    </View>

                    <View style={styles.entryMainCol}>
                      <Text style={styles.entryText} numberOfLines={2}>
                        {entry.highlight1}
                      </Text>
                      {entry.photoUri && (
                        <View style={styles.photoIndicator}>
                          <Text style={styles.photoIndicatorText}>— with photo</Text>
                        </View>
                      )}
                    </View>

                    <ChevronRight size={14} color={Colors.border} />
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 8,
  },
  headerSub: {
    fontFamily: 'Newsreader_400Regular_Italic',
    fontSize: 18,
    color: Colors.textSecondary,
  },

  scrollContent: { paddingHorizontal: 24 },

  monthSection: { marginBottom: 48 },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  monthLabel: {
    fontFamily: 'Newsreader_600SemiBold',
    fontSize: 14,
    color: Colors.text,
    textTransform: 'lowercase',
  },
  monthLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },

  entryRow: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    alignItems: 'center',
  },
  entryDateCol: {
    width: 40,
    alignItems: 'flex-start',
  },
  entryDay: {
    fontFamily: 'Newsreader_600SemiBold',
    fontSize: 18,
    color: Colors.text,
  },
  entryWeekday: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'lowercase',
    marginTop: 2,
  },
  entryMainCol: {
    flex: 1,
    paddingRight: 16,
  },
  entryText: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  photoIndicator: {
    marginTop: 4,
  },
  photoIndicatorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontFamily: 'Newsreader_600SemiBold',
    fontSize: 22,
    color: Colors.text,
    marginBottom: 10,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
