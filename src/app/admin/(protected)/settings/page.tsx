import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { validateSiteSettings } from '@/lib/validations';
import { AdminSettingsForm } from '@/components/AdminSettingsForm';

export const metadata: Metadata = {
  title: 'Site Settings — Admin',
};

async function getSettings() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (error) return {};
    return validateSiteSettings(data ?? []);
  } catch {
    return {};
  }
}

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display font-light text-3xl text-white mb-1">Site Settings</h1>
        <p className="text-sm text-secondary">Manage homepage video, about page content, and social links</p>
      </div>
      <AdminSettingsForm settings={settings} />
    </div>
  );
}
