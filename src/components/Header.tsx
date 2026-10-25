'use client';

import { Globe, Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useStore } from '@/context/StoreContext';
import { t } from '@/lib/i18n';

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function Header({ darkMode, onToggleDark }: HeaderProps) {
  const { lang, toggleLang } = useLanguage();
  const { settings } = useStore();

  return (
    <header className="bg-[#00a884] text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold">S</span>
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight">
            {lang === 'ur' ? settings.store_name_urdu || settings.store_name : settings.store_name}
          </h1>
          <p className="text-xs text-white/70">{settings.currency_symbol}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDark}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors text-sm font-medium"
        >
          <Globe size={16} />
          <span>{lang === 'en' ? 'اردو' : 'EN'}</span>
        </button>
      </div>
    </header>
  );
}
