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
  aspectClass,
}: {
  item: CarouselItem;
  onClick: () => void;
  isActive: boolean;
  aspectClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative ${aspectClass} overflow-hidden block w-full transition-opacity duration-200 ${
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
            sizes="25vw"
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
        <Image src={item.url} alt="" fill className="object-cover" sizes="25vw" />
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
        sizes="(max-width: 768px) 100vw, 66vw"
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
      {/* Desktop: side-by-side. Mobile: stacked */}
      <div className="flex flex-col md:flex-row gap-2">
        {/* Main display */}
        <div className={`flex-1 md:w-2/3 ${aspectClass} relative bg-surface`}>
          {mainItem !== undefined && <MainItem item={mainItem} title={work.title} />}
        </div>

        {/* Thumbnails */}
        {otherItems.length > 0 && (
          <>
            {/* Desktop: stacked column on right */}
            <div className="hidden md:flex flex-col gap-2 w-1/3">
              {otherItems.map(({ item, idx }) => (
                <ThumbnailItem
                  key={idx}
                  item={item}
                  onClick={() => setActiveIndex(idx)}
                  isActive={idx === activeIndex}
                  aspectClass={aspectClass}
                />
              ))}
            </div>

            {/* Mobile: 2-column grid below */}
            <div className="grid grid-cols-2 gap-1 md:hidden">
              {otherItems.map(({ item, idx }) => (
                <ThumbnailItem
                  key={idx}
                  item={item}
                  onClick={() => setActiveIndex(idx)}
                  isActive={idx === activeIndex}
                  aspectClass={aspectClass}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
