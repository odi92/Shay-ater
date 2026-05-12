import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminWorkForm } from '@/components/AdminWorkForm';

export const metadata: Metadata = {
  title: 'Add Work — Admin',
};

export default function NewWorkPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/works" className="text-xs nav-link mb-4 inline-block">
          ← Back to works
        </Link>
        <h1 className="font-display font-light text-3xl text-white">Add new work</h1>
      </div>
      <AdminWorkForm />
    </div>
  );
}
