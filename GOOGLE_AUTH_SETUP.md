# Google Sign-In Setup Guide

## Step 1: Configure Supabase Auth

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/hfedfnvnwqjcgecsyuli/auth/providers

2. Click on **Google** provider

3. Enable it and configure:
   - **Client ID**: (get from Google Cloud Console - see Step 2)
   - **Client Secret**: (get from Google Cloud Console - see Step 2)
   - **Redirect URL**: Copy this URL — you'll need it for Google Cloud Console

4. Click **Save**

## Step 2: Create Google OAuth Credentials

1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials

2. Create a new project (or select existing)

3. Click **Create Credentials** → **OAuth client ID**

4. Configure:
   - **Application type**: Web application
   - **Name**: StoreApp
   - **Authorized JavaScript origins**: 
     ```
     https://hfedfnvnwqjcgecsyuli.supabase.co
     ```
   - **Authorized redirect URIs**: 
     ```
     https://hfedfnvnwqjcgecsyuli.supabase.co/auth/v1/callback
     ```
     (This should match the redirect URL from Step 1)

5. Click **Create**

6. Copy the **Client ID** and **Client Secret**

## Step 3: Complete Supabase Configuration

1. Go back to Supabase Dashboard → Authentication → Providers → Google

2. Paste the **Client ID** and **Client Secret** from Step 2

3. Click **Save**

## Step 4: Test the Flow

1. Open your app: https://khata-xxxxx.netlify.app (or localhost:3000)

2. You should be redirected to the login page

3. Click **Sign in with Google**

4. Complete the Google authentication

5. You should be redirected back to the app and logged in

---

## Clearing Supabase Data (Optional)

If you want to clear all existing data and start fresh:

### Option A: Via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/hfedfnvnwqjcgecsyuli/editor

2. For each table (`products`, `sales_records`, `store_settings`):
   - Click the table name
   - Click **Delete** (or use the trash icon)
   - Confirm deletion

3. To clear all auth users:
   - Go to **Authentication** → **Users**
   - Select users and click **Delete**

### Option B: Via SQL Editor

1. Go to: https://supabase.com/dashboard/project/hfedfnvnwqjcgecsyuli/sql/new

2. Run this SQL:

```sql
-- Clear all data (WARNING: This is irreversible!)
TRUNCATE TABLE sales_records CASCADE;
TRUNCATE TABLE products CASCADE;
DELETE FROM store_settings WHERE id != 'default';
UPDATE store_settings SET 
  store_name = 'My Store',
  store_name_urdu = 'میری دکان',
  currency = 'PKR',
  currency_symbol = '₨'
WHERE id = 'default';

-- Optional: Clear all auth users (uncomment to run)
-- DELETE FROM auth.users;
```

3. Click **Run**

---

## Troubleshooting

### "Redirect URL mismatch" error
- Make sure the redirect URL in Google Cloud Console exactly matches the one in Supabase
- URL should be: `https://hfedfnvnwqjcgecsyuli.supabase.co/auth/v1/callback`

### "Invalid Client ID" error
- Double-check that you copied the Client ID correctly
- Make sure the OAuth consent screen is configured in Google Cloud Console

### User not redirected after login
- Check browser console for errors
- Verify the auth callback route exists: `/auth/callback`
- Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Netlify

### Can't sign out
- Clear browser cookies for your domain
- Check Supabase Auth settings

---

## Security Notes

- The `anon` key is safe to expose in client-side code (it's designed for that)
- Never commit the `service_role` key to your repository
- Enable Row Level Security (RLS) on your tables to protect user data
- Consider adding RLS policies that only allow users to access their own data

## Next Steps

After Google Sign-In is working:

1. **Add RLS policies** to protect data per user
2. **Add user profiles** table to store additional user info
3. **Implement role-based access** (admin vs regular users)
4. **Add email verification** for additional security
