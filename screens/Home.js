// screens/Home.js
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { isRTL as rtlCheck, t } from '../i18n';

const BLUE = '#016FCC';
const CARD_WIDTH = '86%';
const HERO_TOP_SPACING = 150;
const BUTTON_WIDTH = '72%';
const BUTTON_RADIUS = 28;
const OVERLAY_ALPHA = 0.25; // adjust this to change filter strength

export default function Home({ onStart, hasProgress, indexLang = 'English' }) {
  const isRTL = rtlCheck(indexLang);

  return (
    <ImageBackground
      source={require('../assets/images/brawHome.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* HERO PANEL */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Braw!</Text>
            <Text style={styles.heroSubtitle}>{t('scotspeak', indexLang)}</Text>
          </View>
        </View>

        {/* BUTTONS */}
        <View style={styles.buttons}>
          {/* Top button — Language */}
          <Pressable
            style={[styles.btn, styles.btnPrimary, styles.btnSpacing]}
            onPress={onStart}
          >
            <Text style={[styles.btnText, isRTL && { writingDirection: 'rtl', textAlign: 'center' }]}>
              {indexLang}
            </Text>
          </Pressable>

          {/* Bottom button — Audio */}
          <Pressable
            style={[styles.btn, styles.btnPrimary]}
            onPress={onStart}
          >
            <Text
              style={[
                styles.btnText,
                { color: '#fff' },
                isRTL && { writingDirection: 'rtl', textAlign: 'center' },
              ]}
            >
              {t('audio', indexLang)}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1, backgroundColor: 'transparent' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `rgba(0,0,0,${OVERLAY_ALPHA})`, // 🔹 adjustable dark filter
  },
  heroWrap: {
    alignItems: 'center',
    marginTop: HERO_TOP_SPACING,
  },
  heroCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  heroTitle: {
    color: BLUE,
    fontSize: 54,
    lineHeight: 56,
    fontFamily: 'Georgia',
  },
  heroSubtitle: {
    color: BLUE,
    marginTop: 12,
    fontSize: 26,
    letterSpacing: 3,
    fontWeight: '600',
  },
  buttons: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: BUTTON_WIDTH,
    paddingVertical: 14,
    borderRadius: BUTTON_RADIUS,
    alignItems: 'center',
  },
  btnSpacing: { marginBottom: 48 },
  btnPrimary: { 
    backgroundColor: 'rgba(0, 51, 102, 0.75)',
    borderWidth: 1,         // 🔹 thin white border
    borderColor: '#FFFFFF', // 🔹 white outline
  },
  btnText: {
    color: '#EAF2FF',
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: '700',
  },
});
