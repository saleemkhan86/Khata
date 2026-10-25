'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Language, UrduFont, UrduFontSize } from '@/lib/types';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  dir: 'ltr' | 'rtl';
  urduFont: UrduFont;
  setUrduFont: (font: UrduFont) => void;
  urduFontSize: UrduFontSize;
  setUrduFontSize: (size: UrduFontSize) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
  dir: 'ltr',
  urduFont: 'nastaliq',
  setUrduFont: () => {},
  urduFontSize: 'large',
  setUrduFontSize: () => {},
});

const FONT_STORAGE_KEY = 'urdu-font';
const SIZE_STORAGE_KEY = 'urdu-font-size';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');
  const [urduFont, setUrduFontState] = useState<UrduFont>('nastaliq');
  const [urduFontSize, setUrduFontSizeState] = useState<UrduFontSize>('large');

  useEffect(() => {
    const saved = localStorage.getItem(FONT_STORAGE_KEY);
    if (saved === 'nastaliq' || saved === 'gulzar' || saved === 'naskh' || saved === 'lateef') {
      setUrduFontState(saved);
    }

    const savedSize = localStorage.getItem(SIZE_STORAGE_KEY);
    if (savedSize === 'normal' || savedSize === 'large' || savedSize === 'xlarge' || savedSize === 'huge') {
      setUrduFontSizeState(savedSize);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-urdu-font', urduFont);
  }, [urduFont]);

  useEffect(() => {
    document.documentElement.setAttribute('data-urdu-size', urduFontSize);
  }, [urduFontSize]);

  const toggleLang = useCallback(() => {
    setLang(prev => (prev === 'en' ? 'ur' : 'en'));
  }, []);

  const setUrduFont = useCallback((font: UrduFont) => {
    setUrduFontState(font);
    localStorage.setItem(FONT_STORAGE_KEY, font);
  }, []);

  const setUrduFontSize = useCallback((size: UrduFontSize) => {
    setUrduFontSizeState(size);
    localStorage.setItem(SIZE_STORAGE_KEY, size);
  }, []);

  const dir = lang === 'ur' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider
      value={{ lang, toggleLang, dir, urduFont, setUrduFont, urduFontSize, setUrduFontSize }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
