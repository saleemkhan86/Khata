# StoreApp — WhatsApp Edition

A production-ready, fully responsive web application for managing store stock, inventory, and daily sales — built with a WhatsApp-style UI.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 (WhatsApp green `#00a884` theme)
- **Icons**: lucide-react
- **Database**: Supabase (PostgreSQL + Storage)
- **Deployment**: Netlify-ready

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **No Supabase?** The app runs instantly in **Demo Mode** with mock data — no configuration needed.

### 3. Set up Supabase database

Open your Supabase SQL Editor and run the contents of `supabase-schema.sql`. This creates:

- `products` — product catalog with images
- `sales_records` — daily sales transactions
- `store_settings` — store name, currency, etc.
- `product-images` — Supabase Storage bucket

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Netlify

### One-Click Deploy

1. Push this repo to GitHub/GitLab
2. Import in [Netlify Dashboard](https://app.netlify.com/start)
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Add environment variables in Netlify dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The included `netlify.toml` handles redirects and the Next.js plugin automatically.

## Features

### WhatsApp-Style UI
- Green header bar (`#00a884`) with store name and currency
- Bottom navigation (Sales Log, Catalog, Analytics, Settings)
- Floating Action Button (FAB) for quick actions
- Chat-bubble style sales detail view
- `#efeae2` background pattern

### Bilingual (EN / اردو)
- One-tap language toggle in header
- Full RTL layout switch for Urdu
- All UI strings translated
- Product names in both English and Urdu

### Sales Log (Chats Tab)
- Chronological date list with daily totals
- Tap a date to see chat-bubble style sale details
- Per-transaction revenue, cost, and profit breakdown

### Product Catalog (Status Tab)
- Search by name (English or Urdu)
- Color-coded stock badges (green / amber / red)
- Inline stock editing
- Product image upload to Supabase Storage

### Analytics Dashboard (Calls Tab)
- Total Revenue, Total Profit, Items Sold, Inventory Value
- Top-selling products with progress bars

### Settings
- Store name (English + Urdu)
- Currency presets (PKR, INR, USD, AED, SAR)
- Language toggle
- Supabase connection status indicator

### Dark Mode
- Toggle in header
- Full dark theme across all views

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with tab routing
│   └── globals.css         # WhatsApp theme styles
├── components/
│   ├── Header.tsx          # Green header bar
│   ├── BottomNav.tsx       # Bottom tab navigation
│   ├── FAB.tsx             # Floating action button
│   ├── SalesLog.tsx        # Date-based sales list
│   ├── DateDetailView.tsx  # Chat-bubble sale details
│   ├── ProductCatalog.tsx  # Searchable product grid
│   ├── Analytics.tsx       # Revenue/profit dashboard
│   ├── Settings.tsx        # Store configuration
│   ├── AddProductModal.tsx # New product form
│   └── RecordSaleModal.tsx # Sale recording form
├── context/
│   ├── LanguageContext.tsx  # EN/Urdu + RTL state
│   └── StoreContext.tsx    # Products, sales, settings state
└── lib/
    ├── types.ts            # TypeScript interfaces
    ├── supabase.ts         # Supabase client setup
    ├── mockData.ts         # Demo fallback data
    └── i18n.ts             # Translation strings + formatters
```

## Database Schema

See `supabase-schema.sql` for the complete migration script.

| Table | Key Columns |
|-------|------------|
| `products` | id, name, urdu_name, buy_price, sell_price, stock_quantity, image_url |
| `sales_records` | id, product_id (FK), units_sold, sale_date, revenue, profit |
| `store_settings` | id, store_name, store_name_urdu, currency, currency_symbol |
