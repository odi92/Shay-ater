'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase';
import { slugify } from '@/lib/utils';
import type { Work, AspectRatio } from '@/types';

interface Props {
  work?: Work;
}

interface FormState {
  title: string;
  type: string;
  aspectRatio: AspectRatio;
  videoUrl: string;
  description: string;
  festival: string;
  awards: string;
  director: string;
  colorGrading: string;
  gaffer: string;
  artDirector: string;
  producer: string;
  additionalFilming: string;
  orderIndex: string;
}

const ASPECT_RATIOS: AspectRatio[] = ['16:9', '1:2.35', '4:3'];
const WORK_TYPES = ['Short film', 'Music video', 'Documentary', 'Commercial', 'Other'];

function workToFormState(work?: Work): FormState {
  return {
    title: work?.title ?? '',
    type: work?.type ?? 'Short film',
    aspectRatio: work?.aspectRatio ?? '16:9',
    videoUrl: work?.videoUrl ?? '',
    description: work?.description ?? '',
    festival: work?.festival ?? '',
    awards: work?.awards?.join('\n') ?? '',
    director: work?.credits.director ?? '',
    colorGrading: work?.credits.colorGrading ?? '',
    gaffer: work?.credits.gaffer ?? '',
    artDirector: work?.credits.artDirector ?? '',
    producer: work?.credits.producer ?? '',
    additionalFilming: work?.credits.additionalFilming ?? '',
    orderIndex: String(work?.orderIndex ?? 0),
  };
}

export function AdminWorkForm({ work }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(workToFormState(work));
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isEditing = Boolean(work);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const supabase = createClientSupabaseClient();

    const slug = work?.slug ?? slugify(form.title);
    const awards = form.awards
      .split('\n')
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const payload = {
      title: form.title.trim(),
      slug,
      type: form.type,
      aspect_ratio: form.aspectRatio,
      video_url: form.videoUrl.trim() || null,
      description: form.description.trim() || null,
      festival: form.festival.trim() || null,
      awards: awards.length > 0 ? awards : null,
      credits: {
        director: form.director.trim() || undefined,
        colorGrading: form.colorGrading.trim() || undefined,
        gaffer: form.gaffer.trim() || undefined,
        artDirector: form.artDirector.trim() || undefined,
        producer: form.producer.trim() || undefined,
        additionalFilming: form.additionalFilming.trim() || undefined,
      },
      order_index: Number(form.orderIndex) || 0,
    };

    if (isEditing && work) {
      const { error } = await supabase.from('works').update(payload).eq('id', work.id);
      if (error) {
        setStatus('error');
        setErrorMessage(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('works').insert({ ...payload, media: [] });
      if (error) {
        setStatus('error');
        setErrorMessage(error.message);
        return;
      }
    }

    router.push('/admin/works');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <div className="admin-card space-y-6">
        <h2 className="text-xs tracking-widest uppercase text-secondary">Basic Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label" htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              className="admin-input"
              placeholder="Film title"
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              required
              value={form.type}
              onChange={handleChange}
              className="admin-input"
            >
              {WORK_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label" htmlFor="aspectRatio">Aspect Ratio *</label>
            <select
              id="aspectRatio"
              name="aspectRatio"
              required
              value={form.aspectRatio}
              onChange={handleChange}
              className="admin-input"
            >
              {ASPECT_RATIOS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="admin-label" htmlFor="videoUrl">Video URL (Vimeo / YouTube)</label>
            <input
              id="videoUrl"
              name="videoUrl"
              type="url"
              value={form.videoUrl}
              onChange={handleChange}
              className="admin-input"
              placeholder="https://vimeo.com/..."
            />
          </div>
        </div>

        <div>
          <label className="admin-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="admin-input resize-none"
            placeholder="Optional description..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label" htmlFor="festival">Festival Premiere</label>
            <input
              id="festival"
              name="festival"
              type="text"
              value={form.festival}
              onChange={handleChange}
              className="admin-input"
              placeholder="e.g. Cannes Film Festival"
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="orderIndex">Display Order</label>
            <input
              id="orderIndex"
              name="orderIndex"
              type="number"
              min={0}
              value={form.orderIndex}
              onChange={handleChange}
              className="admin-input"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="admin-label" htmlFor="awards">Awards (one per line)</label>
          <textarea
            id="awards"
            name="awards"
            rows={3}
            value={form.awards}
            onChange={handleChange}
            className="admin-input resize-none"
            placeholder={"Best Short Film, TLVFest\nBest Cinematography, TISFF"}
          />
        </div>
      </div>

      {/* Credits */}
      <div className="admin-card space-y-6">
        <h2 className="text-xs tracking-widest uppercase text-secondary">Credits</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(
            [
              { field: 'director', label: 'Director' },
              { field: 'colorGrading', label: 'Colour Grading' },
              { field: 'gaffer', label: 'Gaffer' },
              { field: 'artDirector', label: 'Art Director' },
              { field: 'producer', label: 'Producer' },
              { field: 'additionalFilming', label: 'Additional Filming' },
            ] as const
          ).map(({ field, label }) => (
            <div key={field}>
              <label className="admin-label" htmlFor={field}>{label}</label>
              <input
                id={field}
                name={field}
                type="text"
                value={form[field]}
                onChange={handleChange}
                className="admin-input"
                placeholder={label}
              />
            </div>
          ))}
        </div>
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm">{errorMessage}</p>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary disabled:opacity-50"
        >
          {status === 'loading' ? 'Saving...' : isEditing ? 'Save changes' : 'Create work'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-ghost"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
