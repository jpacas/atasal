import type { MetadataRoute } from 'next';
import { getPostsByPage, getSiteData } from '@/lib/content';
import { activities, events } from '@/lib/site-content';

export default function sitemap(): MetadataRoute.Sitemap {
  const data = getSiteData();
  const base = 'https://www.atasal.org';
  const { totalPages } = getPostsByPage(1, 10);
  const newsPages =
    totalPages > 1
      ? Array.from({ length: totalPages - 1 }, (_, index) => `/noticias/page/${index + 2}/`)
      : [];

  const routes = [
    ...data.pages.map((p) => p.route),
    ...data.posts.map((p) => p.route),
    ...data.categories.map((c) => c.route),
    ...data.tags.map((t) => t.route),
    ...data.authors.map((a) => a.route),
    ...newsPages,
    ...events.map((event) => `/eventos/${event.slug}/`),
    ...activities.map((activity) => `/actividades/${activity.slug}/`),
    '/atasal/',
    '/actividades/',
    '/hazte-socio/',
    '/contacto/',
    '/buscar',
    '/'
  ];

  const unique = [...new Set(routes)];
  return unique.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(data.generatedAt)
  }));
}
