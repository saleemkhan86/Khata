'use client';

import { useState } from 'react';
import { Plus, Package, ShoppingCart, X } from 'lucide-react';
import { Language } from '@/lib/types';
import { t } from '@/lib/i18n';

interface FABProps {
  lang: Language;
  onAddProduct: () => void;
  onRecordSale: () => void;
}

export default function FAB({ lang, onAddProduct, onRecordSale }: FABProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-40" style={lang === 'ur' ? { left: '1rem', right: 'auto' } : undefined}>
      {open && (
        <div className="mb-3 flex flex-col gap-2 items-end animate-fade-in">
          <button
            onClick={() => {
              onAddProduct();
              setOpen(false);
            }}
            className="flex items-center gap-2 bg-[#00a884] text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-[#009975] transition-all text-sm font-medium"
          >
            <Package size={18} />
            <span>{t('addNewProduct', lang)}</span>
          </button>
          <button
            onClick={() => {
              onRecordSale();
              setOpen(false);
            }}
            className="flex items-center gap-2 bg-[#025144] text-white px-4 py-2.5 rounded-full shadow-lg hover:bg-[#01443a] transition-all text-sm font-medium"
          >
            <ShoppingCart size={18} />
            <span>{t('recordNewSale', lang)}</span>
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full bg-[#00a884] text-white shadow-xl flex items-center justify-center transition-transform hover:scale-105 ${
          open ? 'rotate-45' : ''
        }`}
      >
        {open ? <X size={26} /> : <Plus size={26} />}
      </button>
    </div>
  );
}
