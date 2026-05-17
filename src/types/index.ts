export type AspectRatio = '16:9' | '1:2.35' | '4:3';
export type MediaItemType = 'image' | 'video';

export type WorkCredits = {
  director?: string;
  colorGrading?: string;
  gaffer?: string;
  artDirector?: string;
  producer?: string;
  additionalFilming?: string;
};

export interface WorkMedia {
  type: MediaItemType;
  url: string;
  order: number;
  thumbnail?: string;
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  type: string;
  description: string | null;
  aspectRatio: AspectRatio;
  videoUrl: string | null;
  videoThumbnailUrl: string | null;
  credits: WorkCredits;
  awards: string[] | null;
  festival: string | null;
  media: WorkMedia[];
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SiteSettings {
  homepageVideoUrl?: string;
  aboutText?: string;
  aboutImageUrl?: string;
  aboutTitle?: string;
  socialInstagram?: string;
  socialVimeo?: string;
  socialImdb?: string;
  socialLinkedin?: string;
}

export interface AiAction {
  action: 'create' | 'update' | 'delete' | 'none';
  workSlug?: string;
  fields?: Partial<{
    title: string;
    slug: string;
    type: string;
    description: string;
    aspectRatio: AspectRatio;
    videoUrl: string;
    credits: WorkCredits;
    awards: string[];
    festival: string;
    orderIndex: number;
  }>;
  message: string;
}
