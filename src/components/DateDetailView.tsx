'use client';

import { ChevronLeft, Package, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useStore } from '@/context/StoreContext';
import { SaleRecord } from '@/lib/types';
import { t, formatDate, formatCurrency } from '@/lib/i18n';

interface DateDetailViewProps {
  date: string;
  sales: SaleRecord[];
  onBack: () => void;
}

export default function DateDetailView({ date, sales, onBack }: DateDetailViewProps) {
  const { lang } = useLanguage();
  const { settings } = useStore();

  const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
  const totalItems = sales.reduce((sum, s) => sum + s.units_sold, 0);

  return (
    <div>
      <div className="bg-[#00a884] text-white px-4 py-3 flex items-center gap-3 -mx-4 -mt-4 mb-4">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft size={22} />
        </button>
        <div className="flex-1">
          <p className="font-semibold text-sm">{formatDate(date, lang)}</p>
          <p className="text-xs text-white/70">
            {totalItems} {t('items', lang)} · {formatCurrency(totalRevenue, settings.currency_symbol)}
          </p>
        </div>
        <div className="text-end">
          <p className="text-xs text-white/70">{t('profit', lang)}</p>
          <p className="font-semibold text-sm flex items-center gap-1">
            <TrendingUp size={14} />
            {formatCurrency(totalProfit, settings.currency_symbol)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sales.map(sale => {
          const product = sale.product;
          const name = product
            ? lang === 'ur'
              ? product.urdu_name || product.name
              : product.name
            : t('selectProduct', lang);

          return (
            <div
              key={sale.id}
              className="bg-white dark:bg-[#1f2c34] rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700/50 flex gap-3"
            >
              <div className="w-14 h-14 rounded-lg bg-[#efeae2] dark:bg-[#0b141a] flex items-center justify-center flex-shrink-0 overflow-hidden">
                {product?.image_url ? (
                  <img
                    src={product.image_url}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={24} className="text-[#00a884]/50" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                  {name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {sale.units_sold} × {formatCurrency(product?.sell_price || 0, settings.currency_symbol)} {t('perUnit', lang)}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-gray-400">
                    {t('cost', lang)}: {formatCurrency((product?.buy_price || 0) * sale.units_sold, settings.currency_symbol)}
                  </span>
                  <span className="text-xs font-semibold text-[#00a884]">
                    {t('profit', lang)}: {formatCurrency(sale.profit, settings.currency_symbol)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sales.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">{t('noSalesToday', lang)}</p>
        </div>
      )}
    </div>
  );
}
