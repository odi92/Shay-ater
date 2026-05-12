'use client';

import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase';

export function AdminSignOut() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClientSupabaseClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-xs tracking-widest uppercase nav-link"
    >
      Sign out
    </button>
  );
}
