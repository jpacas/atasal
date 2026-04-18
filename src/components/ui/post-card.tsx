import Link from 'next/link';
import type { ContentEntry } from '@/lib/content';
import { getAuthorName } from '@/lib/content';

interface PostCardProps {
  post: ContentEntry;
  priority?: boolean;
}

export function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <article className="card card-post">
      {post.featuredImage ? (
        <Link
          href={post.route}
          className="card-image-link"
          aria-label={`Imagen de ${post.title}`}
        >
          <img
            src={post.featuredImage}
            alt={post.title}
            className="card-image"
            width={960}
            height={640}
            loading={priority ? 'eager' : 'lazy'}
          />
        </Link>
      ) : (
        <Link
          href={post.route}
          className="card-image-link"
          aria-label={`Ir a ${post.title}`}
        >
          <div className="card-image-placeholder">
            <span>ATASAL</span>
          </div>
        </Link>
      )}

      <div className="card-post-content">
        <h2>
          <Link href={post.route}>{post.title}</Link>
        </h2>
        <p className="post-meta">
          {post.date ? new Intl.DateTimeFormat('es-SV').format(new Date(post.date)) : 'Sin fecha'} · {getAuthorName(post.authorId)}
        </p>
        <p>{post.excerpt}</p>
        <Link href={post.route}>Leer más</Link>
      </div>
    </article>
  );
}
