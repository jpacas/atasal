import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { PostArchive } from '@/components/post-archive';
import { getPostsByPage } from '@/lib/content';
import { buildBreadcrumbItems, buildBreadcrumbSchema } from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const pageNumber = Number.parseInt(page, 10);
  if (!Number.isFinite(pageNumber) || pageNumber < 2) {
    return { title: 'Noticias' };
  }

  return {
    title: `Noticias - Pagina ${pageNumber}`,
    alternates: {
      canonical: `/noticias/page/${pageNumber}/`
    }
  };
}

export default async function NewsArchivePage({
  params
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNumber = Number.parseInt(page, 10);

  if (!Number.isFinite(pageNumber) || pageNumber < 2) notFound();

  const { items, page: current, totalPages } = getPostsByPage(pageNumber, 10);
  if (items.length === 0) notFound();

  const route = `/noticias/page/${current}/`;
  const breadcrumbs = buildBreadcrumbItems(route, `Pagina ${current}`);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <section className="stack">
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumbs items={breadcrumbs} />
      <header className="section-heading">
        <h1>Noticias - Página {current}</h1>
      </header>
      <PostArchive
        posts={items}
        currentPage={current}
        totalPages={totalPages}
      />
    </section>
  );
}
