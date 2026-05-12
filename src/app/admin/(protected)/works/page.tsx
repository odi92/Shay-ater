import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateWorks } from '@/lib/validations';
import { AdminWorkDeleteButton } from '@/components/AdminWorkDeleteButton';

async function getWorks() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('works')
      .select('*')
      .order('order_index', { ascending: true });
    if (error) return [];
    return validateWorks(data ?? []);
  } catch {
    return [];
  }
}

export default async function AdminWorksPage() {
  const works = await getWorks();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-light text-3xl text-white mb-1">Works</h1>
          <p className="text-sm text-secondary">{works.length} total</p>
        </div>
        <Link href="/admin/works/new" className="btn-primary">
          Add new
        </Link>
      </div>

      {works.length === 0 ? (
        <div className="admin-card flex items-center justify-center py-16">
          <p className="text-muted text-sm">No works yet. Add your first work above.</p>
        </div>
      ) : (
        <div className="divide-y divide-border border border-border">
          {works.map((work) => (
            <div
              key={work.id}
              className="flex items-center justify-between px-6 py-4 bg-surface hover:bg-surface-hover transition-colors"
            >
              <div>
                <p className="text-sm text-white">{work.title}</p>
                <p className="text-xs text-muted mt-0.5">
                  {work.type} · {work.aspectRatio}
                  {work.festival ? ` · ${work.festival}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/works/${work.slug}`}
                  target="_blank"
                  className="text-xs nav-link"
                >
                  View ↗
                </Link>
                <Link
                  href={`/admin/works/${work.id}/edit`}
                  className="text-xs nav-link"
                >
                  Edit
                </Link>
                <AdminWorkDeleteButton workId={work.id} workTitle={work.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
