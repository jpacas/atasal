import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import {
  findByRoute,
  getAuthorByRoute,
  getAuthorName,
  getCategoryByRoute,
  getCategoryNames,
  getPostsByAuthor,
  getPostsByCategory,
  getPostsByPage,
  getPostsByTag,
  getRelatedPosts,
  getPageChildren,
  getPageSiblings,
  getTagByRoute
} from '@/lib/content';
import { buildArticleSchema, buildBreadcrumbItems, buildBreadcrumbSchema } from '@/lib/seo';
import { PostCard } from '@/components/ui/post-card';
import { formatShortDate } from '@/lib/date';

function normalize(slug: string[]): string {
  return `/${slug.join('/')}/`;
}

function parseArchiveRoute(slug: string[]): number | null {
  if (slug.length === 2 && slug[0] === 'page') {
    const page = Number.parseInt(slug[1], 10);
    if (Number.isFinite(page) && page > 0) return page;
  }
  return null;
}

function normalizeTitle(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = normalize(slug);
  const entry = findByRoute(route);
  const title = entry ? entry.title : 'ATASAL';
  const description = entry?.excerpt || 'Asociacion de Tecnicos Azucareros de El Salvador';

  return {
    title,
    description,
    alternates: {
      canonical: route
    },
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'es_SV',
      url: route
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    }
  };
}

