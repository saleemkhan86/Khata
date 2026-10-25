'use client';

import { useState, useMemo, useEffect } from 'react';
import { X, ShoppingCart, Search, Package, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useStore } from '@/context/StoreContext';
import { t, formatCurrency } from '@/lib/i18n';

interface RecordSaleModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RecordSaleModal({ open, onClose }: RecordSaleModalProps) {
  const { lang } = useLanguage();
  const { products, settings, recordSale } = useStore();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [unitsSold, setUnitsSold] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && !saleDate) {
      setSaleDate(new Date().toISOString().split('T')[0]);
    }
  }, [open, saleDate]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      p => p.name.toLowerCase().includes(q) || p.urdu_name.includes(q)
    );
  }, [products, searchQuery]);

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const units = parseInt(unitsSold, 10) || 0;
  const revenue = selectedProduct ? selectedProduct.sell_price * units : 0;
  const profit = selectedProduct
    ? (selectedProduct.sell_price - selectedProduct.buy_price) * units
    : 0;

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    const p = products.find(x => x.id === productId);
    if (p) setSearchQuery(lang === 'ur' ? p.urdu_name || p.name : p.name);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !units || units <= 0) return;

    setSaving(true);
    try {
      await recordSale(selectedProductId, units, saleDate);
      setSelectedProductId('');
      setUnitsSold('');
      setSearchQuery('');
      setSaleDate(new Date().toISOString().split('T')[0]);
      onClose();
    } catch (err) {
      console.error('Failed to record sale:', err);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1f2c34] w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#025144] text-white px-4 py-3 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-semibold text-sm">{t('recordNewSale', lang)}</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="relative">
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              {t('selectProduct', lang)} *
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                  setSelectedProductId('');
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0b141a] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a884]/50"
                placeholder={t('searchProducts', lang)}
              />
            </div>

            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#1f2c34] border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <p className="px-3 py-2 text-sm text-gray-400">{t('noProductsMatch', lang)}</p>
                ) : (
                  filteredProducts.map(p => {
                    const name = lang === 'ur' ? p.urdu_name || p.name : p.name;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectProduct(p.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-[#0b141a] text-start"
                      >
                        <div className="w-8 h-8 rounded bg-[#efeae2] dark:bg-[#0b141a] flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package size={14} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{name}</p>
                          <p className="text-xs text-gray-400">
                            {formatCurrency(p.sell_price, settings.currency_symbol)} · {p.stock_quantity} {t('stock', lang)}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {selectedProduct && (
            <div className="bg-[#00a884]/5 dark:bg-[#00a884]/10 rounded-lg p-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white dark:bg-[#0b141a] flex items-center justify-center overflow-hidden">
                {selectedProduct.image_url ? (
                  <img src={selectedProduct.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Package size={20} className="text-[#00a884]/50" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {lang === 'ur' ? selectedProduct.urdu_name || selectedProduct.name : selectedProduct.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(selectedProduct.sell_price, settings.currency_symbol)} {t('perUnit', lang)}
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              {t('unitsSold', lang)} *
            </label>
            <input
              type="number"
              value={unitsSold}
              onChange={e => setUnitsSold(e.target.value)}
              required
              min="1"
              max={selectedProduct?.stock_quantity}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0b141a] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a884]/50"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              {t('saleDate', lang)}
            </label>
            <input
              type="date"
              value={saleDate}
              onChange={e => setSaleDate(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0b141a] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00a884]/50"
            />
          </div>

          {selectedProduct && units > 0 && (
            <div className="bg-gray-50 dark:bg-[#0b141a] rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('revenue', lang)}</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {formatCurrency(revenue, settings.currency_symbol)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('profit', lang)}</span>
                <span className="font-semibold text-[#00a884] flex items-center gap-1">
                  <TrendingUp size={14} />
                  {formatCurrency(profit, settings.currency_symbol)}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !selectedProductId || units <= 0}
            className="w-full py-3 bg-[#025144] text-white rounded-xl font-semibold text-sm hover:bg-[#01443a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingCart size={18} />
            )}
            {t('recordSale', lang)}
          </button>
        </form>
      </div>
    </div>
  );
}
