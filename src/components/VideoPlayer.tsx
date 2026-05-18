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
  ambient?: boolean;
}

export function VideoPlayer({ url, title, className = '', autoplayOnLoad = false, poster, ambient = false }: Props) {
  const [playing, setPlaying] = useState(autoplayOnLoad);
  const embedUrl = getVideoEmbedUrl(url);
  const thumbnail = poster ?? getVideoThumbnail(url);

  // Ambient mode: muted autoloop with no controls, no interaction
  if (ambient && embedUrl) {
    // Extract video ID for the `playlist` param YouTube needs for looping
    const ytIdMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const ytId = ytIdMatch?.[1];
    const ambientSrc = ytId
      ? `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`
      : `${embedUrl}&autoplay=1&mute=1&controls=0&loop=1&rel=0`;
    return (
      <div className={`relative w-full h-full ${className}`}>
        <iframe
          src={ambientSrc}
          allow="autoplay; fullscreen"
          className="w-full h-full"
          title={title ?? 'Video'}
        />
        {/* Transparent overlay blocks player UI interaction */}
        <div className="absolute inset-0" aria-hidden="true" />
      </div>
    );
  }

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
