import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { buildBreadcrumbItems, buildBreadcrumbSchema } from '@/lib/seo';
import { searchEntries } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Buscar',
  alternates: {
    canonical: '/buscar'
  }
};

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q || '').trim();
  const results = query ? searchEntries(query, 50) : [];

  const breadcrumbs = buildBreadcrumbItems('/buscar/', 'Buscar');
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <section className="stack">
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumbs items={breadcrumbs} />
      <h1>Buscar</h1>
      {query ? (
        <p className="post-meta">
          {results.length} resultado(s) para "{query}"
        </p>
      ) : (
        <div className="empty-state">
          <p className="post-meta">Escribe un termino en el buscador superior.</p>
          <p>Prueba con: <strong>zafra</strong>, <strong>congreso</strong>, <strong>sucrotech</strong>.</p>
        </div>
      )}

      {results.length > 0 ? (
        <div className="post-list">
          {results.map((entry) => (
            <article key={`${entry.kind}-${entry.id}`} className="card">
              <h2>
                <Link href={entry.route}>{entry.title}</Link>
              </h2>
              <p className="post-meta">{entry.kind === 'post' ? 'Noticia' : 'Pagina'}</p>
              <p>{entry.excerpt}</p>
            </article>
          ))}
        </div>
      ) : query ? (
        <div className="empty-state">
          <p>No encontramos coincidencias para “{query}”.</p>
          <p>Intenta con terminos mas cortos o sin acentos.</p>
        </div>
      ) : null}
    </section>
  );
}
