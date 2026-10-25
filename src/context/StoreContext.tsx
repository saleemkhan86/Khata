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
import { useAuth } from '@/context/AuthContext';

type NewProduct = Omit<Product, 'id' | 'created_at' | 'user_id'>;

interface StoreContextType {
  products: Product[];
  sales: SaleRecord[];
  settings: StoreSettings;
  loading: boolean;
  isUsingMock: boolean;
  addProduct: (product: NewProduct) => Promise<void>;
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
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(mockSettings);
  const [loading, setLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(!isSupabaseConfigured);

  const fetchProducts = useCallback(async (uid: string) => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }, []);

  const fetchSales = useCallback(async (uid: string) => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('sales_records')
      .select('*, product:products(*)')
      .eq('user_id', uid)
      .order('sale_date', { ascending: false });
    if (error) throw error;
    return data || [];
  }, []);

  const fetchSettings = useCallback(async (uid: string): Promise<StoreSettings> => {
    if (!supabase) return mockSettings;

    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('user_id', uid)
      .maybeSingle();

    if (error) throw error;
    if (data) return data as StoreSettings;

    const { data: created, error: insertError } = await supabase
      .from('store_settings')
      .insert({ user_id: uid })
      .select()
      .single();

    if (insertError) throw insertError;
    return created as StoreSettings;
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        setProducts(mockProducts);
        setSales(mockSales);
        setSettings(mockSettings);
        setIsUsingMock(true);
        return;
      }

      if (!userId) {
        setProducts([]);
        setSales([]);
        setSettings(mockSettings);
        setIsUsingMock(false);
        return;
      }

      const [p, s, st] = await Promise.all([
        fetchProducts(userId),
        fetchSales(userId),
        fetchSettings(userId),
      ]);
      setProducts(p);
      setSales(s);
      setSettings(st);
      setIsUsingMock(false);
    } catch (err) {
      console.error('Failed to load store data:', err);
      setIsUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchProducts, fetchSales, fetchSettings]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addProduct = useCallback(
    async (product: NewProduct) => {
      if (isSupabaseConfigured && supabase && userId) {
        const { data, error } = await supabase
          .from('products')
          .insert({ ...product, user_id: userId })
          .select()
          .single();
        if (error) throw error;
        setProducts(prev => [data, ...prev]);
      } else {
        const newProduct: Product = {
          ...product,
          id: `p${Date.now()}`,
          user_id: userId ?? 'demo-user',
          created_at: new Date().toISOString(),
        };
        setProducts(prev => [newProduct, ...prev]);
      }
    },
    [userId]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      if (isSupabaseConfigured && supabase && userId) {
        const { error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .eq('user_id', userId);
        if (error) throw error;
      }
      setProducts(prev =>
        prev.map(p => (p.id === id ? { ...p, ...updates } : p))
      );
    },
    [userId]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (isSupabaseConfigured && supabase && userId) {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
        if (error) throw error;
      }
      setProducts(prev => prev.filter(p => p.id !== id));
    },
    [userId]
  );

  const recordSale = useCallback(
    async (productId: string, unitsSold: number, saleDate: string) => {
      const product = products.find(p => p.id === productId);
      if (!product) throw new Error('Product not found');

      const revenue = product.sell_price * unitsSold;
      const profit = (product.sell_price - product.buy_price) * unitsSold;

      if (isSupabaseConfigured && supabase && userId) {
        const { data, error } = await supabase
          .from('sales_records')
          .insert({
            product_id: productId,
            user_id: userId,
            units_sold: unitsSold,
            sale_date: saleDate,
            revenue,
            profit,
          })
          .select('*, product:products(*)')
          .single();
        if (error) throw error;
        setSales(prev => [data, ...prev]);

        const newStock = product.stock_quantity - unitsSold;
        await supabase
          .from('products')
          .update({ stock_quantity: newStock })
          .eq('id', productId)
          .eq('user_id', userId);
        setProducts(prev =>
          prev.map(p => (p.id === productId ? { ...p, stock_quantity: newStock } : p))
        );
      } else {
        const newSale: SaleRecord = {
          id: `s${Date.now()}`,
          user_id: userId ?? 'demo-user',
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
    [products, userId]
  );

  const updateSettings = useCallback(
    async (updates: Partial<StoreSettings>) => {
      if (isSupabaseConfigured && supabase && userId) {
        const { error } = await supabase
          .from('store_settings')
          .update(updates)
          .eq('user_id', userId);
        if (error) throw error;
      }
      setSettings(prev => ({ ...prev, ...updates }));
    },
    [userId]
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
