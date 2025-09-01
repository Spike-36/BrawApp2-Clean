// screens/Home.js
import React, { useRef } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';
import { isRTL as rtlCheck, t } from '../i18n';

const BLUE = '#016FCC';
const CARD_WIDTH = '86%';
const HERO_TOP_SPACING = 150;
const BUTTON_WIDTH = '72%';
const BUTTON_RADIUS = 28;
const OVERLAY_ALPHA = 0.75; // adjust opacity here (0..1)

// 🔊 TEMP probe asset (bundled). Use any existing short mp3 in your repo.
const PROBE_ASSET = require('../assets/audio/Z003.mp3');

export default function Home({ onStart, hasProgress, indexLang = 'English' }) {
  const isRTL = rtlCheck(indexLang);

  // ---- TEMP audio probe (isolated) ----
  const soundRef = useRef(null);
  const categorySetRef = useRef(false);

  const stopProbe = () => {
    const s = soundRef.current;
    if (s) {
      try {
        s.stop(() => {
          try { s.release(); } catch {}
        });
      } catch {}
    }
    soundRef.current = null;
  };

  const playProbe = () => {
    // iOS: play through mute switch; Android ignores (fine).
    if (!categorySetRef.current) {
      try { Sound.setCategory('Playback', true); } catch {}
      categorySetRef.current = true;
    }

    // ensure one-at-a-time
    stopProbe();

    // IMPORTANT: pass Metro asset ID (number) from require(...)
    const s = new Sound(PROBE_ASSET, (err) => {
      if (err) {
        console.warn('Audio probe load error:', err);
        return;
      }
      soundRef.current = s;
      s.play((success) => {
        try { s.release(); } catch {}
        if (soundRef.current === s) soundRef.current = null;
        if (!success) console.warn('Audio probe playback failed (stopped?)');
      });
    });
  };
  // ---- /TEMP audio probe ----

  return (
    <ImageBackground
      source={require('../assets/images/brawHome.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      {/* only respect bottom inset, not top */}
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        {/* HERO PANEL */}
        <View style={styles.heroWrap}>
          <View style={styles.heroCard}>
            <Image
              source={require('../assets/images/brawHeading.png')}
              accessibilityLabel="Braw"
              style={styles.logo}
            />
            <Text style={[styles.heroSubtitle, isRTL && { writingDirection: 'rtl', textAlign: 'center' }]}>
              {t('scotspeak', indexLang)}
            </Text>
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

          {/* 🔊 TEMP: Probe button (plays Z003) */}
          <Pressable
            style={[styles.btn, styles.btnProbe]}
            onPress={playProbe}
            accessibilityLabel="Probe audio playback"
          >
            <Text style={styles.btnProbeText}>▶ Probe (Z003)</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1, backgroundColor: 'transparent' },

  // 🔵 Blue transparency overlay (#0065bd with adjustable alpha)
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `rgba(0, 101, 189, ${OVERLAY_ALPHA})`,
  },

  heroWrap: {
    alignItems: 'center',
    marginTop: HERO_TOP_SPACING,
  },

  // Transparent container: no white box/shadow
  heroCard: {
    width: CARD_WIDTH,
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'center',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  // Bigger logo (keep ~2.5:1 ratio → 300x120)
  logo: {
    width: 300,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 6,
  },

  // Standard app text in #ffbd59
  heroSubtitle: {
    color: '#ffbd59',
    marginTop: 8,
    fontSize: 30,
    letterSpacing: 1,
    fontWeight: '600',
    textAlign: 'center',
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
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },

  btnText: {
    color: '#EAF2FF',
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: '700',
  },

  // TEMP probe button styling
  btnProbe: {
    marginTop: 16,
    backgroundColor: '#444',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  btnProbeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
