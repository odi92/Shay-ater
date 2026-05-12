# Shay Ater — Portfolio Website

A portfolio website for Shay Ater, filmmaker.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (admin use only) |
| `SMTP_HOST` | SMTP server (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (`587` for TLS, `465` for SSL) |
| `SMTP_USER` | SMTP username / email |
| `SMTP_PASS` | SMTP password or app password |
| `SMTP_FROM` | From address for contact emails |
| `CONTACT_EMAIL` | Where contact form submissions are sent |
| `ANTHROPIC_API_KEY` | Anthropic API key for AI admin assistant |

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In your Supabase SQL editor, run `supabase/migrations/001_initial_schema.sql`
3. Then run `supabase/seed.sql` to populate initial works data
4. Create a storage bucket named `works-media` with **public** access

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for production

```bash
npm run build
npm start
```

## Admin Panel

Navigate to `/admin/login` to sign in. Use the Supabase Auth dashboard to create an admin user.

The admin panel includes:
- **Works management** — add, edit, delete works with image/video uploads
- **AI Assistant** — describe changes in plain English (e.g. "Add a new work called X")
- **Site settings** — manage homepage video, about page content, social links

## Adding Works via Admin

1. Go to `/admin/works/new`
2. Fill in title, type, credits, aspect ratio
3. Upload images and/or paste a Vimeo/YouTube URL
4. Save

Or use the AI Assistant on the dashboard and type naturally:
> "Add a new short film called 'My Film', directed by Jane Doe, 16:9 ratio"
