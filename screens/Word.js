// screens/Word.js
import React, { useMemo, useRef, useEffect } from 'react';
import { View, Text, FlatList, Dimensions, Pressable, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export default function Word({ words, indexLang, index, setIndex }) {
  const listRef = useRef(null);

  // keep list in sync with external index
  useEffect(() => {
    if (!listRef.current) return;
    try { listRef.current.scrollToIndex({ index, animated: true }); } catch {}
  }, [index]);

  const getItemLayout = (_, i) => ({ length: width, offset: width * i, index: i });

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    const v = viewableItems[0];
    if (v && typeof v.index === 'number') setIndex(v.index);
  }).current;

  const viewabilityConfig = useMemo(() => ({ itemVisiblePercentThreshold: 60 }), []);

  const renderItem = ({ item }) => {
    // core (Scots) head/meta
    const head = item.scottish ?? '';
    const phon = item.phonetic ?? '';
    const ipa  = item.ipa ?? '';
    const gram = item.grammarType ?? '';

    // decide which block to show based on index language
    const isEnglish = indexLang === 'English';

    // English selection
    const enMeaning = item.meaning ?? '';
    const enContext = item.context ?? '';             // base context field
    const enInfo    = item.English_Info ?? '';

    // Foreign selection
    const langKey        = indexLang || 'English';
    const foreignMeaning = item?.[langKey] ?? '';
    const foreignContext = item?.[`${langKey}_Context`] ?? '';
    const foreignInfo    = item?.[`${langKey}_Info`] ?? '';

    // Choose one set
    const showLabel = isEnglish ? 'MEANING' : langKey.toUpperCase();
    const primary   = isEnglish ? enMeaning : foreignMeaning;
    const context   = isEnglish ? enContext : foreignContext;
    const info      = isEnglish ? enInfo    : foreignInfo;

    return (
      <View style={[styles.page, { width }]}>
        {/* Headword */}
        <Text style={styles.term}>{head}</Text>

        {/* Meta */}
        <View style={styles.meta}>
          {!!phon && <Text style={styles.metaLine}>{phon}</Text>}
          {!!ipa  && <Text style={styles.metaLine}>{ipa}</Text>}
          {!!gram && <Text style={styles.metaLine}>{gram}</Text>}
        </View>

        {/* Single block (English OR Foreign) */}
        <View style={styles.block}>
          {!!primary && <Text style={styles.label}>{showLabel}</Text>}
          {!!primary && <Text style={styles.value}>{primary}</Text>}
          {!!context && <Text style={[styles.value, styles.context]}>{context}</Text>}
        </View>

        {/* Prev / Next */}
        <View style={styles.controls}>
          <Pressable
            onPress={() => setIndex((i) => Math.max(0, i - 1))}
            style={[styles.navBtn, index === 0 && styles.navBtnDisabled]}
            disabled={index === 0}
          >
            <Text style={styles.navTxt}>‹ Prev</Text>
          </Pressable>
          <Pressable
            onPress={() => setIndex((i) => Math.min(words.length - 1, i + 1))}
            style={[styles.navBtn, index === words.length - 1 && styles.navBtnDisabled]}
            disabled={index === words.length - 1}
          >
            <Text style={styles.navTxt}>Next ›</Text>
          </Pressable>
        </View>

        {/* Info (only the chosen language) */}
        {!!info && (
          <View style={styles.info}>
            <Text style={styles.infoTxt}>{info}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <FlatList
      ref={listRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      data={words}
      keyExtractor={(it, i) => String(it?.id ?? i)}
      renderItem={renderItem}
      initialScrollIndex={index}
      getItemLayout={getItemLayout}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      removeClippedSubviews
    />
  );
}

const styles = StyleSheet.create({
  page:{ flex:1, alignItems:'center', justifyContent:'center', padding:24 },
  term:{ fontSize:32, fontWeight:'800', marginBottom:6 },
  meta:{ alignItems:'center', marginBottom:16 },
  metaLine:{ fontSize:14, color:'#666' },
  block:{ width:'100%', maxWidth:720, marginTop:8 },
  label:{ fontSize:12, color:'#888', letterSpacing:0.5, marginBottom:4 },
  value:{ fontSize:18, color:'#111' },
  context:{ marginTop:4, color:'#444' },
  controls:{ flexDirection:'row', gap:12, marginTop:24 },
  navBtn:{ paddingHorizontal:16, paddingVertical:10, borderRadius:8, backgroundColor:'#111' },
  navBtnDisabled:{ backgroundColor:'#aaa' },
  navTxt:{ color:'#fff', fontWeight:'600' },
  info:{ marginTop:20, paddingHorizontal:16, alignItems:'center' },
  infoTxt:{ fontSize:13, color:'#555', textAlign:'center', marginTop:4 },
});
