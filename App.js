// App.js
import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, Pressable } from 'react-native';

import Home from './screens/Home';
import List from './screens/List';
import Word from './screens/Word';
import Settings from './screens/Settings';

import blocks from './data/blocks.json';
import { t } from './i18n';

function TabButton({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

export default function App() {
  const [tab, setTab] = useState('Home');                // 'Home' | 'List' | 'Word' | 'Settings'
  const [indexLang, setIndexLang] = useState('English'); // language label
  const [currentIndex, setCurrentIndex] = useState(0);   // current word index

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {tab === 'Home' && (
          <Home
            indexLang={indexLang}
            onStart={() => setTab('Settings')}     // hero button → Settings (change language)
            hasProgress={currentIndex > 0}
          />
        )}

        {tab === 'List' && (
          <List
            words={blocks}
            indexLang={indexLang}
            onPick={(idx) => { setCurrentIndex(idx); setTab('Word'); }}
          />
        )}

        {tab === 'Word' && (
          <Word
            words={blocks}
            indexLang={indexLang}
            index={currentIndex}
            setIndex={setCurrentIndex}
          />
        )}

        {tab === 'Settings' && (
          <Settings indexLang={indexLang} setIndexLang={setIndexLang} />
        )}
      </View>

      {/* Bottom nav bar */}
      <View style={styles.tabBar}>
        <TabButton label={t('home', indexLang)}     active={tab==='Home'}     onPress={() => setTab('Home')} />
        <TabButton label={t('list', indexLang)}     active={tab==='List'}     onPress={() => setTab('List')} />
        <TabButton label={t('words', indexLang)}    active={tab==='Word'}     onPress={() => setTab('Word')} />
        <TabButton label={t('settings', indexLang)} active={tab==='Settings'} onPress={() => setTab('Settings')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff' },
  content:{ flex:1 },
  tabBar:{ flexDirection:'row', borderTopWidth:1, borderTopColor:'#ddd' },
  tabBtn:{ flex:1, padding:14, alignItems:'center' },
  tabBtnActive:{ backgroundColor:'#f5f5f5' },
  tabLabel:{ fontSize:14, color:'#666' },
  tabLabelActive:{ color:'#000', fontWeight:'600' },
});
