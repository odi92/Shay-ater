'use client';

import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase';

interface Props {
  workId: string;
  workTitle: string;
}

export function AdminWorkDeleteButton({ workId, workTitle }: Props) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${workTitle}"? This cannot be undone.`)) return;

    const supabase = createClientSupabaseClient();
    const { error } = await supabase.from('works').delete().eq('id', workId);

    if (error) {
      alert(`Failed to delete: ${error.message}`);
      return;
    }

    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-muted hover:text-red-400 transition-colors tracking-widest uppercase"
    >
      Delete
    </button>
  );
}
