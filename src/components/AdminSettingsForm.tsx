'use client';

import { useState, type FormEvent } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase';
import type { SiteSettings } from '@/types';
import { CloudinaryUpload } from './CloudinaryUpload';

interface Props {
  settings: SiteSettings;
}

type FormState = {
  [K in keyof Required<SiteSettings>]: string;
};

function settingsToForm(s: SiteSettings): FormState {
  return {
    homepageVideoUrl: s.homepageVideoUrl ?? '',
    aboutTitle: s.aboutTitle ?? '',
    aboutText: s.aboutText ?? '',
    aboutImageUrl: s.aboutImageUrl ?? '',
    socialInstagram: s.socialInstagram ?? '',
    socialVimeo: s.socialVimeo ?? '',
    socialImdb: s.socialImdb ?? '',
    socialLinkedin: s.socialLinkedin ?? '',
  };
}

const KEY_MAP: Record<keyof FormState, string> = {
  homepageVideoUrl: 'homepage_video_url',
  aboutTitle: 'about_title',
  aboutText: 'about_text',
  aboutImageUrl: 'about_image_url',
  socialInstagram: 'social_instagram',
  socialVimeo: 'social_vimeo',
  socialImdb: 'social_imdb',
  socialLinkedin: 'social_linkedin',
};

export function AdminSettingsForm({ settings }: Props) {
  const [form, setForm] = useState<FormState>(settingsToForm(settings));
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const supabase = createClientSupabaseClient();

    const upserts = (Object.entries(form) as [keyof FormState, string][])
      .filter(([, value]) => value.trim().length > 0)
      .map(([field, value]) => ({
        key: KEY_MAP[field],
        value: value.trim(),
      }));

    const { error } = await supabase
      .from('site_settings')
      .upsert(upserts, { onConflict: 'key' });

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
      return;
    }

    setStatus('success');
    setTimeout(() => setStatus('idle'), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="admin-card space-y-6">
        <h2 className="text-xs tracking-widest uppercase text-secondary">Homepage</h2>
        <div>
          <label className="admin-label" htmlFor="homepageVideoUrl">Showreel video URL (Vimeo / YouTube)</label>
          <input
            id="homepageVideoUrl"
            name="homepageVideoUrl"
            type="url"
            value={form.homepageVideoUrl}
            onChange={handleChange}
            className="admin-input"
            placeholder="https://vimeo.com/..."
          />
        </div>
      </div>

      <div className="admin-card space-y-6">
        <h2 className="text-xs tracking-widest uppercase text-secondary">About Page</h2>
        <div>
          <label className="admin-label" htmlFor="aboutTitle">Page title</label>
          <input
            id="aboutTitle"
            name="aboutTitle"
            type="text"
            value={form.aboutTitle}
            onChange={handleChange}
            className="admin-input"
            placeholder="About"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="aboutText">Bio text</label>
          <textarea
            id="aboutText"
            name="aboutText"
            rows={8}
            value={form.aboutText}
            onChange={handleChange}
            className="admin-input resize-none"
            placeholder="Write your bio here..."
          />
          <p className="text-xs text-muted mt-1">Separate paragraphs with a blank line.</p>
        </div>
        <div>
          <label className="admin-label" htmlFor="aboutImageUrl">Photo</label>
          <div className="flex gap-3 items-start">
            <input
              id="aboutImageUrl"
              name="aboutImageUrl"
              type="url"
              value={form.aboutImageUrl}
              onChange={handleChange}
              className="admin-input flex-1"
              placeholder="https://..."
            />
            <CloudinaryUpload
              label="Upload"
              onUpload={(url) => setForm((prev) => ({ ...prev, aboutImageUrl: url }))}
            />
          </div>
        </div>
      </div>

      <div className="admin-card space-y-6">
        <h2 className="text-xs tracking-widest uppercase text-secondary">Social Links</h2>
        {(
          [
            { field: 'socialInstagram' as const, label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
            { field: 'socialVimeo' as const, label: 'Vimeo URL', placeholder: 'https://vimeo.com/...' },
            { field: 'socialImdb' as const, label: 'IMDb URL', placeholder: 'https://imdb.com/name/...' },
            { field: 'socialLinkedin' as const, label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
          ]
        ).map(({ field, label, placeholder }) => (
          <div key={field}>
            <label className="admin-label" htmlFor={field}>{label}</label>
            <input
              id={field}
              name={field}
              type="url"
              value={form[field]}
              onChange={handleChange}
              className="admin-input"
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>

      {status === 'success' && (
        <p className="text-green-400 text-sm">Settings saved.</p>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary disabled:opacity-50"
      >
        {status === 'loading' ? 'Saving...' : 'Save settings'}
      </button>
    </form>
  );
}
