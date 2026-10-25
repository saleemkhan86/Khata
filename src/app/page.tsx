'use client';

import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { StoreProvider, useStore } from '@/context/StoreContext';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import FAB from '@/components/FAB';
import SalesLog from '@/components/SalesLog';
import ProductCatalog from '@/components/ProductCatalog';
import Analytics from '@/components/Analytics';
import Settings from '@/components/Settings';
import AddProductModal from '@/components/AddProductModal';
import RecordSaleModal from '@/components/RecordSaleModal';
import { TabId } from '@/lib/types';

function AppContent() {
  const { lang, dir } = useLanguage();
  const { isUsingMock } = useStore();
  const [activeTab, setActiveTab] = useState<TabId>('sales');
  const [darkMode, setDarkMode] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showRecordSale, setShowRecordSale] = useState(false);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderTab = () => {
    switch (activeTab) {
      case 'sales':
        return <SalesLog />;
      case 'catalog':
        return <ProductCatalog />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#0b141a] relative">
      <Header darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />

      {isUsingMock && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-1.5 text-center">
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            {lang === 'ur' ? 'ڈیمو موڈ — Supabase ترتیب دیں ڈیٹا محفوظ کرنے کے لیے' : 'Demo Mode — Configure Supabase to persist data'}
          </p>
        </div>
      )}

      <main
        className="flex-1 overflow-y-auto pb-20 w-full max-w-4xl mx-auto"
        style={{ backgroundColor: activeTab === 'sales' ? 'var(--whatsapp-bg)' : undefined }}
      >
        <div className={activeTab === 'sales' ? 'dark:bg-[#0b141a]' : ''}>
          {activeTab === 'sales' ? (
            <div className="bg-[#efeae2] dark:bg-[#0b141a] min-h-full">
              <div className="bg-white dark:bg-[#111b21] min-h-full">
                {renderTab()}
              </div>
            </div>
          ) : (
            <div className="bg-[#efeae2] dark:bg-[#0b141a] min-h-full">
              {renderTab()}
            </div>
          )}
        </div>
      </main>

      <FAB
        lang={lang}
        onAddProduct={() => setShowAddProduct(true)}
        onRecordSale={() => setShowRecordSale(true)}
      />

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} lang={lang} />

      <AddProductModal open={showAddProduct} onClose={() => setShowAddProduct(false)} />
      <RecordSaleModal open={showRecordSale} onClose={() => setShowRecordSale(false)} />
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </LanguageProvider>
  );
}
