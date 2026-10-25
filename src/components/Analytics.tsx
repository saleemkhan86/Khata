'use client';

import { TrendingUp, DollarSign, Package, BarChart3, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useStore } from '@/context/StoreContext';
import { t, formatCurrency } from '@/lib/i18n';

export default function Analytics() {
  const { lang } = useLanguage();
  const { products, sales, settings, loading } = useStore();

  const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
  const totalItemsSold = sales.reduce((sum, s) => sum + s.units_sold, 0);
  const inventoryValue = products.reduce(
    (sum, p) => sum + p.buy_price * p.stock_quantity,
    0
  );

  const cards = [
    {
      label: t('totalRevenue', lang),
      value: formatCurrency(totalRevenue, settings.currency_symbol),
      icon: DollarSign,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      iconColor: 'text-blue-500',
    },
    {
      label: t('totalProfit', lang),
      value: formatCurrency(totalProfit, settings.currency_symbol),
      icon: TrendingUp,
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      iconColor: 'text-[#00a884]',
    },
    {
      label: t('itemsSold', lang),
      value: totalItemsSold.toString(),
      icon: ShoppingBag,
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      iconColor: 'text-purple-500',
    },
    {
      label: t('inventoryValue', lang),
      value: formatCurrency(inventoryValue, settings.currency_symbol),
      icon: Package,
      color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
      iconColor: 'text-amber-500',
    },
  ];

  const topProducts = [...products]
    .map(p => {
      const productSales = sales.filter(s => s.product_id === p.id);
      const totalUnits = productSales.reduce((sum, s) => sum + s.units_sold, 0);
      const totalRev = productSales.reduce((sum, s) => sum + s.revenue, 0);
      return { ...p, totalUnits, totalRev };
    })
    .sort((a, b) => b.totalRev - a.totalRev)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#00a884]/30 border-t-[#00a884] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-2 gap-3 mb-6">
        {cards.map(card => (
          <div
            key={card.label}
            className={`${card.color} rounded-xl p-4 border border-white/50 dark:border-gray-700/50`}
          >
            <card.icon size={22} className={card.iconColor} />
            <p className="text-xs mt-2 opacity-70">{card.label}</p>
            <p className="text-lg font-bold mt-0.5 text-gray-900 dark:text-gray-100">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <BarChart3 size={16} className="text-[#00a884]" />
          {lang === 'ur' ? 'سب سے زیادہ فروخت' : 'Top Selling Products'}
        </h3>
        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">{t('noProducts', lang)}</p>
        ) : (
          <div className="space-y-2">
            {topProducts.map((p, i) => {
              const name = lang === 'ur' ? p.urdu_name || p.name : p.name;
              const maxRev = topProducts[0]?.totalRev || 1;
              const barWidth = (p.totalRev / maxRev) * 100;

              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-[#1f2c34] rounded-lg p-3 border border-gray-100 dark:border-gray-700/50"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
                        {name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#00a884]">
                      {formatCurrency(p.totalRev, settings.currency_symbol)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00a884] rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {p.totalUnits} {t('itemsSold', lang)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
