import type { Metadata } from 'next';

export const revalidate = 3600;
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

const DEFAULT_ABOUT_TEXT = `I am a director of photography focused on narrative filmmaking, music videos, and dance videos. My approach is guided by a commitment to storytelling: each shot must be visually precise and expressive, while serving the film as a whole.

I try to keep my imagination flexible and challenge myself every work anew. I work through light, movement, and careful attention to the emotional world of the characters.

My recent work includes "It's No Time For Pop", selected for Cannes Festival La Cineff Competition, as well as "Tshuva" for which I was awarded Best Cinematography at TISFF 2024.`;

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const aboutText = settings.aboutText ?? DEFAULT_ABOUT_TEXT;
  const aboutImageUrl = settings.aboutImageUrl;

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      <main className="flex-1 pt-24">
        <div className="max-w-5xl mx-auto px-8 py-12">
          {/* "About" title — centered above both columns */}
          <h1 className="page-title mb-16">About</h1>

          {/* Two columns: text left, image right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Left column: bio text, justified */}
            <div className="space-y-7">
              {aboutText.split('\n\n').map((paragraph, i) => (
                <p key={i} className="body-text">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Right column: photo */}
            <div className="relative w-full h-[337px] bg-surface overflow-hidden">
              {aboutImageUrl ? (
                <Image
                  src={aboutImageUrl}
                  alt="Shay Ater"
                  fill
                  className="object-cover object-top"
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

      <Footer />
    </div>
  );
}
