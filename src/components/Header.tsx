'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/works', label: 'Works' },
  { href: '/about', label: 'About' },
  { href: '/lets-talk', label: "Let's Talk" },
] as const;

export function Header() {
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 h-16 flex items-center justify-between px-8 md:px-12 transition-colors duration-300 ${
          scrolled || !isHomepage ? 'bg-background/95 backdrop-blur-sm' : 'bg-transparent'
        }`}
      >
        <Link
          href="/"
          className="text-white text-xs tracking-ultra uppercase font-sans font-light hover:opacity-70 transition-opacity duration-200"
        >
          Shay Ater
        </Link>

        {isHomepage ? (
          <nav className="flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}
          </nav>
        ) : (
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="flex flex-col gap-[5px] p-1 group"
          >
            <span className="block w-6 h-[1px] bg-white group-hover:opacity-60 transition-opacity" />
            <span className="block w-4 h-[1px] bg-white group-hover:opacity-60 transition-opacity" />
            <span className="block w-6 h-[1px] bg-white group-hover:opacity-60 transition-opacity" />
          </button>
        )}
      </header>

      {/* Sidebar backdrop */}
      {!isHomepage && (
        <div
          className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      {!isHomepage && (
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-background flex flex-col transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label="Navigation sidebar"
        >
          <div className="flex items-center justify-between px-8 h-16 border-b border-border">
            <Link
              href="/"
              className="text-white text-xs tracking-ultra uppercase font-sans font-light"
              onClick={() => setSidebarOpen(false)}
            >
              Shay Ater
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close navigation menu"
              className="text-secondary hover:text-white transition-colors p-1"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" />
                <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col px-8 pt-12 gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="sidebar-link"
                onClick={() => setSidebarOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
