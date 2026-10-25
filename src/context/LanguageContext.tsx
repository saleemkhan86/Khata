'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Language } from '@/lib/types';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
  dir: 'ltr',
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const toggleLang = useCallback(() => {
    setLang(prev => (prev === 'en' ? 'ur' : 'en'));
  }, []);

  const dir = lang === 'ur' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
