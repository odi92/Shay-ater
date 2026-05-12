import type { WorkCredits } from '@/types';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getVideoEmbedUrl(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  const ytId = ytMatch?.[1];
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/([0-9]+)/);
  const vimeoId = vimeoMatch?.[1];
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?dnt=1&title=0&byline=0&portrait=0`;
  }

  return null;
}

export function getVideoThumbnail(url: string): string | null {
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  const ytId = ytMatch?.[1];
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }
  return null;
}

export function getAspectRatioClass(ratio: string): string {
  switch (ratio) {
    case '16:9':
      return 'aspect-video';
    case '1:2.35':
      return 'aspect-cinema';
    case '4:3':
      return 'aspect-classic';
    default:
      return 'aspect-video';
  }
}

export function formatCredits(
  credits: WorkCredits
): Array<{ label: string; value: string }> {
  const entries = [
    { label: 'Director', value: credits.director },
    { label: 'Colour Grading', value: credits.colorGrading },
    { label: 'Gaffer', value: credits.gaffer },
    { label: 'Art Director', value: credits.artDirector },
    { label: 'Producer', value: credits.producer },
    { label: 'Additional Filming', value: credits.additionalFilming },
  ];

  return entries.filter(
    (e): e is { label: string; value: string } =>
      typeof e.value === 'string' && e.value.length > 0
  );
}
