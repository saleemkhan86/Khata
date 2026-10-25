'use client';

import { MessageSquare, Package, BarChart3, Settings } from 'lucide-react';
import { TabId, Language } from '@/lib/types';
import { t } from '@/lib/i18n';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  lang: Language;
}

const tabs: { id: TabId; icon: typeof MessageSquare; labelKey: string }[] = [
  { id: 'sales', icon: MessageSquare, labelKey: 'sales' },
  { id: 'catalog', icon: Package, labelKey: 'catalog' },
  { id: 'analytics', icon: BarChart3, labelKey: 'analytics' },
  { id: 'settings', icon: Settings, labelKey: 'settings' },
];

export default function BottomNav({ activeTab, onTabChange, lang }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1f2c34] border-t border-gray-200 dark:border-gray-700 z-50 safe-area-bottom">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ id, icon: Icon, labelKey }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex-1 flex flex-col items-center py-2 pt-3 transition-colors ${
                active
                  ? 'text-[#00a884]'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
              <span className={`text-[10px] mt-1 font-medium ${active ? 'font-semibold' : ''}`}>
                {t(labelKey, lang)}
              </span>
              {active && (
                <div className="absolute top-0 w-12 h-0.5 bg-[#00a884] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
