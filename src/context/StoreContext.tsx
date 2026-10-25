'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { Product, SaleRecord, StoreSettings, DailySalesSummary } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockProducts, mockSales, mockSettings } from '@/lib/mockData';

interface StoreContextType {
  products: Product[];
  sales: SaleRecord[];
  settings: StoreSettings;
  loading: boolean;
  isUsingMock: boolean;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  recordSale: (productId: string, unitsSold: number, saleDate: string) => Promise<void>;
  updateSettings: (updates: Partial<StoreSettings>) => Promise<void>;
  getDailySummaries: () => DailySalesSummary[];
  getSalesForDate: (date: string) => SaleRecord[];
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [sales, setSales] = useState<SaleRecord[]>(mockSales);
  const [settings, setSettings] = useState<StoreSettings>(mockSettings);
  const [loading, setLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(!isSupabaseConfigured);

  const fetchProducts = useCallback(async () => {
    if (!supabase) return mockProducts;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }, []);

  const fetchSales = useCallback(async () => {
    if (!supabase) return mockSales;
    const { data, error } = await supabase
      .from('sales_records')
      .select('*, product:products(*)')
      .order('sale_date', { ascending: false });
    if (error) throw error;
    return data || [];
  }, []);

  const fetchSettings = useCallback(async () => {
    if (!supabase) return mockSettings;
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .limit(1)
      .single();
    if (error) return mockSettings;
    return data || mockSettings;
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const [p, s, st] = await Promise.all([
          fetchProducts(),
          fetchSales(),
          fetchSettings(),
        ]);
        setProducts(p);
        setSales(s);
        setSettings(st);
        setIsUsingMock(false);
      } else {
        setIsUsingMock(true);
      }
    } catch {
      setIsUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, fetchSales, fetchSettings]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addProduct = useCallback(
    async (product: Omit<Product, 'id' | 'created_at'>) => {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('products')
          .insert(product)
          .select()
          .single();
        if (error) throw error;
        setProducts(prev => [data, ...prev]);
      } else {
        const newProduct: Product = {
          ...product,
          id: `p${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        setProducts(prev => [newProduct, ...prev]);
      }
    },
    []
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('products').update(updates).eq('id', id);
        if (error) throw error;
        setProducts(prev =>
          prev.map(p => (p.id === id ? { ...p, ...updates } : p))
        );
      } else {
        setProducts(prev =>
          prev.map(p => (p.id === id ? { ...p, ...updates } : p))
        );
      }
    },
    []
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
      }
      setProducts(prev => prev.filter(p => p.id !== id));
    },
    []
  );

  const recordSale = useCallback(
    async (productId: string, unitsSold: number, saleDate: string) => {
      const product = products.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');

      const revenue = product.sell_price * unitsSold;
      const profit = (product.sell_price - product.buy_price) * unitsSold;

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('sales_records')
          .insert({ product_id: productId, units_sold: unitsSold, sale_date: saleDate, revenue, profit })
          .select('*, product:products(*)')
          .single();
        if (error) throw error;
        setSales(prev => [data, ...prev]);

        const newStock = product.stock_quantity - unitsSold;
        await supabase.from('products').update({ stock_quantity: newStock }).eq('id', productId);
        setProducts(prev =>
          prev.map(p => (p.id === productId ? { ...p, stock_quantity: newStock } : p))
        );
      } else {
        const newSale: SaleRecord = {
          id: `s${Date.now()}`,
          product_id: productId,
          units_sold: unitsSold,
          sale_date: saleDate,
          revenue,
          profit,
          created_at: new Date().toISOString(),
          product,
        };
        setSales(prev => [newSale, ...prev]);
        setProducts(prev =>
          prev.map(p =>
            p.id === productId
              ? { ...p, stock_quantity: p.stock_quantity - unitsSold }
              : p
          )
        );
      }
    },
    [products]
  );

  const updateSettings = useCallback(
    async (updates: Partial<StoreSettings>) => {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase
          .from('store_settings')
          .update(updates)
          .eq('id', settings.id);
        if (error) throw error;
      }
      setSettings(prev => ({ ...prev, ...updates }));
    },
    [settings.id]
  );

  const getDailySummaries = useCallback((): DailySalesSummary[] => {
    const grouped: Record<string, SaleRecord[]> = {};
    sales.forEach(s => {
      if (!grouped[s.sale_date]) grouped[s.sale_date] = [];
      grouped[s.sale_date].push(s);
    });

    return Object.entries(grouped)
      .map(([date, daySales]) => ({
        date,
        totalItems: daySales.reduce((sum, s) => sum + s.units_sold, 0),
        totalRevenue: daySales.reduce((sum, s) => sum + s.revenue, 0),
        totalProfit: daySales.reduce((sum, s) => sum + s.profit, 0),
        sales: daySales,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [sales]);

  const getSalesForDate = useCallback(
    (date: string): SaleRecord[] => {
      return sales.filter(s => s.sale_date === date);
    },
    [sales]
  );

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        settings,
        loading,
        isUsingMock,
        addProduct,
        updateProduct,
        deleteProduct,
        recordSale,
        updateSettings,
        getDailySummaries,
        getSalesForDate,
        refreshData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
