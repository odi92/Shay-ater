'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Work } from '@/types';
import { getAspectRatioClass, getVideoThumbnail } from '@/lib/utils';
import { VideoPlayer } from './VideoPlayer';

interface CarouselItem {
  type: 'image' | 'video';
  url: string;
  isExternal: boolean;
  thumbnail?: string;
}

interface Props {
  work: Work;
}

function buildCarouselItems(work: Work): CarouselItem[] {
  const items: CarouselItem[] = [];

  if (work.videoUrl) {
    items.push({
      type: 'video',
      url: work.videoUrl,
      isExternal: true,
      thumbnail: getVideoThumbnail(work.videoUrl) ?? undefined,
    });
  }

  const sorted = [...work.media].sort((a, b) => a.order - b.order);
  for (const m of sorted) {
    items.push({
      type: m.type,
      url: m.url,
      isExternal: false,
      thumbnail: m.thumbnail,
    });
  }

  return items;
}

function ThumbnailItem({
  item,
  onClick,
  isActive,
}: {
  item: CarouselItem;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative aspect-video overflow-hidden block w-full transition-opacity duration-200 ${
        isActive ? 'opacity-30 cursor-default' : 'opacity-60 hover:opacity-100'
      }`}
      aria-pressed={isActive}
    >
      {item.type === 'video' && item.isExternal ? (
        item.thumbnail ? (
          <Image
            src={item.thumbnail}
            alt="Video thumbnail"
            fill
            className="object-cover"
            sizes="33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-surface flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
              opacity={0.4}
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )
      ) : (
        <Image src={item.url} alt="" fill className="object-cover" sizes="33vw" />
      )}
    </button>
  );
}

function MainItem({ item, title }: { item: CarouselItem; title: string }) {
  if (item.type === 'video' && item.isExternal) {
    return <VideoPlayer url={item.url} title={title} className="absolute inset-0" />;
  }
  if (item.type === 'image') {
    return (
      <Image
        src={item.url}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 80vw"
        priority
      />
    );
  }
  return (
    <video
      src={item.url}
      controls
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

export function WorkCarousel({ work }: Props) {
  const items = buildCarouselItems(work);
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) {
    return (
      <div className="w-full aspect-video bg-surface flex items-center justify-center">
        <p className="text-muted text-sm tracking-widest uppercase">No media available</p>
      </div>
    );
  }

  const mainItem = items[activeIndex];
  const aspectClass = getAspectRatioClass(work.aspectRatio);

  const otherItems = items
    .map((item, idx) => ({ item, idx }))
    .filter(({ idx }) => idx !== activeIndex);

  return (
    <div className="w-full">
      {/* Main display */}
      <div className={`w-full ${aspectClass} relative bg-surface`}>
        {mainItem !== undefined && <MainItem item={mainItem} title={work.title} />}
      </div>

      {/* Thumbnail grid — 3 per row */}
      {otherItems.length > 0 && (
        <div className="grid grid-cols-3 gap-1 mt-1">
          {otherItems.map(({ item, idx }) => (
            <ThumbnailItem
              key={idx}
              item={item}
              onClick={() => setActiveIndex(idx)}
              isActive={idx === activeIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
}
