import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateSiteSettings } from '@/lib/validations';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { VideoPlayer } from '@/components/VideoPlayer';

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

export default async function HomePage() {
  const settings = await getSiteSettings();
  const videoUrl = settings.homepageVideoUrl;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center pt-16">
        {videoUrl ? (
          <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-12">
            <div className="w-full aspect-video relative">
              <VideoPlayer url={videoUrl} title="Shay Ater — Showreel" className="absolute inset-0" />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-24 text-center">
            <h1 className="font-display font-light text-5xl md:text-7xl text-white/20 tracking-widest uppercase">
              Shay Ater
            </h1>
            <p className="mt-6 text-muted text-xs tracking-widest uppercase">
              Filmmaker
            </p>
          </div>
        )}
      </main>

      <Footer settings={settings} />
    </div>
  );
}
