export interface Product {
  id: string;
  user_id: string;
  name: string;
  urdu_name: string;
  buy_price: number;
  sell_price: number;
  stock_quantity: number;
  image_url: string | null;
  created_at: string;
}

export interface SaleRecord {
  id: string;
  user_id: string;
  product_id: string;
  units_sold: number;
  sale_date: string;
  revenue: number;
  profit: number;
  created_at: string;
  product?: Product;
}

export interface StoreSettings {
  id: string;
  user_id: string;
  store_name: string;
  store_name_urdu: string;
  currency: string;
  currency_symbol: string;
  updated_at: string;
}

export interface DailySalesSummary {
  date: string;
  totalItems: number;
  totalRevenue: number;
  totalProfit: number;
  sales: SaleRecord[];
}

export type TabId = 'sales' | 'catalog' | 'analytics' | 'settings';
export type Language = 'en' | 'ur';
export type UrduFont = 'nastaliq' | 'gulzar' | 'naskh' | 'lateef';
