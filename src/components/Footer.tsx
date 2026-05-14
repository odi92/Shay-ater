import type { SiteSettings } from '@/types';

interface Props {
  settings?: SiteSettings;
}

export function Footer(_props: Props) {
  return (
    <footer className="w-full py-6 px-6 flex items-center justify-between bg-black">
      <div className="flex flex-col gap-0.5">
        <span className="font-sans font-semibold text-sm text-white">Shay Ater</span>
        <span className="font-sans text-xs text-white/50">Director of Photography</span>
      </div>

      {/* Hamburger icon (decorative on footer — navigation is in Header) */}
      <div className="flex flex-col gap-[5px] p-1 opacity-40">
        <span className="block w-6 h-[1px] bg-white" />
        <span className="block w-4 h-[1px] bg-white" />
        <span className="block w-6 h-[1px] bg-white" />
      </div>
    </footer>
  );
}
