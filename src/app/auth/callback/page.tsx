'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      router.replace('/login');
      return;
    }

    const client = supabase;

    const completeSignIn = async () => {
      const query = new URLSearchParams(window.location.search);
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const oauthError = query.get('error') || hash.get('error');

      if (oauthError) {
        router.replace(`/login?error=${encodeURIComponent(oauthError)}`);
        return;
      }

      const { data, error } = await client.auth.getSession();
      if (error || !data.session) {
        router.replace('/login?error=signin_failed');
        return;
      }

      router.replace('/');
    };

    completeSignIn();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#efeae2] dark:bg-[#0b141a]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#00a884]/30 border-t-[#00a884] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Completing sign-in...</p>
      </div>
    </div>
  );
}
