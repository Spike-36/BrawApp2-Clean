// hooks/useAudio.js
// Tiny, robust player using react-native-sound and Metro asset IDs.
// Works with audioMap entries like:
//   Z003: { audioScottish: require('../assets/audio/scottish/Z003.dreich.scottish.mp3'), ... }

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import Sound from 'react-native-sound';

// iOS: allow sound when mute switch is on; Android ignores the 2nd arg
try {
  Sound.setCategory('Playback', true);
} catch (e) {
  console.warn('[useAudio] setCategory failed:', e?.message || e);
}

// Optional audioMap (so app still runs before file exists)
let audioMap = null;
try {
  const mod = require('../components/audioMap');
  audioMap = mod.audioMap || mod.default || null;
} catch (e) {
  console.warn('[useAudio] audioMap not found yet (ok for now).');
}

function resolveFromMap(id, key) {
  if (!audioMap) { console.warn('[useAudio] audioMap missing'); return null; }
  const entry = audioMap[id];
  if (!entry) { console.warn(`[useAudio] no entry for id ${id}`); return null; }
  const assetId = entry[key];
  // Metro returns a number for require('...mp3'); that’s what Sound expects.
  if (typeof assetId !== 'number') {
    console.warn(`[useAudio] ${id}.${key} is not a Metro asset id (number). Got:`, typeof assetId);
    return null;
  }
  return assetId;
}

export default function useAudio() {
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Ensure previous sound is released
  const releaseCurrent = useCallback(() => {
    if (soundRef.current) {
      try {
        soundRef.current.stop(() => {
          soundRef.current.release();
          soundRef.current = null;
        });
      } catch {
        try { soundRef.current.release(); } catch {}
      }
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => () => releaseCurrent(), [releaseCurrent]);

  // Stop playback if app goes to background
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => {
      if (s !== 'active') {
        try { soundRef.current?.stop(() => setIsPlaying(false)); } catch {}
      }
    });
    return () => sub.remove();
  }, []);

  const playFromAssetId = useCallback((assetId) => {
    if (typeof assetId !== 'number') {
      console.warn('[useAudio] playFromAssetId: expected Metro asset id (number), got:', typeof assetId);
      return;
    }

    // Stop any previous sound first
    releaseCurrent();

    console.log('[useAudio] creating Sound from asset id:', assetId);
    const snd = new Sound(assetId, (error) => {
      if (error) {
        console.warn('[useAudio] load error:', error);
        setIsPlaying(false);
        return;
      }
      console.log('[useAudio] loaded. duration(s):', snd.getDuration());
      soundRef.current = snd;
      snd.play((success) => {
        console.log('[useAudio] finished. success=', success);
        setIsPlaying(false);
        try { snd.release(); } catch {}
        if (soundRef.current === snd) soundRef.current = null;
      });
      setIsPlaying(true);
    });
  }, [releaseCurrent]);

  // Promise-based version (optional)
  const playOnce = useCallback((assetId) => {
    return new Promise((resolve) => {
      if (typeof assetId !== 'number') {
        console.warn('[useAudio] playOnce: expected number asset id');
        return resolve(false);
      }
      releaseCurrent();
      const snd = new Sound(assetId, (error) => {
        if (error) {
          console.warn('[useAudio] load error:', error);
          setIsPlaying(false);
          return resolve(false);
        }
        soundRef.current = snd;
        setIsPlaying(true);
        snd.play((success) => {
          setIsPlaying(false);
          try { snd.release(); } catch {}
          if (soundRef.current === snd) soundRef.current = null;
          resolve(Boolean(success));
        });
      });
    });
  }, [releaseCurrent]);

  const playScottishById = useCallback((id) => {
    const assetId = resolveFromMap(id, 'audioScottish');
    if (assetId != null) playFromAssetId(assetId);
  }, [playFromAssetId]);

  const playContextById = useCallback((id) => {
    const assetId = resolveFromMap(id, 'audioScottishContext');
    if (assetId != null) playFromAssetId(assetId);
  }, [playFromAssetId]);

  const stop = useCallback(() => {
    if (!soundRef.current) return;
    try {
      soundRef.current.stop(() => setIsPlaying(false));
    } catch {}
  }, []);

  return { playScottishById, playContextById, playOnce, stop, isPlaying };
}
