import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), '..');
const WP_JSON = path.join(ROOT, 'wp-json', 'wp', 'v2');
const OUTPUT = path.join(process.cwd(), 'src', 'data', 'content.json');
const REDIRECTS_OUTPUT = path.join(process.cwd(), 'src', 'data', 'redirects.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readCollection(dirPath) {
  return fs
    .readdirSync(dirPath)
    .map((name) => path.join(dirPath, name))
    .filter((filePath) => fs.statSync(filePath).isFile())
    .map(readJson);
}

function ensureTrailingSlash(input) {
  if (!input) return '/';
  let value = input.startsWith('/') ? input : `/${input}`;
  if (!value.endsWith('/')) value = `${value}/`;
  value = value.replace(/\/+/g, '/');
  return value;
}

function routeFromLink(link) {
  const url = new URL(link);
  return ensureTrailingSlash(url.pathname);
}

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '-')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&nbsp;/g, ' ');
}

function localizeAssetUrl(rawUrl) {
  if (!rawUrl) return null;
  const decoded = decodeHtmlEntities(rawUrl.trim());
  if (!decoded) return null;

  try {
    const absolute = /^https?:\/\//i.test(decoded)
      ? new URL(decoded)
      : new URL(decoded, 'https://www.atasal.org/');

    if (
      /atasal\.org$/i.test(absolute.hostname) &&
      (absolute.pathname.startsWith('/wp-content/') || absolute.pathname.startsWith('/wp-includes/'))
    ) {
      return `/legacy${absolute.pathname}${absolute.search}${absolute.hash}`;
    }

    if (absolute.pathname.startsWith('/wp-content/') || absolute.pathname.startsWith('/wp-includes/')) {
      return `/legacy${absolute.pathname}${absolute.search}${absolute.hash}`;
    }
  } catch {
    if (decoded.startsWith('wp-content/') || decoded.startsWith('/wp-content/')) {
      return `/legacy/${decoded.replace(/^\/+/, '')}`;
    }
  }

  return decoded;
}

function readMirrorHtmlCandidates(item) {
  const candidates = [];

  if (item?.slug) {
    candidates.push(path.join(ROOT, item.slug, 'index.html'));
  }
  if (item?.id) {
    candidates.push(path.join(ROOT, `index.html?p=${item.id}.html`));
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return fs.readFileSync(candidate, 'utf8');
    }
  }
  return '';
}

