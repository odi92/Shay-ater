import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateWorks } from '@/lib/validations';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    // Raw count from DB (no validation)
    const { count, error: countError } = await supabase
      .from('works')
      .select('*', { count: 'exact', head: true });

    // Actual rows returned
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .order('order_index', { ascending: true });

    const validated = validateWorks(data ?? []);

    return NextResponse.json({
      db_count: count,
      db_count_error: countError?.message ?? null,
      rows_returned: data?.length ?? 0,
      after_validation: validated.length,
      fetch_error: error?.message ?? null,
      slugs: data?.map((w) => ({ slug: w.slug, aspect_ratio: w.aspect_ratio, type: w.type })),
    });
  } catch (e) {
    return NextResponse.json({ exception: String(e) });
  }
}
