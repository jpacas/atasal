import Link from 'next/link';
import type { ContentEntry } from '@/lib/content';
import { PostCard } from '@/components/ui/post-card';

interface PostArchiveProps {
  posts: ContentEntry[];
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export function PostArchive({
  posts,
  currentPage,
  totalPages,
  baseUrl = '/noticias'
}: PostArchiveProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <>
      <div className="post-list">
        {posts.map((post, index) => (
          <PostCard key={post.id} post={post} priority={index < 2 && currentPage === 1} />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="pagination">
          {prevPage ? (
            <Link href={prevPage === 1 ? baseUrl : `${baseUrl}/page/${prevPage}/`}>
              Anterior
            </Link>
          ) : null}
          <span>Página {currentPage} de {totalPages}</span>
          {nextPage ? (
            <Link href={`${baseUrl}/page/${nextPage}/`}>Siguiente</Link>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
