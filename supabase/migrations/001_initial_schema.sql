-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- works
-- ============================================================
CREATE TABLE public.works (
  id            UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT         NOT NULL,
  slug          TEXT         NOT NULL UNIQUE,
  type          TEXT         NOT NULL,
  description   TEXT,
  aspect_ratio  TEXT         NOT NULL CHECK (aspect_ratio IN ('16:9', '1:2.35', '4:3')),
  video_url     TEXT,
  credits       JSONB        NOT NULL DEFAULT '{}',
  awards        TEXT[],
  festival      TEXT,
  media         JSONB        NOT NULL DEFAULT '[]',
  order_index   INTEGER      NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_works_slug ON public.works (slug);
CREATE INDEX idx_works_order ON public.works (order_index);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER works_updated_at
  BEFORE UPDATE ON public.works
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- site_settings
-- ============================================================
CREATE TABLE public.site_settings (
  key        TEXT         PRIMARY KEY,
  value      TEXT         NOT NULL,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- contact_messages
-- ============================================================
CREATE TABLE public.contact_messages (
  id         UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT         NOT NULL,
  email      TEXT         NOT NULL,
  subject    TEXT         NOT NULL,
  message    TEXT         NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

-- works: public read, authenticated write
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;

CREATE POLICY "works_public_read"
  ON public.works FOR SELECT
  USING (true);

CREATE POLICY "works_auth_insert"
  ON public.works FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "works_auth_update"
  ON public.works FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "works_auth_delete"
  ON public.works FOR DELETE
  USING (auth.role() = 'authenticated');

-- site_settings: public read, authenticated write
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_public_read"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "settings_auth_write"
  ON public.site_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- contact_messages: authenticated read, public insert
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_public_insert"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "messages_auth_read"
  ON public.contact_messages FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket (run separately in Supabase dashboard
-- or via: supabase storage create works-media --public)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('works-media', 'works-media', true);
