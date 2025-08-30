// components/AudioProbe.js
// Simple test harness for useAudio

import React from 'react';
import { Button, View } from 'react-native';
import useAudio from '../hooks/useAudio';

export default function AudioProbe() {
  const { playScottishById, playContextById, stop, isPlaying } = useAudio();

  return (
    <View style={{ gap: 12, padding: 20 }}>
      <Button title="Probe Scottish (Z003)" onPress={() => playScottishById('Z003')} />
      <Button title="Probe Context (Z003)" onPress={() => playContextById('Z003')} />
      <Button title={isPlaying ? 'Stop (playing)' : 'Stop (idle)'} onPress={stop} />
    </View>
  );
}
