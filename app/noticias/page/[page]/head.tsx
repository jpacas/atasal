import { getPostsByPage } from '@/lib/content';

export default async function Head({
  params
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNumber = Number.parseInt(page, 10);

  if (!Number.isFinite(pageNumber) || pageNumber < 2) return null;

  const { totalPages } = getPostsByPage(pageNumber, 10);
  const prevHref = pageNumber > 2 ? `/noticias/page/${pageNumber - 1}/` : '/noticias/';
  const nextHref = pageNumber < totalPages ? `/noticias/page/${pageNumber + 1}/` : null;

  return (
    <>
      <link rel="prev" href={`https://www.atasal.org${prevHref}`} />
      {nextHref ? <link rel="next" href={`https://www.atasal.org${nextHref}`} /> : null}
    </>
  );
}
