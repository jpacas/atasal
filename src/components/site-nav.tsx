'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
}

export function SiteNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const normalize = (path: string) => (path === '/' ? '/' : path.replace(/\/$/, '') + '/');
  const normalizedPathname = normalize(pathname);

  return (
    <>
      <button
        className="nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="primary-navigation"
        aria-label="Menú de navegación"
      >
        <span className="hamburger" aria-hidden="true"></span>
      </button>

      <nav
        id="primary-navigation"
        className={`menu ${isOpen ? 'open' : ''}`}
        aria-label="Principal"
      >
        {items.map((item) => {
          const isActive = item.href === '/'
            ? normalizedPathname === '/'
            : normalizedPathname.startsWith(normalize(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? 'active' : ''}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
