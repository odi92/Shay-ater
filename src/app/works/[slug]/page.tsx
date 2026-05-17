import type { Metadata } from 'next';
import Link from 'next/link';
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
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <Link href="/works" className="inline-block font-sans text-sm text-white/50 hover:text-white transition-colors mb-6">
            ← Back to Selected Works
          </Link>
          <WorkCarousel work={work} />

          <div className="mt-12">
            <h1 className="work-title mb-2">
              {work.title}
            </h1>
            <p className="work-meta mb-6">
              {work.type}
            </p>

            {credits.length > 0 && (
              <dl className="space-y-3 mb-8">
                {credits.map(({ label, value }) => (
                  <div key={label} className="flex gap-4">
                    <dt className="work-meta w-32 shrink-0">{label}</dt>
                    <dd className="work-meta">{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {(work.festival ?? (work.awards && work.awards.length > 0)) && (
              <div className="space-y-2">
                {work.festival && (
                  <p className="text-xs text-white/50">
                    <span className="text-white/30">Premiered at </span>
                    {work.festival}
                  </p>
                )}
                {work.awards?.map((award, i) => (
                  <p key={i} className="text-xs text-white/50">
                    {award}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
