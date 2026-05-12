import { requireAdmin } from '@/lib/proxy';
import Link from 'next/link';
import { AdminSignOut } from '@/components/AdminSignOut';

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/admin"
            className="text-xs tracking-widest uppercase text-white hover:opacity-70 transition-opacity"
          >
            Shay Ater — Admin
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/admin/works" className="text-xs tracking-widest uppercase nav-link">
              Works
            </Link>
            <Link href="/admin/settings" className="text-xs tracking-widest uppercase nav-link">
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            target="_blank"
            className="text-xs tracking-widest uppercase nav-link"
          >
            View site ↗
          </Link>
          <AdminSignOut />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-10">{children}</div>
    </div>
  );
}
