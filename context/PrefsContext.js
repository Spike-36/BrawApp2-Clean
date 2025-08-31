// context/PrefsContext.js
import React, { createContext, useContext, useState } from 'react';

const PrefsContext = createContext();

export function PrefsProvider({ children }) {
  const [indexLang, setIndexLang] = useState('English'); // default language
  const [currentIndex, setCurrentIndex] = useState(0);   // word index

  return (
    <PrefsContext.Provider
      value={{ indexLang, setIndexLang, currentIndex, setCurrentIndex }}
    >
      {children}
    </PrefsContext.Provider>
  );
}

export function usePrefs() {
  return useContext(PrefsContext);
}
