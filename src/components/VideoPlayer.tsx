'use client';

import { useState } from 'react';
import { getVideoEmbedUrl, getVideoThumbnail } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  url: string;
  title?: string;
  className?: string;
  autoplayOnLoad?: boolean;
  poster?: string | null;
}

export function VideoPlayer({ url, title, className = '', autoplayOnLoad = false, poster }: Props) {
  const [playing, setPlaying] = useState(autoplayOnLoad);
  const embedUrl = getVideoEmbedUrl(url);
  const thumbnail = poster ?? getVideoThumbnail(url);

  if (!embedUrl) {
    return (
      <video
        src={url}
        controls
        className={`w-full h-full object-cover ${className}`}
        title={title}
      />
    );
  }

  if (playing) {
    return (
      <iframe
        src={`${embedUrl}&autoplay=1`}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className={`w-full h-full ${className}`}
        title={title ?? 'Video'}
      />
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className={`relative w-full h-full block group ${className}`}
      aria-label={`Play ${title ?? 'video'}`}
    >
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={title ?? 'Video thumbnail'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
        />
      ) : (
        <div className="absolute inset-0 bg-surface" />
      )}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors duration-200">
        <div className="w-16 h-16 rounded-full border border-white/70 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="white"
            className="ml-1"
            aria-hidden="true"
          >
            <path d="M4 2l12 7-12 7V2z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
