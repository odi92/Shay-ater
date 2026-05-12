import type { Metadata } from 'next';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateSiteSettings } from '@/lib/validations';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About — Shay Ater',
  description: 'About Shay Ater, filmmaker and cinematographer.',
};

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

const DEFAULT_ABOUT_TEXT = `Shay Ater is a filmmaker and director of photography based in Tel Aviv, Israel.

His work spans short films, music videos, and documentary projects. He brings a deeply personal visual language to every project, shaped by years of studying light, composition, and the human experience on screen.

His films have screened at international festivals including Cannes Film Festival La Cinef, Jerusalem Film Festival, Haifa Film Festival, Warsaw Film Festival, and TLVFest.`;

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const aboutText = settings.aboutText ?? DEFAULT_ABOUT_TEXT;
  const aboutTitle = settings.aboutTitle ?? 'About';
  const aboutImageUrl = settings.aboutImageUrl;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-16">
        <div className="max-w-5xl mx-auto px-8 md:px-12 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
            <div>
              <h1 className="font-display font-light text-4xl md:text-5xl text-white mb-12 leading-tight">
                {aboutTitle}
              </h1>
              <div className="space-y-6">
                {aboutText.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-secondary text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="aspect-[3/4] relative bg-surface overflow-hidden">
              {aboutImageUrl ? (
                <Image
                  src={aboutImageUrl}
                  alt="Shay Ater"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted text-xs tracking-widest uppercase">Photo</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
