import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateWork } from '@/lib/validations';
import { AdminWorkForm } from '@/components/AdminWorkForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getWork(id: string) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return validateWork(data);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const work = await getWork(id);
  return { title: work ? `Edit: ${work.title} — Admin` : 'Edit Work — Admin' };
}

export default async function EditWorkPage({ params }: PageProps) {
  const { id } = await params;
  const work = await getWork(id);

  if (!work) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/works" className="text-xs nav-link mb-4 inline-block">
          ← Back to works
        </Link>
        <h1 className="font-display font-light text-3xl text-white">Edit: {work.title}</h1>
      </div>
      <AdminWorkForm work={work} />
    </div>
  );
}
