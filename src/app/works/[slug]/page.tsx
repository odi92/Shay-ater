import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateWork, validateSiteSettings } from '@/lib/validations';
import { formatCredits } from '@/lib/utils';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WorkCarousel } from '@/components/WorkCarousel';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getWork(slug: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return validateWork(data);
  } catch {
    return null;
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWork(slug);
  if (!work) return { title: 'Work not found — Shay Ater' };
  return {
    title: `${work.title} — Shay Ater`,
    description: `${work.title} — ${work.type} by Shay Ater`,
  };
}

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const [work, settings] = await Promise.all([getWork(slug), getSiteSettings()]);

  if (!work) notFound();

  const credits = formatCredits(work.credits);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
          <WorkCarousel work={work} />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <p className="text-xs tracking-widest uppercase text-secondary mb-3">
                {work.type}
              </p>
              <h1 className="font-display font-light text-3xl md:text-4xl text-white leading-tight mb-6">
                {work.title}
              </h1>
              {work.description && (
                <p className="text-secondary text-sm leading-relaxed">{work.description}</p>
              )}
              {(work.festival ?? (work.awards && work.awards.length > 0)) && (
                <div className="mt-6 space-y-2">
                  {work.festival && (
                    <p className="text-xs text-secondary">
                      <span className="text-muted">Premiered at </span>
                      {work.festival}
                    </p>
                  )}
                  {work.awards?.map((award, i) => (
                    <p key={i} className="text-xs text-secondary">
                      {award}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {credits.length > 0 && (
              <div>
                <h2 className="text-xs tracking-widest uppercase text-muted mb-6">Credits</h2>
                <dl className="space-y-4">
                  {credits.map(({ label, value }) => (
                    <div key={label}>
                      <dt className="text-xs tracking-widest uppercase text-muted mb-1">
                        {label}
                      </dt>
                      <dd className="text-sm text-secondary">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