export default async function CatchAllPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const route = normalize(slug);

  if (route === '/publicaciones/' || route.startsWith('/publicaciones/')) {
    redirect('/noticias/');
  }

  if (route === '/temas/' || route.startsWith('/temas/')) {
    redirect('/noticias/');
  }

  const archivePage = parseArchiveRoute(slug);
  if (archivePage) {
    if (archivePage === 1) {
      redirect('/noticias/');
    }
    redirect(`/noticias/page/${archivePage}/`);
  }

  if (route === '/noticias/') {
    const { items, totalPages } = getPostsByPage(1, 10);
    const breadcrumbs = buildBreadcrumbItems(route, 'Noticias');
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
    return (
      <section className="stack">
        <JsonLd data={breadcrumbSchema} />
        <Breadcrumbs items={breadcrumbs} />
        <header className="section-heading">
          <h1>Noticias de ATASAL</h1>
          <p className="post-meta">Actualizaciones, actividades y comunicados de la asociacion.</p>
        </header>
        <div className="post-list">
          {items.map((post, index) => (
            <PostCard key={post.id} post={post} priority={index < 2} />
          ))}
        </div>
        {totalPages > 1 ? (
          <div className="pagination">
            <Link href="/noticias/page/2/">Siguiente</Link>
          </div>
        ) : null}
      </section>
    );
  }

  if (route === '/clima/') {
    const breadcrumbs = buildBreadcrumbItems(route, 'Clima');
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
    return (
      <section className="stack">
        <JsonLd data={breadcrumbSchema} />
        <Breadcrumbs items={breadcrumbs} />
        <article className="article">
          <h1>Clima</h1>
          <iframe
            title="Mapa meteorologico San Salvador"
            src="https://embed.windy.com/embed2.html?lat=13.6936&lon=-89.2182&detailLat=13.6936&detailLon=-89.2182&width=650&height=450&zoom=7&level=surface&overlay=wind&product=ecmwf"
            width="100%"
            height="450"
            loading="lazy"
          />
          <p>
            Enlaces utiles:{' '}
            <a href="https://www.accuweather.com/es/sv/san-salvador/52484/weather-forecast/52484" target="_blank" rel="noopener noreferrer">
              AccuWeather
            </a>{' '}
            ·{' '}
            <a href="https://www.weather.com/es-SV/tiempo/hoy/l/San+Salvador+El+Salvador" target="_blank" rel="noopener noreferrer">
              The Weather Channel
            </a>
          </p>
        </article>
      </section>
    );
  }

  const category = getCategoryByRoute(route);
  if (category) {
    const posts = getPostsByCategory(category.id);
    const breadcrumbs = buildBreadcrumbItems(route, category.name);
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
    return (
      <section>
        <JsonLd data={breadcrumbSchema} />
        <Breadcrumbs items={breadcrumbs} />
        <h1>{category.name}</h1>
        <div className="post-list">
          {posts.map((post) => (
            <article key={post.id} className="card">
              <h2>
                <Link href={post.route}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  const tag = getTagByRoute(route);
  if (tag) {
    const posts = getPostsByTag(tag.id);
    const breadcrumbs = buildBreadcrumbItems(route, `Etiqueta: ${tag.name}`);
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
    return (
      <section>
        <JsonLd data={breadcrumbSchema} />
        <Breadcrumbs items={breadcrumbs} />
        <h1>Etiqueta: {tag.name}</h1>
        <div className="post-list">
          {posts.map((post) => (
            <article key={post.id} className="card">
              <h2>
                <Link href={post.route}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  const author = getAuthorByRoute(route);
  if (author) {
    const posts = getPostsByAuthor(author.id);
    const breadcrumbs = buildBreadcrumbItems(route, `Autor: ${author.name}`);
    const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
    return (
      <section>
        <JsonLd data={breadcrumbSchema} />
        <Breadcrumbs items={breadcrumbs} />
        <h1>Autor: {author.name}</h1>
        <div className="post-list">
          {posts.map((post) => (
            <article key={post.id} className="card">
              <h2>
                <Link href={post.route}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  const entry = findByRoute(route);
  if (!entry) notFound();

  const categoryNames = getCategoryNames(entry.categoryIds);
  const breadcrumbs = buildBreadcrumbItems(route, entry.title);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
  const articleSchema = buildArticleSchema({
    title: entry.title,
    description: entry.excerpt,
    url: route,
    datePublished: entry.date,
    dateModified: entry.modified,
    authorName: getAuthorName(entry.authorId)
  });
  const isPost = entry.kind === 'post';
  const relatedPosts = isPost ? getRelatedPosts(entry.id, entry.categoryIds, 3) : [];
  const pageChildren = entry.kind === 'page' ? getPageChildren(entry.id) : [];
  const pageSiblings = entry.kind === 'page' ? getPageSiblings(entry) : [];
  const isAboutRoot = route === '/quienes-somos/';
  const atasalSection = isAboutRoot ? findByRoute('/quienes-somos/atasal/') : null;
  const atasalChildren = atasalSection ? getPageChildren(atasalSection.id) : [];
  const aboutHighlights = (() => {
    if (!isAboutRoot) return [];
    const allPages = [...pageChildren, ...atasalChildren];
    const byTitle = new Map(allPages.map((page) => [normalizeTitle(page.title), page]));
    const order = ['antecedentes', 'presidentes', 'mision', 'vision', 'junta directiva'];
    return order
      .map((title) => byTitle.get(title))
      .filter((page): page is (typeof allPages)[number] => Boolean(page));
  })();

  return (
    <article className="article">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={articleSchema} />
      <Breadcrumbs items={breadcrumbs} />
      <h1>{entry.title}</h1>
      {entry.featuredImage ? (
        <img src={entry.featuredImage} alt={entry.title} className="article-cover" width={1200} height={800} />
      ) : null}
      <p className="post-meta">
        {entry.date ? formatShortDate(entry.date.slice(0, 10)) : 'Sin fecha'} · {getAuthorName(entry.authorId)}
      </p>
      <p className="post-meta">{isPost ? 'Noticia' : 'Pagina institucional'}</p>
      {categoryNames.length > 0 ? <p className="post-meta">{categoryNames.join(', ')}</p> : null}
      {isPost ? (
        <div className="share-row">
          <span className="post-meta">Compartir:</span>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.atasal.org${route}`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${entry.title} https://www.atasal.org${route}`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <a href={`mailto:?subject=${encodeURIComponent(entry.title)}&body=${encodeURIComponent(`https://www.atasal.org${route}`)}`}>
            Email
          </a>
        </div>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: entry.contentHtml }} />

      {isAboutRoot ? (
        <section className="about-hub">
          {aboutHighlights.length > 0 ? (
            <>
              <h2>Secciones destacadas</h2>
              <div className="about-highlight-grid">
                {aboutHighlights.map((page) => (
                  <Link key={page.id} href={page.route} className="about-link-card">
                    <h3>{page.title}</h3>
                    <p>Ir a esta seccion</p>
                  </Link>
                ))}
              </div>
            </>
          ) : null}

          {pageChildren.length > 0 ? (
            <>
              <h2>Explorar Quienes Somos</h2>
              <div className="about-tree-grid">
                {pageChildren.map((page) => (
                  <section key={page.id} className="about-tree-card">
                    <h3>
                      <Link href={page.route}>{page.title}</Link>
                    </h3>
                    {page.id === atasalSection?.id && atasalChildren.length > 0 ? (
                      <ul>
                        {atasalChildren.map((child) => (
                          <li key={child.id}>
                            <Link href={child.route}>{child.title}</Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}
              </div>
            </>
          ) : null}
        </section>
      ) : null}

      {relatedPosts.length > 0 ? (
        <section className="related-block">
          <h2>Noticias relacionadas</h2>
          <ul>
            {relatedPosts.map((post) => (
              <li key={post.id}>
                <Link href={post.route}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {pageChildren.length > 0 && !isAboutRoot ? (
        <section className="related-block">
          <h2>Subsecciones</h2>
          <ul>
            {pageChildren.map((page) => (
              <li key={page.id}>
                <Link href={page.route}>{page.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {pageSiblings.length > 0 && !isAboutRoot ? (
        <section className="related-block">
          <h2>Tambien en esta seccion</h2>
          <ul>
            {pageSiblings.map((page) => (
              <li key={page.id}>
                <Link href={page.route}>{page.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
