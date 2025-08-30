// hooks/useAutoplayPref.js
import { useEffect, useState, useCallback } from 'react';

let AsyncStorage;
try { AsyncStorage = require('@react-native-async-storage/async-storage').default; } catch { AsyncStorage = null; }

const KEY = 'prefs.autoplay';

export default function useAutoplayPref() {
  const [autoplay, setAutoplay] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (!AsyncStorage) return;
        const raw = await AsyncStorage.getItem(KEY);
        if (raw != null) setAutoplay(raw === 'true');
      } catch {}
    })();
  }, []);

  const save = useCallback(async (val) => {
    setAutoplay(val);
    try { if (AsyncStorage) await AsyncStorage.setItem(KEY, String(val)); } catch {}
  }, []);

  return { autoplay, setAutoplay: save };
}
