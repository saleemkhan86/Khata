'use client';

import { useState } from 'react';
import { ChevronLeft, ShoppingBag, TrendingUp, Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useStore } from '@/context/StoreContext';
import { t, formatDate, formatCurrency, isToday, isYesterday } from '@/lib/i18n';
import { SaleRecord } from '@/lib/types';
import DateDetailView from './DateDetailView';

export default function SalesLog() {
  const { lang } = useLanguage();
  const { settings, getDailySummaries, getSalesForDate, loading } = useStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const summaries = getDailySummaries();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (selectedDate) {
    const salesForDate = getSalesForDate(selectedDate);
    return (
      <DateDetailView
        date={selectedDate}
        sales={salesForDate}
        onBack={() => setSelectedDate(null)}
      />
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <ShoppingBag size={48} className="mb-3 opacity-50" />
        <p className="text-sm">{t('noSalesToday', lang)}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
      {summaries.map(summary => {
        const label = isToday(summary.date)
          ? t('today', lang)
          : isYesterday(summary.date)
          ? t('yesterday', lang)
          : formatDate(summary.date, lang);

        return (
          <button
            key={summary.date}
            onClick={() => setSelectedDate(summary.date)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#1a2730] transition-colors text-start"
          >
            <div className="w-12 h-12 rounded-full bg-[#00a884]/10 flex items-center justify-center flex-shrink-0">
              <Calendar size={20} className="text-[#00a884]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                {label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {summary.totalItems} {t('items', lang)} · {formatCurrency(summary.totalRevenue, settings.currency_symbol)}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[#00a884] text-xs font-semibold flex-shrink-0">
              <TrendingUp size={14} />
              {formatCurrency(summary.totalProfit, settings.currency_symbol)}
            </div>
            <ChevronLeft
              size={18}
              className="text-gray-300 dark:text-gray-600 rotate-180 rtl:rotate-0 flex-shrink-0"
            />
          </button>
        );
      })}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-3 border-[#00a884]/30 border-t-[#00a884] rounded-full animate-spin" />
    </div>
  );
}
