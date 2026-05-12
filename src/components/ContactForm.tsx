'use client';

import { useState, type FormEvent } from 'react';
import type { ContactFormData } from '@/types';

type Status = 'idle' | 'loading' | 'success' | 'error';

function extractErrorMessage(body: unknown): string {
  if (typeof body !== 'object' || body === null) return 'Something went wrong';
  const obj = body as Record<string, unknown>;
  return typeof obj['error'] === 'string' ? obj['error'] : 'Something went wrong';
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
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
        body: JSON.stringify(formData),
      });

      const bodyRaw: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(extractErrorMessage(bodyRaw));
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="py-12">
        <p className="text-white font-display font-light text-2xl mb-3">Message sent.</p>
        <p className="text-secondary text-sm">
          Thank you for reaching out. I&apos;ll get back to you soon.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-8 text-xs tracking-widest uppercase text-secondary hover:text-white transition-colors duration-200"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="name" className="block text-xs tracking-widest uppercase text-secondary mb-3">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs tracking-widest uppercase text-secondary mb-3">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="your@email.com"
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs tracking-widest uppercase text-secondary mb-3">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          value={formData.subject}
          onChange={handleChange}
          className="form-input"
          placeholder="What&apos;s this about?"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs tracking-widest uppercase text-secondary mb-3">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="form-input resize-none"
          placeholder="Your message..."
        />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-sm">{errorMessage}</p>
      )}

      <div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Sending...' : 'Send message'}
        </button>
      </div>
    </form>
  );
}
