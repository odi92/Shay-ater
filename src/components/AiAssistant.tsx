'use client';

import { useState, type FormEvent } from 'react';

interface AiApiResponse {
  message: string;
  action: string;
}

function isAiApiResponse(value: unknown): value is AiApiResponse {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v['message'] === 'string' && typeof v['action'] === 'string';
}

export function AiAssistant() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setStatus('loading');
    setResponseMessage('');

    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const bodyRaw: unknown = await res.json().catch(() => null);

      if (!res.ok) {
        let errMsg = 'Something went wrong';
        if (typeof bodyRaw === 'object' && bodyRaw !== null) {
          const err = (bodyRaw as Record<string, unknown>)['error'];
          if (typeof err === 'string') errMsg = err;
        }
        throw new Error(errMsg);
      }

      if (!isAiApiResponse(bodyRaw)) {
        throw new Error('Unexpected response from server');
      }

      setResponseMessage(bodyRaw.message);
      setStatus('success');

      if (bodyRaw.action !== 'none') {
        setPrompt('');
        window.location.reload();
      }
    } catch (err) {
      setStatus('error');
      setResponseMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  const EXAMPLES = [
    'Add a new short film called "Golden Hour", directed by Jane Doe, 16:9 ratio',
    'Update "Mythos" — add award: Best Cinematography',
    'Change the aspect ratio of "Under the Surface" to 16:9',
  ] as const;

  return (
    <div className="admin-card">
      <h2 className="text-xs tracking-widest uppercase text-secondary mb-6">AI Content Assistant</h2>
      <p className="text-sm text-muted mb-6">
        Describe what you want to change in plain English. The AI will handle it.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="admin-input resize-none"
          placeholder='e.g. "Add a new short film called My Film, directed by John Doe, 16:9 ratio"'
          disabled={status === 'loading'}
        />

        {status === 'success' && responseMessage && (
          <div className="p-4 bg-green-950/30 border border-green-800/30 rounded-sm">
            <p className="text-sm text-green-400">{responseMessage}</p>
          </div>
        )}

        {status === 'error' && responseMessage && (
          <div className="p-4 bg-red-950/30 border border-red-800/30 rounded-sm">
            <p className="text-sm text-red-400">{responseMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !prompt.trim()}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Processing...' : 'Send'}
        </button>
      </form>

      <div className="mt-8">
        <p className="text-xs tracking-widest uppercase text-muted mb-4">Examples</p>
        <ul className="space-y-2">
          {EXAMPLES.map((example) => (
            <li key={example}>
              <button
                onClick={() => setPrompt(example)}
                className="text-xs text-muted hover:text-secondary transition-colors text-left"
              >
                &ldquo;{example}&rdquo;
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
