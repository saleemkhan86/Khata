'use client';

import { Database, Globe, DollarSign, Store, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useStore } from '@/context/StoreContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { t } from '@/lib/i18n';
import { useState } from 'react';

export default function Settings() {
  const { lang, toggleLang } = useLanguage();
  const { settings, updateSettings } = useStore();
  const [storeName, setStoreName] = useState(settings.store_name);
  const [storeNameUrdu, setStoreNameUrdu] = useState(settings.store_name_urdu);
  const [currency, setCurrency] = useState(settings.currency);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currency_symbol);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await updateSettings({
      store_name: storeName,
      store_name_urdu: storeNameUrdu,
      currency,
      currency_symbol: currencySymbol,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const currencyPresets = [
    { code: 'PKR', symbol: '₨' },
    { code: 'INR', symbol: '₹' },
    { code: 'USD', symbol: '$' },
    { code: 'AED', symbol: 'د.إ' },
    { code: 'SAR', symbol: '﷼' },
  ];

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="bg-white dark:bg-[#1f2c34] rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <Store size={16} className="text-[#00a884]" />
          {t('storeSettings', lang)}
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              {t('storeName', lang)} (English)
            </label>
            <input
              type="text"
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0b141a] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a884]/50"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              {t('storeName', lang)} (اردو)
            </label>
            <input
              type="text"
              value={storeNameUrdu}
              onChange={e => setStoreNameUrdu(e.target.value)}
              dir="rtl"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0b141a] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a884]/50 text-end"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1f2c34] rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-[#00a884]" />
          {t('currency', lang)}
        </h3>
        <div className="flex flex-wrap gap-2">
          {currencyPresets.map(preset => (
            <button
              key={preset.code}
              onClick={() => {
                setCurrency(preset.code);
                setCurrencySymbol(preset.symbol);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                currency === preset.code
                  ? 'bg-[#00a884] text-white border-[#00a884]'
                  : 'bg-gray-50 dark:bg-[#0b141a] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-[#00a884]/50'
              }`}
            >
              {preset.symbol} {preset.code}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#1f2c34] rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <Globe size={16} className="text-[#00a884]" />
          {t('appSettings', lang)}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('language', lang)}</span>
          <button
            onClick={toggleLang}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#00a884]/10 text-[#00a884] hover:bg-[#00a884]/20 transition-colors"
          >
            {lang === 'en' ? 'اردو' : 'English'}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1f2c34] rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
          <Database size={16} className="text-[#00a884]" />
          {t('supabaseStatus', lang)}
        </h3>
        <div className="flex items-center gap-2">
          {isSupabaseConfigured ? (
            <>
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                {t('connected', lang)}
              </span>
            </>
          ) : (
            <>
              <AlertCircle size={16} className="text-amber-500" />
              <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                {t('usingMockData', lang)}
              </span>
            </>
          )}
        </div>
        {!isSupabaseConfigured && (
          <p className="text-xs text-gray-400 mt-2">{t('configureSupabase', lang)}</p>
        )}
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3 bg-[#00a884] text-white rounded-xl font-semibold text-sm hover:bg-[#009975] transition-colors flex items-center justify-center gap-2"
      >
        {saved ? <CheckCircle size={18} /> : null}
        {saved ? t('settingsSaved', lang) : t('save', lang)}
      </button>
    </div>
  );
}
