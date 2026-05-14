import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sendContactEmail } from '@/lib/email';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { ContactFormData } from '@/types';

interface ContactBody {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

function isContactBody(data: unknown): data is ContactBody {
  if (typeof data !== 'object' || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d['name'] === 'string' && d['name'].trim().length > 0 &&
    typeof d['email'] === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d['email']) &&
    typeof d['message'] === 'string' && d['message'].trim().length > 0
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!isContactBody(body)) {
    return NextResponse.json(
      { error: 'Name, email, and message are required' },
      { status: 400 }
    );
  }

  const formData: ContactFormData = {
    name: body.name.trim(),
    email: body.email.trim(),
    subject: (body.subject?.trim() ?? '') || 'Contact from website',
    message: body.message.trim(),
  };

  // Save to Supabase
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.from('contact_messages').insert({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });
  } catch {
    // Non-fatal: proceed even if DB save fails
  }

  // Send email
  try {
    await sendContactEmail(formData);
  } catch (err) {
    console.error('Failed to send contact email:', err);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
