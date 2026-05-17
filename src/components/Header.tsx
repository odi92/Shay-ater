'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/lets-talk', label: "Let's Talk" },
  { href: '/works', label: 'Selected Works' },
  { href: '/about', label: 'About' },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 10); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll only on mobile (sidebar takes full height)
  useEffect(() => {
    if (open && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      {/* Fixed header */}
      <div className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between transition-colors duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-sm' : ''}`}>
        <Link href="/" className="hover:opacity-70 transition-opacity">
          <span className="block font-sans font-bold text-[18px] text-white leading-tight">Shay Ater</span>
          <span className="block font-sans font-normal text-[15px] text-white leading-tight">Director of Photography</span>
        </Link>
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          className="flex flex-col gap-[5px] p-1 group"
        >
          <span className="block w-6 h-[1px] bg-white group-hover:opacity-60 transition-opacity" />
          <span className="block w-4 h-[1px] bg-white group-hover:opacity-60 transition-opacity" />
          <span className="block w-6 h-[1px] bg-white group-hover:opacity-60 transition-opacity" />
        </button>
      </div>

      {/* ── Mobile: left sidebar ── */}

      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-60 bg-black flex flex-col transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation sidebar"
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
          <span className="font-sans font-semibold text-sm text-white">Shay Ater</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="text-white/50 hover:text-white transition-colors p-1"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" />
              <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col px-6 pt-10 gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-sm text-white/70 hover:text-white transition-colors duration-200 py-3 border-b border-white/10 last:border-0"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Desktop: dropdown below hamburger ── */}

      {/* Click-outside layer */}
      <div
        className={`hidden md:block fixed inset-0 z-40 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Dropdown panel — right-aligned below the header */}
      <div
        className={`hidden md:flex fixed top-[72px] right-6 z-50 w-48 bg-black border border-white/10 flex-col transition-all duration-200 origin-top-right ${
          open ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'
        }`}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="font-sans text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-150 px-6 py-3 border-b border-white/10 last:border-0"
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
