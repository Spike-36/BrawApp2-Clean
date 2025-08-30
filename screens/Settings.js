// screens/Settings.js
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';

const LANG_OPTIONS = [
  { value: 'English',  label: 'English' },
  { value: 'French',   label: 'Français (French)' },
  { value: 'Spanish',  label: 'Español (Spanish)' },
  { value: 'German',   label: 'Deutsch (German)' },
  { value: 'Arabic',   label: 'العربية (Arabic)' },
  { value: 'Japanese', label: '日本語 (Japanese)' },
  { value: 'Korean',   label: '한국어 (Korean)' },
];

export default function Settings({ indexLang, setIndexLang }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.heading}>Settings</Text>
        <Text style={styles.label}>Index Language</Text>

        {LANG_OPTIONS.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => setIndexLang(opt.value)}
            style={[styles.langBtn, indexLang === opt.value && styles.langBtnActive]}
          >
            <Text style={[styles.langTxt, indexLang === opt.value && styles.langTxtActive]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 28, fontWeight: '800', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 12, fontWeight: '600' },
  langBtn: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  langBtnActive: { backgroundColor: '#111', borderColor: '#111' },
  langTxt: { fontSize: 16, color: '#111' },
  langTxtActive: { color: '#fff', fontWeight: '700' },
});