function extractFeaturedImage(item) {
  const html = readMirrorHtmlCandidates(item);
  if (!html) return null;

  const wpImageTag = html.match(/<img[^>]*wp-post-image[^>]*>/i);
  if (wpImageTag?.[0]) {
    const src = wpImageTag[0].match(/src=(["'])(.*?)\1/i);
    if (src?.[2]) return localizeAssetUrl(src[2]);
  }

  const ogImage = html.match(/<meta[^>]+property=(["'])og:image\1[^>]+content=(["'])(.*?)\2/i);
  if (ogImage?.[3]) {
    return localizeAssetUrl(ogImage[3]);
  }

  const genericImage = html.match(/<img[^>]+src=(["'])(.*?)\1/i);
  if (genericImage?.[2]) {
    return localizeAssetUrl(genericImage[2]);
  }

  return null;
}

function buildFeaturedImageMap() {
  const map = new Map();
  const files = [];

  files.push(path.join(ROOT, 'index.html'));

  const pageDir = path.join(ROOT, 'page');
  if (fs.existsSync(pageDir) && fs.statSync(pageDir).isDirectory()) {
    for (const entry of fs.readdirSync(pageDir)) {
      const candidate = path.join(pageDir, entry, 'index.html');
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        files.push(candidate);
      }
    }
  }

  for (const filePath of files) {
    const html = fs.readFileSync(filePath, 'utf8');
    const articleRegex = /<article[^>]*\bpost-(\d+)\b[\s\S]*?<\/article>/gi;
    let match;
    while ((match = articleRegex.exec(html)) !== null) {
      const postId = match[1];
      const articleHtml = match[0];
      const imageTag = articleHtml.match(/<img[^>]*wp-post-image[^>]*>/i);
      const imageMatch = imageTag?.[0]?.match(/src=(["'])(.*?)\1/i);
      if (imageMatch?.[2] && !map.has(postId)) {
        const image = localizeAssetUrl(imageMatch[2]);
        if (image) map.set(postId, image);
      }
    }
  }

  return map;
}

function sanitizeFeaturedImage(value) {
  if (!value) return null;
  if (/\/atasal-logo\.png$/i.test(value)) return null;
  return value;
}

function extractFirstImageFromHtml(html) {
  if (!html) return null;
  const imageTag = html.match(/<img[^>]*>/i);
  if (!imageTag?.[0]) return null;
  const src = imageTag[0].match(/src=(["'])(.*?)\1/i);
  if (!src?.[2]) return null;
  return sanitizeFeaturedImage(localizeAssetUrl(src[2]));
}

function buildRouteResolver(posts, pages) {
  const byId = new Map();
  const byPath = new Map();

  for (const item of [...posts, ...pages]) {
    const route = routeFromLink(item.link);
    byId.set(String(item.id), route);
    byPath.set(route, route);
  }

  function resolveLegacyPath(pathname, search) {
    const parsedPath = decodeURIComponent(pathname);
    if (parsedPath === '/index.html' && search) {
      const params = new URLSearchParams(search);
      const raw = params.get('p');
      if (raw) {
        const id = raw.replace(/\.html$/i, '').trim();
        const route = byId.get(id);
        if (route) return route;
      }
    }

    if (parsedPath.startsWith('/index.html?p=')) {
      const id = parsedPath.replace('/index.html?p=', '').replace(/\.html$/i, '').trim();
      const route = byId.get(id);
      if (route) return route;
    }

    const clean = parsedPath.endsWith('/index.html')
      ? ensureTrailingSlash(parsedPath.slice(0, -'/index.html'.length))
      : ensureTrailingSlash(parsedPath.replace(/\.html$/i, ''));

    if (byPath.has(clean)) return clean;
    return clean;
  }

  return {
    byId,
    resolveLegacyPath
  };
}

function normalizeAssetPath(pathname, search) {
  const query = search || '';
  if (pathname.startsWith('/wp-content/') || pathname.startsWith('/wp-includes/')) {
    return `/legacy${pathname}${query}`;
  }
  return `${pathname}${query}`;
}

function rewriteHtml(html, resolver) {
  let rewritten = html.replace(/\b(href|src)=(["'])(.*?)\2/gi, (full, attr, quote, rawValue) => {
    const value = decodeHtmlEntities(rawValue.trim());

    if (!value) return full;
    if (/^(#|mailto:|tel:|data:|javascript:)/i.test(value)) return full;

    let url;
    try {
      if (/^https?:\/\//i.test(value)) {
        url = new URL(value);
      } else {
        url = new URL(value, 'https://www.atasal.org/');
      }
    } catch {
      return full;
    }

    if (!/atasal\.org$/i.test(url.hostname)) {
      return full;
    }

    const route = resolver.resolveLegacyPath(url.pathname, url.search);
    let nextValue = `${normalizeAssetPath(route, '')}${url.hash || ''}`;

    if (
      url.pathname.startsWith('/wp-content/') ||
      url.pathname.startsWith('/wp-includes/')
    ) {
      nextValue = `${normalizeAssetPath(url.pathname, url.search)}${url.hash || ''}`;
    }

    return `${attr}=${quote}${nextValue}${quote}`;
  });

  // Remove legacy comment prompts/login links from migrated HTML fragments.
  rewritten = rewritten.replace(
    /<p[^>]*class=(["'])must-log-in\1[\s\S]*?<\/p>/gi,
    ''
  );

  return rewritten;
}

function toEntry(item, kind, resolver, featuredMap) {
  const route = routeFromLink(item.link);
  const rawContent = item?.content?.rendered || '';
  const contentHtml = rewriteHtml(rawContent, resolver);
  const excerpt = stripTags(item?.excerpt?.rendered || rawContent).slice(0, 220);
  const title = decodeHtmlEntities(item?.title?.rendered || '');
  const contentWithAlt = contentHtml.replace(
    /<img([^>]*?)alt=(["'])\s*\2([^>]*?)>/gi,
    `<img$1alt="${
      title || 'ATASAL'
    }"$3>`
  );
  const featuredFromMapOrMeta =
    kind === 'post'
      ? sanitizeFeaturedImage(
          featuredMap.get(String(item.id)) || extractFeaturedImage(item)
        )
      : null;
  const featuredFromContent =
    kind === 'post' && !featuredFromMapOrMeta
      ? extractFirstImageFromHtml(contentWithAlt)
      : null;

  return {
    id: item.id,
    kind,
    route,
    slug: item.slug,
    title,
    contentHtml: contentWithAlt,
    excerpt,
    date: item.date || null,
    modified: item.modified || null,
    authorId: item.author || null,
    categoryIds: item.categories || [],
    tagIds: item.tags || [],
    parentId: item.parent || 0,
    featuredImage: featuredFromMapOrMeta || featuredFromContent
  };
}

function toTaxonomyEntry(item, kind) {
  return {
    id: item.id,
    kind,
    slug: item.slug,
    name: decodeHtmlEntities(item.name),
    route: routeFromLink(item.link),
    count: item.count || 0
  };
}

function main() {
  const posts = readCollection(path.join(WP_JSON, 'posts'));
  const pages = readCollection(path.join(WP_JSON, 'pages'));
  const categories = readCollection(path.join(WP_JSON, 'categories'));
  const tags = readCollection(path.join(WP_JSON, 'tags'));
  const users = readCollection(path.join(WP_JSON, 'users'));
  const featuredMap = buildFeaturedImageMap();

  const resolver = buildRouteResolver(posts, pages);

  const postEntries = posts
    .map((item) => toEntry(item, 'post', resolver, featuredMap))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const pageEntries = pages
    .map((item) => toEntry(item, 'page', resolver, featuredMap))
    .sort((a, b) => a.route.localeCompare(b.route));

  const categoryEntries = categories.map((item) => toTaxonomyEntry(item, 'category'));
  const tagEntries = tags.map((item) => toTaxonomyEntry(item, 'tag'));
  const authorEntries = users.map((item) => ({
    id: item.id,
    kind: 'author',
    slug: item.slug,
    name: decodeHtmlEntities(item.name),
    route: routeFromLink(item.link)
  }));

  const redirects = Object.fromEntries([...resolver.byId.entries()]);

  const site = {
    title: 'ATASAL',
    description: 'Asociacion de Tecnicos Azucareros de El Salvador',
    locale: 'es-SV'
  };

  const menu = [
    { label: 'Inicio', href: '/' },
    { label: 'Quienes somos', href: '/quienes-somos/' },
    { label: 'Noticias', href: '/noticias/' },
    { label: 'Clima', href: '/clima/' },
    { label: 'Buscar', href: '/buscar' }
  ];

  const data = {
    generatedAt: new Date().toISOString(),
    site,
    menu,
    redirects,
    posts: postEntries,
    pages: pageEntries,
    categories: categoryEntries,
    tags: tagEntries,
    authors: authorEntries
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
  fs.writeFileSync(REDIRECTS_OUTPUT, JSON.stringify(redirects, null, 2));
  console.log(`Contenido generado en ${OUTPUT}`);
  console.log(`Redirects generados en ${REDIRECTS_OUTPUT}`);
  console.log(`Posts: ${postEntries.length}, Paginas: ${pageEntries.length}, Tags: ${tagEntries.length}`);
}

main();
