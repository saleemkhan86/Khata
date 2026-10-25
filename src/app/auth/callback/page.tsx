'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      router.push('/');
      return;
    }

    const handleCallback = async () => {
      if (!supabase) {
        router.push('/');
        return;
      }
      const { error } = await supabase.auth.getSession();
      if (error) {
        console.error('Auth callback error:', error);
        router.push('/login?error=auth_failed');
      } else {
        router.push('/');
      }
    };

    handleCallback();
  }, [router, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#efeae2] dark:bg-[#0b141a]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#00a884]/30 border-t-[#00a884] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Completing sign-in...</p>
      </div>
    </div>
  );
}
