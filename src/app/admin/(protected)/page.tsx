import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateWorks } from '@/lib/validations';
import { AiAssistant } from '@/components/AiAssistant';

async function getStats() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('works')
      .select('*')
      .order('updated_at', { ascending: false });
    const works = validateWorks(data ?? []);
    return {
      total: works.length,
      lastUpdated: works[0]?.updatedAt ?? null,
    };
  } catch {
    return { total: 0, lastUpdated: null };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display font-light text-3xl text-white mb-2">Dashboard</h1>
        <p className="text-secondary text-sm">Manage Shay Ater's portfolio content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="admin-card">
          <p className="text-xs tracking-widest uppercase text-muted mb-2">Total works</p>
          <p className="font-display font-light text-4xl text-white">{stats.total}</p>
        </div>
        <div className="admin-card">
          <p className="text-xs tracking-widest uppercase text-muted mb-2">Last updated</p>
          <p className="text-sm text-secondary">
            {stats.lastUpdated
              ? new Date(stats.lastUpdated).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : '—'}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="admin-card">
        <h2 className="text-xs tracking-widest uppercase text-secondary mb-6">Quick actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/works/new" className="btn-primary">
            Add new work
          </Link>
          <Link href="/admin/works" className="btn-ghost">
            Manage works
          </Link>
          <Link href="/admin/settings" className="btn-ghost">
            Site settings
          </Link>
        </div>
      </div>

      {/* AI assistant */}
      <AiAssistant />
    </div>
  );
}
