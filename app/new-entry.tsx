import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { X, Camera, Trash2, Check, ArrowLeft } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { getDailyPrompt, getTodayString } from '../constants/prompts';
import { useStore } from '../lib/store';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NewEntryModal() {
  const router = useRouter();
  const addEntry = useStore((s) => s.addEntry);
  const updateEntry = useStore((s) => s.updateEntry);
  const getEntryByDate = useStore((s) => s.getEntryByDate);

  const today = getTodayString();
  const existingEntry = getEntryByDate(today);
  const prompt = getDailyPrompt();

  const [highlight1, setHighlight1] = useState(existingEntry?.highlight1 ?? '');
  const [highlight2, setHighlight2] = useState(existingEntry?.highlight2 ?? '');
  const [photoUri, setPhotoUri] = useState<string | undefined>(
    existingEntry?.photoUri
  );
  const [isSaving, setIsSaving] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to add a memory photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSave = async () => {
    if (!highlight1.trim()) {
      Alert.alert('One highlight required', 'Write at least one highlight for today.');
      return;
    }
    setIsSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (existingEntry) {
      updateEntry(existingEntry.id, {
        highlight1: highlight1.trim(),
        highlight2: highlight2.trim() || undefined,
        photoUri,
      });
    } else {
      addEntry({
        date: today,
        highlight1: highlight1.trim(),
        highlight2: highlight2.trim() || undefined,
        photoUri,
        prompt,
      });
    }

    setTimeout(() => router.back(), 300);
  };

  const canSave = highlight1.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>new chapter</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave || isSaving}
            style={canSave ? styles.saveActive : styles.saveDisabled}
          >
            <Check size={20} color={canSave ? Colors.accent : Colors.border} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.promptSection}>
            <Text style={styles.promptLabel}>THE DAILY QUESTION</Text>
            <Text style={styles.promptText}>{prompt}</Text>
            <View style={styles.separator} />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Highlight One ✦</Text>
            <TextInput
              style={styles.textInput}
              value={highlight1}
              onChangeText={setHighlight1}
              placeholder="Record a stillness..."
              placeholderTextColor={Colors.textMuted}
              multiline
              autoFocus
            />
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Highlight Two (optional) ✦</Text>
            <TextInput
              style={[styles.textInput, styles.textInputSecondary]}
              value={highlight2}
              onChangeText={setHighlight2}
              placeholder="Another moment..."
              placeholderTextColor={Colors.textMuted}
              multiline
            />
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.inputLabel}>Visual Memory</Text>
            {photoUri ? (
              <View style={styles.photoPreviewWrap}>
                <Image source={{ uri: photoUri }} style={styles.photoPreview} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.photoRemoveBtn}
                  onPress={() => setPhotoUri(undefined)}
                >
                  <X size={16} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.photoPicker} onPress={pickImage} activeOpacity={0.6}>
                <Camera size={24} color={Colors.border} strokeWidth={1.5} />
                <Text style={styles.photoPickerText}>attach a photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
           <TouchableOpacity
            style={[styles.fullSaveBtn, !canSave && styles.fullSaveDisabled]}
            onPress={handleSave}
            disabled={!canSave || isSaving}
          >
            <Text style={styles.fullSaveText}>
              {isSaving ? 'preserving stillness...' : 'save today\'s highlight'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
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
  saveActive: { padding: 4 },
  saveDisabled: { padding: 4, opacity: 0.3 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },

  promptSection: { marginBottom: 48 },
  promptLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.accent,
    letterSpacing: 2,
    marginBottom: 12,
  },
  promptText: {
    fontFamily: 'Newsreader_500Medium',
    fontSize: 24,
    color: Colors.text,
    lineHeight: 32,
    marginBottom: 24,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.borderLight,
  },

  inputSection: { marginBottom: 40 },
  inputLabel: {
    fontFamily: 'Newsreader_400Regular_Italic',
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  textInput: {
    fontFamily: 'Newsreader_400Regular',
    fontSize: 20,
    color: Colors.text,
    lineHeight: 30,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  textInputSecondary: {
    color: Colors.textSecondary,
  },

  photoSection: { marginBottom: 20 },
  photoPicker: {
    height: 120,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  photoPickerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'lowercase',
  },
  photoPreviewWrap: { position: 'relative' },
  photoPreview: {
    width: '100%',
    height: 240,
  },
  photoRemoveBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  fullSaveBtn: {
    backgroundColor: Colors.text,
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 2,
  },
  fullSaveDisabled: {
    backgroundColor: Colors.border,
  },
  fullSaveText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.background,
    textTransform: 'lowercase',
  },
});
