import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// @supabase/ssr passes Schema (object) as SupabaseClient's SchemaName (string) type param,
// causing all insert/update/upsert types to resolve to never. Cast to the correctly-typed
// createClient<Database> return type — same structure, just fixes the type parameter mismatch.
type TypedClient = ReturnType<typeof createClient<Database>>;

export function createClientSupabaseClient(): TypedClient {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ) as unknown as TypedClient;
}
