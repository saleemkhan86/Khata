'use client';

import { useState } from 'react';
import { Search, Package, AlertTriangle, Edit2, Trash2, X, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/lib/types';
import { t, formatCurrency } from '@/lib/i18n';

export default function ProductCatalog() {
  const { lang } = useLanguage();
  const { products, settings, updateProduct, deleteProduct, loading } = useStore();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState('');

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.urdu_name.includes(q);
  });

  const handleSaveStock = async (id: string) => {
    const qty = parseInt(editStock, 10);
    if (!isNaN(qty) && qty >= 0) {
      await updateProduct(id, { stock_quantity: qty });
    }
    setEditingId(null);
  };

  const getStockBadge = (product: Product) => {
    if (product.stock_quantity === 0) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {t('outOfStock', lang)}
        </span>
      );
    }
    if (product.stock_quantity < 5) {
      return (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1">
          <AlertTriangle size={10} />
          {t('lowStock', lang)}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        {product.stock_quantity} {t('inStock', lang)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[#00a884]/30 border-t-[#00a884] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 py-3 sticky top-[52px] bg-[#efeae2] dark:bg-[#0b141a] z-10">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('searchProducts', lang)}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1f2c34] rounded-lg text-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#00a884]/50 dark:text-gray-100"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Package size={40} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">{search ? t('noProductsMatch', lang) : t('noProducts', lang)}</p>
        </div>
      ) : (
        <div className="px-4 pb-4 grid gap-3">
          {filtered.map(product => {
            const name = lang === 'ur' ? product.urdu_name || product.name : product.name;
            const isEditing = editingId === product.id;

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-[#1f2c34] rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700/50"
              >
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-[#efeae2] dark:bg-[#0b141a] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={28} className="text-[#00a884]/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                        {name}
                      </p>
                      {getStockBadge(product)}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <span>{t('buyPrice', lang)}: {formatCurrency(product.buy_price, settings.currency_symbol)}</span>
                      <span className="text-[#00a884] font-medium">
                        {t('sellPrice', lang)}: {formatCurrency(product.sell_price, settings.currency_symbol)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            value={editStock}
                            onChange={e => setEditStock(e.target.value)}
                            className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#0b141a] dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#00a884]"
                            placeholder="Stock"
                            min="0"
                          />
                          <button
                            onClick={() => handleSaveStock(product.id)}
                            className="p-1 rounded-full bg-[#00a884] text-white hover:bg-[#009975]"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(product.id);
                              setEditStock(String(product.stock_quantity));
                            }}
                            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
