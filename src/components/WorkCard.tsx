import Link from 'next/link';
import Image from 'next/image';
import type { Work } from '@/types';
import { getAspectRatioClass } from '@/lib/utils';

interface Props {
  work: Work;
}

export function WorkCard({ work }: Props) {
  const aspectClass = getAspectRatioClass(work.aspectRatio);
  const coverMedia = work.media[0];

  return (
    <Link href={`/works/${work.slug}`} className="work-grid-item group">
      <div className={`w-full ${aspectClass} bg-surface relative`}>
        {coverMedia ? (
          <Image
            src={coverMedia.url}
            alt={work.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-surface flex items-center justify-center">
            <span className="text-muted text-xs tracking-widest uppercase">No image</span>
          </div>
        )}
        <div className="work-hover-overlay">
          <div className="text-center px-8">
            <p className="text-white text-xs tracking-widest uppercase mb-2">{work.type}</p>
            <h2 className="text-white font-display font-light text-2xl md:text-3xl leading-tight">
              {work.title}
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
}
