import type {
  Work,
  WorkCredits,
  WorkMedia,
  AspectRatio,
  SiteSettings,
  MediaItemType,
} from '@/types';

const VALID_ASPECT_RATIOS: AspectRatio[] = ['16:9', '1:2.35', '4:3'];
const VALID_MEDIA_TYPES: MediaItemType[] = ['image', 'video'];

function isAspectRatio(value: unknown): value is AspectRatio {
  return typeof value === 'string' && (VALID_ASPECT_RATIOS as string[]).includes(value);
}

function isMediaType(value: unknown): value is MediaItemType {
  return typeof value === 'string' && (VALID_MEDIA_TYPES as string[]).includes(value);
}

function parseCredits(raw: unknown): WorkCredits {
  if (typeof raw !== 'object' || raw === null) return {};
  const obj = raw as Record<string, unknown>;
  const result: WorkCredits = {};
  if (typeof obj['director'] === 'string') result.director = obj['director'];
  if (typeof obj['colorGrading'] === 'string') result.colorGrading = obj['colorGrading'];
  if (typeof obj['gaffer'] === 'string') result.gaffer = obj['gaffer'];
  if (typeof obj['artDirector'] === 'string') result.artDirector = obj['artDirector'];
  if (typeof obj['producer'] === 'string') result.producer = obj['producer'];
  if (typeof obj['additionalFilming'] === 'string') result.additionalFilming = obj['additionalFilming'];
  return result;
}

function parseMedia(raw: unknown): WorkMedia[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .filter(
      (item) =>
        isMediaType(item['type']) &&
        typeof item['url'] === 'string' &&
        item['url'].length > 0 &&
        typeof item['order'] === 'number'
    )
    .map((item) => ({
      type: item['type'] as MediaItemType,
      url: item['url'] as string,
      order: item['order'] as number,
      thumbnail: typeof item['thumbnail'] === 'string' ? item['thumbnail'] : undefined,
    }))
    .sort((a, b) => a.order - b.order);
}

export function validateWork(raw: unknown): Work | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;

  if (typeof r['id'] !== 'string' || !r['id']) return null;
  if (typeof r['title'] !== 'string' || !r['title']) return null;
  if (typeof r['slug'] !== 'string' || !r['slug']) return null;
  if (typeof r['type'] !== 'string' || !r['type']) return null;
  if (!isAspectRatio(r['aspect_ratio'])) return null;

  return {
    id: r['id'],
    title: r['title'],
    slug: r['slug'],
    type: r['type'],
    description: typeof r['description'] === 'string' ? r['description'] : null,
    aspectRatio: r['aspect_ratio'],
    videoUrl: typeof r['video_url'] === 'string' ? r['video_url'] : null,
    credits: parseCredits(r['credits']),
    awards:
      Array.isArray(r['awards']) && r['awards'].every((a) => typeof a === 'string')
        ? (r['awards'] as string[])
        : null,
    festival: typeof r['festival'] === 'string' ? r['festival'] : null,
    media: parseMedia(r['media']),
    orderIndex: typeof r['order_index'] === 'number' ? r['order_index'] : 0,
    createdAt: typeof r['created_at'] === 'string' ? r['created_at'] : new Date().toISOString(),
    updatedAt: typeof r['updated_at'] === 'string' ? r['updated_at'] : new Date().toISOString(),
  };
}

export function validateWorks(raws: unknown[]): Work[] {
  return raws.map(validateWork).filter((w): w is Work => w !== null);
}

export function validateSiteSettings(rows: unknown[]): SiteSettings {
  const settings: SiteSettings = {};

  const validRows = rows.filter(
    (r): r is Record<string, unknown> => typeof r === 'object' && r !== null
  );

  for (const row of validRows) {
    if (typeof row['key'] !== 'string' || typeof row['value'] !== 'string') continue;
    const key = row['key'];
    const value = row['value'];

    switch (key) {
      case 'homepage_video_url':
        settings.homepageVideoUrl = value;
        break;
      case 'about_text':
        settings.aboutText = value;
        break;
      case 'about_image_url':
        settings.aboutImageUrl = value;
        break;
      case 'about_title':
        settings.aboutTitle = value;
        break;
      case 'social_instagram':
        settings.socialInstagram = value;
        break;
      case 'social_vimeo':
        settings.socialVimeo = value;
        break;
      case 'social_imdb':
        settings.socialImdb = value;
        break;
      case 'social_linkedin':
        settings.socialLinkedin = value;
        break;
    }
  }

  return settings;
}
