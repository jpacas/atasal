import type { BreadcrumbItem } from '@/components/breadcrumbs';

export function buildBreadcrumbItems(route: string, title?: string): BreadcrumbItem[] {
  const normalized = route.startsWith('/') ? route : `/${route}`;
  const cleaned = normalized.endsWith('/') ? normalized : `${normalized}/`;

  if (cleaned === '/') {
    return [{ label: 'Inicio', href: '/' }];
  }

  const parts = cleaned.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: 'Inicio', href: '/' }];

  let acc = '';
  for (let i = 0; i < parts.length; i += 1) {
    acc += `/${parts[i]}`;
    const href = `${acc}/`;
    const fallbackLabel = decodeURIComponent(parts[i]).replace(/-/g, ' ');
    const label = i === parts.length - 1 && title ? title : toTitle(fallbackLabel);
    items.push({ label, href });
  }

  return items;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `https://www.atasal.org${item.href}`
    }))
  };
}

export function buildArticleSchema(input: {
  title: string;
  description: string;
  url: string;
  datePublished?: string | null;
  dateModified?: string | null;
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished || undefined,
    dateModified: input.dateModified || input.datePublished || undefined,
    url: `https://www.atasal.org${input.url}`,
    author: {
      '@type': 'Person',
      name: input.authorName || 'ATASAL'
    },
    publisher: {
      '@type': 'Organization',
      name: 'ATASAL'
    }
  };
}

function toTitle(value: string): string {
  if (!value) return value;
  return value
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
