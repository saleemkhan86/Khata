import { Language } from './types';

type TranslationKeys = {
  [K in string]: string;
};

const translations: Record<Language, TranslationKeys> = {
  en: {
    appTitle: 'StoreApp',
    appSubtitle: 'WhatsApp Edition',
    sales: 'Sales Log',
    catalog: 'Catalog',
    analytics: 'Analytics',
    settings: 'Settings',
    searchProducts: 'Search products...',
    addProduct: 'Add Product',
    recordSale: 'Record Sale',
    productName: 'Product Name',
    urduName: 'Urdu Name',
    buyPrice: 'Buying Price',
    sellPrice: 'Selling Price',
    stock: 'Stock',
    initialStock: 'Initial Stock',
    unitsSold: 'Units Sold',
    saleDate: 'Sale Date',
    revenue: 'Revenue',
    profit: 'Profit',
    totalRevenue: 'Total Revenue',
    totalProfit: 'Total Profit',
    itemsSold: 'Items Sold',
    inventoryValue: 'Inventory Value',
    storeName: 'Store Name',
    currency: 'Currency',
    language: 'Language',
    connected: 'Connected',
    notConnected: 'Not Connected',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    lowStock: 'Low Stock',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    today: 'Today',
    yesterday: 'Yesterday',
    noSalesToday: 'No sales recorded today',
    noProducts: 'No products yet',
    selectProduct: 'Select a product',
    imageUpload: 'Product Image',
    supabaseStatus: 'Database Status',
    usingMockData: 'Using demo data',
    configureSupabase: 'Configure Supabase to persist your data',
    allSales: 'All Sales',
    items: 'items',
    perUnit: 'per unit',
    total: 'Total',
    cost: 'Cost',
    addNewProduct: 'Add New Product',
    recordNewSale: 'Record New Sale',
    close: 'Close',
    confirm: 'Confirm',
    productAdded: 'Product added successfully',
    saleRecorded: 'Sale recorded successfully',
    stockUpdated: 'Stock updated',
    settingsSaved: 'Settings saved',
    noProductsMatch: 'No products match your search',
    darkMode: 'Dark Mode',
    storeSettings: 'Store Settings',
    appSettings: 'App Settings',
    urduFont: 'Urdu Font',
  },
  ur: {
    appTitle: 'اسٹور ایپ',
    appSubtitle: 'واٹس ایپ ایڈیشن',
    sales: 'فروخت کا ریکارڈ',
    catalog: 'کیٹلاگ',
    analytics: 'تجزیات',
    settings: 'ترتیبات',
    searchProducts: 'مصنوعات تلاش کریں...',
    addProduct: 'نئی مصنوعات',
    recordSale: 'فروخت درج کریں',
    productName: 'مصنوعات کا نام',
    urduName: 'اردو نام',
    buyPrice: 'خریداری کی قیمت',
    sellPrice: 'فروخت کی قیمت',
    stock: 'سٹاک',
    initialStock: 'ابتدائی سٹاک',
    unitsSold: 'فروخت شدہ تعداد',
    saleDate: 'فروخت کی تاریخ',
    revenue: 'آمدنی',
    profit: 'منافع',
    totalRevenue: 'کل آمدنی',
    totalProfit: 'کل منافع',
    itemsSold: 'فروخت شدہ اشیاء',
    inventoryValue: 'انوینٹری کی قدر',
    storeName: 'دکان کا نام',
    currency: 'کرنسی',
    language: 'زبان',
    connected: 'منسلک',
    notConnected: 'منسلک نہیں',
    save: 'محفوظ کریں',
    cancel: 'منسوخ',
    delete: 'حذف',
    edit: 'ترمیم',
    lowStock: 'کم سٹاک',
    outOfStock: 'سٹاک ختم',
    inStock: 'دستیاب',
    today: 'آج',
    yesterday: 'کل',
    noSalesToday: 'آج کوئی فروخت نہیں',
    noProducts: 'ابھی تک کوئی مصنوعات نہیں',
    selectProduct: 'مصنوعات منتخب کریں',
    imageUpload: 'مصنوعات کی تصویر',
    supabaseStatus: 'ڈیٹا بیس کی حالت',
    usingMockData: 'ڈیمو ڈیٹا استعمال ہو رہا ہے',
    configureSupabase: 'ڈیٹا محفوظ کرنے کے لیے Supabase ترتیب دیں',
    allSales: 'تمام فروخت',
    items: 'اشیاء',
    perUnit: 'فی عدد',
    total: 'کل',
    cost: 'لاگت',
    addNewProduct: 'نئی مصنوعات شامل کریں',
    recordNewSale: 'نئی فروخت درج کریں',
    close: 'بند کریں',
    confirm: 'تصدیق',
    productAdded: 'مصنوعات شامل ہو گئی',
    saleRecorded: 'فروخت درج ہو گئی',
    stockUpdated: 'سٹاک اپ ڈیٹ ہو گیا',
    settingsSaved: 'ترتیبات محفوظ ہو گئیں',
    noProductsMatch: 'کوئی مصنوعات نہیں ملی',
    darkMode: 'ڈارک موڈ',
    storeSettings: 'دکان کی ترتیبات',
    appSettings: 'ایپ کی ترتیبات',
    urduFont: 'اردو فونٹ',
  },
};

export function t(key: string, lang: Language): string {
  return translations[lang][key] || translations.en[key] || key;
}

const urduMonths = [
  'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
  'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر',
];

const englishMonths = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDate(dateStr: string, lang: Language): string {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDate();
  const monthIndex = d.getMonth();
  const year = d.getFullYear();

  if (lang === 'ur') {
    return `${day} ${urduMonths[monthIndex]} ${year}`;
  }
  return `${day} ${englishMonths[monthIndex]} ${year}`.toUpperCase();
}

export function formatCurrency(amount: number, symbol: string): string {
  return `${symbol} ${amount.toLocaleString()}`;
}

export function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0];
}

export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  return dateStr === yesterday;
}
