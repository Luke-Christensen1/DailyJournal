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
import { Heart, MessageCircle, Users, Lock, MoreHorizontal } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

// ── Sample data for the Scrapbook vision ─────────────────────────────────
const SAMPLE_FRIENDS = [
  {
    id: '1',
    name: 'sarah m.',
    initials: 'sm',
    color: '#D4845A',
    highlight: "Had a spontaneous picnic with the kids after school — the laughter was everything.",
    highlight2: "Finally finished that book I've been reading for 3 months.",
    timeAgo: '2h ago',
    reactions: 4,
    hasPhoto: true,
    photoBg: '#E2DFD5',
  },
  {
    id: '2',
    name: 'dad',
    initials: 'rk',
    color: '#7A9E7E',
    highlight: "Took a long walk around the neighborhood this evening. Still noticing things I've never seen.",
    timeAgo: '5h ago',
    reactions: 7,
    hasPhoto: false,
    photoBg: '',
  },
  {
    id: '3',
    name: 'mike t.',
    initials: 'mt',
    color: '#B08050',
    highlight: "Watched the sunrise from the back porch with coffee. Needed that.",
    highlight2: "Our team shipped the product — months of work finally live.",
    timeAgo: '8h ago',
    reactions: 12,
    hasPhoto: true,
    photoBg: '#D1CDC0',
  },
];

function FriendCard({ friend, index }: { friend: typeof SAMPLE_FRIENDS[0], index: number }) {
  return (
    <View style={[
      cardStyles.container,
      index % 2 === 1 ? cardStyles.asymmetric : null
    ]}>
      {/* Editorial Author Row */}
      <View style={cardStyles.authorRow}>
        <View style={[cardStyles.avatar, { backgroundColor: friend.color }]}>
          <Text style={cardStyles.avatarText}>{friend.initials}</Text>
        </View>
        <View style={cardStyles.authorInfo}>
          <Text style={cardStyles.authorName}>{friend.name}</Text>
          <Text style={cardStyles.timeAgo}>{friend.timeAgo}</Text>
        </View>
        <TouchableOpacity>
          <MoreHorizontal size={16} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Photo "Postcard" */}
      {friend.hasPhoto && (
        <View style={[cardStyles.photoFrame, { backgroundColor: friend.photoBg }]}>
          <View style={cardStyles.photoInner}>
             {/* In a real app, Image would go here */}
             <Text style={cardStyles.photoPlaceholderText}>📷 memory captured</Text>
          </View>
        </View>
      )}

      {/* Highlights */}
      <View style={cardStyles.content}>
        <Text style={cardStyles.highlight}>✦ {friend.highlight}</Text>
        {friend.highlight2 && (
          <Text style={cardStyles.highlight2}>✦ {friend.highlight2}</Text>
        )}
      </View>

      {/* Subdued Footer */}
      <View style={cardStyles.footer}>
        <TouchableOpacity style={cardStyles.actionBtn}>
          <Heart size={14} color={Colors.accent} strokeWidth={focused => 2} />
          <Text style={cardStyles.actionText}>{friend.reactions}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={cardStyles.actionBtn}>
          <MessageCircle size={14} color={Colors.textMuted} />
          <Text style={cardStyles.actionTextMuted}>reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  asymmetric: {
    marginLeft: 20,
    marginRight: -10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  authorInfo: { flex: 1 },
  authorName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.text,
    textTransform: 'lowercase',
  },
  timeAgo: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'lowercase',
  },
  photoFrame: {
    aspectRatio: 4 / 3,
    marginBottom: 20,
    padding: 8,
    backgroundColor: Colors.surface,
  },
  photoInner: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textMuted,
  },
  content: {
    marginBottom: 20,
    gap: 12,
  },
  highlight: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 17,
    color: Colors.text,
    lineHeight: 25,
  },
  highlight2: {
    fontFamily: 'Newsreader_400Regular_Italic',
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    gap: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.accent,
  },
  actionTextMuted: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.textMuted,
    textTransform: 'lowercase',
  },
});

export default function CircleScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>your circle.</Text>
          <Text style={styles.subtitle}>Moments from people you love.</Text>
        </View>

        <View style={styles.dateDivider}>
          <Text style={styles.dateLabel}>today</Text>
          <View style={styles.line} />
        </View>

        {SAMPLE_FRIENDS.map((friend, index) => (
          <FriendCard key={friend.id} friend={friend} index={index} />
        ))}

        <View style={styles.inviteBox}>
          <Text style={styles.inviteEmoji}>💭</Text>
          <Text style={styles.inviteTitle}>Widen the stillness.</Text>
          <Text style={styles.inviteBody}>
            Invite your family or close friends to share their daily rhythms.
          </Text>
          <TouchableOpacity style={styles.inviteBtn}>
            <Text style={styles.inviteBtnText}>share invite link</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: 24, paddingTop: 32 },

  header: { marginBottom: 40 },
  title: {
    fontFamily: 'Newsreader_700Bold',
    fontSize: 32,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'Newsreader_400Regular_Italic',
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  dateLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },

  inviteBox: {
    marginTop: 16,
    padding: 32,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inviteEmoji: { fontSize: 32, marginBottom: 16 },
  inviteTitle: {
    fontFamily: 'Newsreader_600SemiBold',
    fontSize: 22,
    color: Colors.text,
    marginBottom: 10,
  },
  inviteBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  inviteBtn: {
    backgroundColor: Colors.text,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 2,
  },
  inviteBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.background,
    textTransform: 'lowercase',
  },
});
