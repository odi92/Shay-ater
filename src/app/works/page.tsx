import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateWorks, validateSiteSettings } from '@/lib/validations';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WorkCard } from '@/components/WorkCard';

export const metadata: Metadata = {
  title: 'Works — Shay Ater',
  description: 'Films and projects by Shay Ater.',
};

async function getWorks() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .order('order_index', { ascending: true });
    console.log('[works] data count:', data?.length, 'error:', error?.message);
    if (error) return [];
    return validateWorks(data ?? []);
  } catch (e) {
    console.log('[works] exception:', e);
    return [];
  }
}

async function getSiteSettings() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (error) return {};
    return validateSiteSettings(data ?? []);
  } catch {
    return {};
  }
}

export default async function WorksPage() {
  const [works, settings] = await Promise.all([getWorks(), getSiteSettings()]);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      <main className="flex-1 pt-24">
        <p className="text-center font-sans text-sm tracking-widest text-white mb-8">
          Selected Works
        </p>

        {works.length === 0 ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-muted text-xs tracking-widest uppercase">No works yet</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto flex flex-col">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}
