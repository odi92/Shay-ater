import { createServerSupabaseClient } from './supabase-server';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

/**
 * Enforces admin authentication for protected routes.
 * Call at the top of any admin layout or page server component.
 * Redirects unauthenticated requests to /admin/login.
 */
export async function requireAdmin(): Promise<User> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return user;
}
