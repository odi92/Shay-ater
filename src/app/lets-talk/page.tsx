import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateSiteSettings } from '@/lib/validations';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: "Let's Talk — Shay Ater",
  description: 'Get in touch with Shay Ater, filmmaker.',
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

const CONTACT_ITEMS = [
  { label: 'Email', value: 'shayater1@gmail.com', href: 'mailto:shayater1@gmail.com' },
  { label: 'Based in', value: 'Tel Aviv, Israel', href: null },
  { label: 'Available for', value: 'Short films, music videos, commercials', href: null },
] as const;

export default async function LetsTalkPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-16">
        <div className="max-w-5xl mx-auto px-8 md:px-12 py-20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 md:gap-24 items-start">
            {/* Left: info */}
            <div className="md:col-span-2">
              <h1 className="font-display font-light text-4xl md:text-5xl text-white mb-12 leading-tight">
                Let's Talk
              </h1>
              <ul className="space-y-8">
                {CONTACT_ITEMS.map((item) => (
                  <li key={item.label}>
                    <p className="text-xs tracking-widest uppercase text-muted mb-2">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-secondary hover:text-white transition-colors duration-200"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-secondary">{item.value}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: form */}
            <div className="md:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </main>

      <Footer settings={settings} />
    </div>
  );
}
