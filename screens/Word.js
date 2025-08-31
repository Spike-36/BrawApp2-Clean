// screens/Word.js
import React, { useMemo, useRef, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

export default function Word({ words = [], indexLang = 'English', index = 0, setIndex }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    try {
      listRef.current.scrollToIndex({ index, animated: true });
    } catch {}
  }, [index]);

  const getItemLayout = (_, i) => ({ length: width, offset: width * i, index: i });

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const v = viewableItems[0];
    if (v && typeof v.index === 'number') setIndex(v.index);
  }).current;

  const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 60 }), []);

  const renderItem = ({ item }) => {
    const head = item?.scottish ?? '';
    const phon = item?.phonetic ?? '';
    const ipa  = item?.ipa ?? '';
    const gram = item?.grammarType ?? '';

    const isEnglish = indexLang === 'English';
    const enMeaning = item?.meaning ?? '';
    const enContext = item?.context ?? '';
    const enInfo    = item?.English_Info ?? '';

    const langKey        = indexLang || 'English';
    const foreignMeaning = item?.[langKey] ?? '';
    const foreignContext = item?.[`${langKey}_Context`] ?? '';
    const foreignInfo    = item?.[`${langKey}_Info`] ?? '';

    const primary = isEnglish ? enMeaning : foreignMeaning;
    const context = isEnglish ? enContext : foreignContext;
    const info    = isEnglish ? enInfo    : foreignInfo;

    const hasMeta = !!(phon || ipa || gram);

    return (
      <View style={[styles.page, { width }]}>
        {!!head && <Text style={styles.term}>{head}</Text>}

        {hasMeta && (
          <View style={styles.meta}>
            <View style={{ flexDirection: 'row', marginBottom: 4 }}>
              {!!ipa && <Text style={styles.metaLineItalic}>{ipa}</Text>}
              {!!gram && <Text style={[styles.metaLine, { marginLeft: 16 }]}>{gram}</Text>}
            </View>
            {!!phon && <Text style={styles.metaLineItalic}>{phon}</Text>}
          </View>
        )}

        {hasMeta && <View style={styles.divider} />}

        <View style={styles.block}>
          {!!primary && <Text style={styles.meaning}>{primary}</Text>}
          {!!context && <Text style={styles.context}>– {context}</Text>}
        </View>

        {!!info && (
          <View style={styles.info}>
            <Text style={styles.infoTxt}>{info}</Text>
          </View>
        )}
      </View>
    );
  };

  const count = Array.isArray(words) ? words.length : 0;
  const atStart = index <= 0;
  const atEnd = count === 0 || index >= count - 1;

  const goPrev = () => !atStart && setIndex?.((i) => Math.max(0, i - 1));
  const goNext = () => !atEnd   && setIndex?.((i) => Math.min(count - 1, i + 1));

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={words}
        keyExtractor={(it, i) => String(it?.id ?? i)}
        renderItem={renderItem}
        initialScrollIndex={Math.min(index, Math.max(0, count - 1))}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews
        style={{ backgroundColor: '#FFFFFF' }}
        contentContainerStyle={{ backgroundColor: '#FFFFFF' }}
      />

      {/* Chevron overlay */}
      <View style={styles.chevronsRow}>
        <TouchableOpacity
          onPress={goPrev}
          disabled={atStart}
          accessibilityLabel="Previous"
          style={[styles.chevBtn, atStart && styles.chevDisabled]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="chevron-left" size={36} color={atStart ? '#BBBBBB' : '#111111'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goNext}
          disabled={atEnd}
          accessibilityLabel="Next"
          style={[styles.chevBtn, atEnd && styles.chevDisabled]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Feather name="chevron-right" size={36} color={atEnd ? '#BBBBBB' : '#111111'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  page: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },

  term: {
    fontSize: 50,
    color: '#111111',
    textAlign: 'left',
    marginBottom: 16,
    // Always Garamond Bold
    fontFamily: Platform.select({
      ios: 'EB Garamond Bold',
      android: 'EBGaramond-Bold',
    }),
  },

  meta: { alignItems: 'flex-start', marginBottom: 12 },
  metaLine: { fontSize: 16, color: '#666666', textAlign: 'left' },
  metaLineItalic: { fontSize: 16, color: '#666666', fontStyle: 'italic', textAlign: 'left' },

  divider: { height: 2, backgroundColor: '#111111', width: '100%', marginVertical: 12 },

  block: { width: '100%', maxWidth: 720, marginTop: 8 },
  meaning: { fontSize: 20, color: '#222222', fontWeight: '700', textAlign: 'left' },
  context: { marginTop: 12, fontSize: 16, color: '#444444', fontStyle: 'italic', textAlign: 'left' },

  info: { marginTop: 20, paddingRight: 16, alignItems: 'flex-start' },
  infoTxt: { fontSize: 16, lineHeight: 24, color: '#555555', textAlign: 'left', marginTop: 4 },

  chevronsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 72,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chevBtn: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 999,
    padding: 8,
  },
  chevDisabled: { opacity: 0.4 },
});
