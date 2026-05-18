'use client';

import { useState, useRef } from 'react';
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

function AmbientPlayer({ src, title, className }: { src: string; title?: string; className?: string }) {
  const [muted, setMuted] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function toggleMute() {
    const fn = muted ? 'unMute' : 'mute';
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: fn, args: [] }),
      '*'
    );
    setMuted((prev) => !prev);
  }

  return (
    <div className={`relative w-full h-full ${className ?? ''}`}>
      <iframe
        ref={iframeRef}
        src={src}
        allow="autoplay; fullscreen"
        className="w-full h-full"
        title={title ?? 'Video'}
      />
      {/* Blocks iframe UI — sits below the mute button */}
      <div className="absolute inset-0" aria-hidden="true" />
      {/* Mute toggle — above the overlay */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        className="absolute bottom-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-200"
      >
        {muted ? (
          /* Speaker with X */
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
        ) : (
          /* Speaker with waves */
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export function VideoPlayer({ url, title, className = '', autoplayOnLoad = false, poster, ambient = false }: Props) {
  const [playing, setPlaying] = useState(autoplayOnLoad);
  const embedUrl = getVideoEmbedUrl(url);
  const thumbnail = poster ?? getVideoThumbnail(url);

  if (ambient && embedUrl) {
    const ytIdMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const ytId = ytIdMatch?.[1];
    const ambientSrc = ytId
      ? `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${ytId}&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&enablejsapi=1`
      : `${embedUrl}&autoplay=1&mute=1&controls=0&loop=1&rel=0&enablejsapi=1`;
    return <AmbientPlayer src={ambientSrc} title={title} className={className} />;
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
          <svg width="18" height="18" viewBox="0 0 18 18" fill="white" className="ml-1" aria-hidden="true">
            <path d="M4 2l12 7-12 7V2z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
