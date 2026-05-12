import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

// @supabase/ssr passes Schema (object) as SupabaseClient's SchemaName (string) type param,
// causing all insert/update/upsert types to resolve to never. Cast to the correctly-typed
// createClient<Database> return type — same structure, just fixes the type parameter mismatch.
type TypedClient = ReturnType<typeof createClient<Database>>;

export async function createServerSupabaseClient(): Promise<TypedClient> {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Components cannot set cookies; safe to ignore
          }
        },
      },
    }
  ) as unknown as TypedClient;
}
