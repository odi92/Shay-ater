import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('works').select('id').limit(1);
    return NextResponse.json({
      url_set: !!url,
      url_prefix: url?.slice(0, 30),
      key_set: !!key,
      key_prefix: key?.slice(0, 20),
      data_count: data?.length ?? 0,
      error: error?.message ?? null,
    });
  } catch (e) {
    return NextResponse.json({ exception: String(e), url_set: !!url, key_set: !!key });
  }
}
