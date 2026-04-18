'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
  };

  return (
    <form className={compact ? 'search-form compact' : 'search-form'} onSubmit={onSubmit} role="search">
      <label htmlFor="site-search" className="sr-only">
        Buscar contenido
      </label>
      <input
        id="site-search"
        type="search"
        name="q"
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar…"
      />
      <button type="submit">Buscar</button>
    </form>
  );
}
