'use client';

import { useState, type FormEvent } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  message: string;
}

function extractErrorMessage(body: unknown): string {
  if (typeof body !== 'object' || body === null) return 'Something went wrong';
  const obj = body as Record<string, unknown>;
  return typeof obj['error'] === 'string' ? obj['error'] : 'Something went wrong';
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, subject: 'Contact from website' }),
      });

      const bodyRaw: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(extractErrorMessage(bodyRaw));
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-white/20 p-8 py-12 text-center">
        <p className="text-white font-display font-light text-2xl mb-3">Message sent.</p>
        <p className="font-sans text-sm text-white/60">
          Thank you for reaching out. I&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-8 text-xs text-white/50 hover:text-white transition-colors duration-200"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="border border-white/30 p-6">
      <p className="font-sans font-bold text-sm text-white text-center mb-5">Contact Me</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm text-white mb-1">
            Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-white/40 text-white text-sm py-1.5 focus:outline-none focus:border-white transition-colors"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-white mb-1">
            Email:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-white/40 text-white text-sm py-1.5 focus:outline-none focus:border-white transition-colors"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm text-white mb-1">
            Your Message here:
          </label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-white/10 text-white text-sm p-2 focus:outline-none resize-none h-28 mt-1"
          />
        </div>

        {status === 'error' && (
          <p className="text-red-400 text-sm">{errorMessage}</p>
        )}

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="text-sm border border-white px-4 py-1 text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
