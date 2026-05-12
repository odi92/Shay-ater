export type WorkRow = {
  id: string;
  title: string;
  slug: string;
  type: string;
  description: string | null;
  aspect_ratio: string;
  video_url: string | null;
  credits: Record<string, string | null | undefined>;
  awards: string[] | null;
  festival: string | null;
  media: Array<{
    type: string;
    url: string;
    order: number;
    thumbnail?: string;
  }>;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettingRow = {
  key: string;
  value: string;
  updated_at: string;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};

export type WorkInsert = {
  title: string;
  slug: string;
  type: string;
  description: string | null;
  aspect_ratio: string;
  video_url: string | null;
  credits: Record<string, string | null | undefined>;
  awards: string[] | null;
  festival: string | null;
  media: Array<{
    type: string;
    url: string;
    order: number;
    thumbnail?: string;
  }>;
  order_index: number;
};

export interface Database {
  public: {
    Tables: {
      works: {
        Row: WorkRow;
        Insert: WorkInsert;
        Update: Partial<WorkInsert>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingRow;
        Insert: { key: string; value: string };
        Update: { value: string };
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: {
          name: string;
          email: string;
          subject: string;
          message: string;
        };
        Update: Partial<{
          name: string;
          email: string;
          subject: string;
          message: string;
        }>;
        Relationships: [];
      };
    };
    // Empty mapped types keep keyof = never, preventing overload collision
    // with Table names when resolving supabase.from() overloads.
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
  };
}
