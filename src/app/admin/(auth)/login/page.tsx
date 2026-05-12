'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientSupabaseClient } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const supabase = createClientSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8">
      <Link
        href="/"
        className="text-xs tracking-ultra uppercase text-secondary hover:text-white transition-colors mb-16"
      >
        ← Back to site
      </Link>

      <div className="w-full max-w-sm">
        <h1 className="font-display font-light text-3xl text-white mb-10 text-center">
          Admin
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div>
            <label htmlFor="email" className="admin-label">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="admin-label">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {status === 'error' && (
            <p className="text-red-400 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-primary w-full text-center mt-2 disabled:opacity-50"
          >
            {status === 'loading' ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
