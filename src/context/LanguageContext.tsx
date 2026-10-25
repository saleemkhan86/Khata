'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Language, UrduFont } from '@/lib/types';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  dir: 'ltr' | 'rtl';
  urduFont: UrduFont;
  setUrduFont: (font: UrduFont) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
  dir: 'ltr',
  urduFont: 'nastaliq',
  setUrduFont: () => {},
});

const FONT_STORAGE_KEY = 'urdu-font';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');
  const [urduFont, setUrduFontState] = useState<UrduFont>('nastaliq');

  useEffect(() => {
    const saved = localStorage.getItem(FONT_STORAGE_KEY);
    if (saved === 'nastaliq' || saved === 'gulzar' || saved === 'naskh' || saved === 'lateef') {
      setUrduFontState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-urdu-font', urduFont);
  }, [urduFont]);

  const toggleLang = useCallback(() => {
    setLang(prev => (prev === 'en' ? 'ur' : 'en'));
  }, []);

  const setUrduFont = useCallback((font: UrduFont) => {
    setUrduFontState(font);
    localStorage.setItem(FONT_STORAGE_KEY, font);
  }, []);

  const dir = lang === 'ur' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, dir, urduFont, setUrduFont }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
