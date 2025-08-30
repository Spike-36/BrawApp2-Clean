import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';

export default function List({ words, indexLang, onPick }) {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={words}
        keyExtractor={(_, i) => String(i)}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item, index }) => (
          <Pressable onPress={() => onPick(index)} style={styles.row}>
            {/* Scottish word on the left */}
            <Text style={styles.term}>{item.scottish ?? ''}</Text>

            {/* Meaning (index language) on the right */}
            <Text style={styles.tr}>
              {item?.[indexLang] ?? item.meaning ?? ''}
            </Text>
          </Pressable>
        )}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  sep: { height: 1, backgroundColor: '#eee' },
  term: { fontSize: 16, fontWeight: '600', flex: 1 },
  tr: { fontSize: 14, color: '#666', marginLeft: 12, flex: 1, textAlign: 'right' },
});
