import fs from 'node:fs';
import path from 'node:path';

export type EntryKind = 'post' | 'page';

export interface ContentEntry {
  id: number;
  kind: EntryKind;
  route: string;
  slug: string;
  title: string;
  contentHtml: string;
  excerpt: string;
  date: string | null;
  modified: string | null;
  authorId: number | null;
  categoryIds: number[];
  tagIds: number[];
  parentId: number;
  featuredImage?: string | null;
}

export interface TaxonomyEntry {
  id: number;
  kind: 'category' | 'tag';
  slug: string;
  name: string;
  route: string;
  count: number;
}

export interface AuthorEntry {
  id: number;
  kind: 'author';
  slug: string;
  name: string;
  route: string;
}

interface ContentData {
  generatedAt: string;
  site: { title: string; description: string; locale: string };
  menu: Array<{ label: string; href: string }>;
  redirects: Record<string, string>;
  posts: ContentEntry[];
  pages: ContentEntry[];
  categories: TaxonomyEntry[];
  tags: TaxonomyEntry[];
  authors: AuthorEntry[];
}

interface ContentIndexes {
  routeIndex: Map<string, ContentEntry>;
  categoryIndex: Map<number, ContentEntry[]>;
  tagIndex: Map<number, ContentEntry[]>;
  authorIndex: Map<number, ContentEntry[]>;
}

let cache: ContentData | null = null;
let indexes: ContentIndexes | null = null;

const juntaDirectivaOverride = `
<div class="rich-panel">
  <p><strong>Referencia institucional recuperada del archivo de ATASAL.</strong> La integración siguiente corresponde a la elección reportada para el período 2019 - 2021.</p>
  <table>
    <tbody>
      <tr><td>Presidente</td><td>Ing. Carlos Rafael Morales (Ingenio El Ángel)</td></tr>
      <tr><td>Vicepresidente</td><td>Ing. José Ernesto Abrego Novoa (Ingenio La Magdalena)</td></tr>
      <tr><td>Secretario</td><td>Ing. Wilfredo Ernesto Parada (Ingenio Chaparrastique)</td></tr>
      <tr><td>Prosecretario</td><td>Ing. Salvador Flores Claros (Ingenio El Ángel)</td></tr>
      <tr><td>Tesorero</td><td>Ing. José Ernesto Pacas Vilanova (Ingenio La Cabaña)</td></tr>
      <tr><td>Protesorero</td><td>Ing. Víctor Manuel López García (Ingenio El Ángel)</td></tr>
      <tr><td>Síndico</td><td>Dr. Julian Vélez Guillen (Grupo Cassa)</td></tr>
      <tr><td>Primer vocal</td><td>Ing. Daniel Ernesto Arriola Castillo (Ingenio El Ángel)</td></tr>
      <tr><td>Segundo vocal</td><td>Ing. Ivan Betancourt (Grupo Cassa)</td></tr>
      <tr><td>Tercer vocal</td><td>Ing. José Salvador Berrios Serpas (Ingenio Jiboa)</td></tr>
      <tr><td>Cuarto vocal</td><td>Ing. Mario Clímaco (Grupo Cassa)</td></tr>
    </tbody>
  </table>
  <p>Para confirmar integraciones posteriores o datos vigentes, utilice la sección de contacto institucional.</p>
</div>
`;

const associationsNotice = `
<blockquote>
  <p><strong>Nota editorial:</strong> esta página conserva datos históricos de asociaciones hermanas. Para el contacto vigente de ATASAL utilice la sección <a href="/contacto/">Contacto</a>.</p>
</blockquote>
`;

export function sanitizeLegacyContent(html: string): string {
  return html
    .replace(/<p>\s*\[table id=\d+\s*\/\]\s*<\/p>/gi, '')
    .replace(/\[table id=\d+\s*\/\]/gi, '')
    .replace(/\[siteorigin_widget[^\]]*\][\s\S]*?\[\/siteorigin_widget\]/gi, '')
    .replace(/\[[a-z_]+[^\]]*\]/gi, '')
    .replace(/\[\/[a-z_]+\]/gi, '')
    .replace(/<p>\s*&nbsp;\s*<\/p>/gi, '')
    .trim();
}

function applyEntryOverrides(entry: ContentEntry): ContentEntry {
  const normalized = {
    ...entry,
    contentHtml: sanitizeLegacyContent(entry.contentHtml)
  };

  if (entry.route === '/quienes-somos/atasal/junta-directiva/') {
    return {
      ...normalized,
      excerpt: 'Junta Directiva 2019 - 2021 recuperada del archivo institucional de ATASAL.',
      contentHtml: `
<h2>Junta Directiva 2019 - 2021</h2>
<p>Esta sección se curó a partir del archivo institucional disponible en el respaldo del sitio.</p>
${juntaDirectivaOverride}
      `.trim()
    };
  }

  if (entry.route === '/quienes-somos/asociaciones/') {
    return {
      ...normalized,
      contentHtml: `${associationsNotice}\n${normalized.contentHtml}`
    };
  }

  return normalized;
}

function loadData(): ContentData {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), 'src', 'data', 'content.json');
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as ContentData;
  cache = {
    ...parsed,
    posts: parsed.posts.map(applyEntryOverrides),
    pages: parsed.pages.map(applyEntryOverrides)
  };
  return cache;
}

function buildIndexes(data: ContentData): ContentIndexes {
  if (indexes) return indexes;

  const routeIndex = new Map<string, ContentEntry>();
  const categoryIndex = new Map<number, ContentEntry[]>();
  const tagIndex = new Map<number, ContentEntry[]>();
  const authorIndex = new Map<number, ContentEntry[]>();

  // Index posts and pages by route
  for (const entry of [...data.posts, ...data.pages]) {
    routeIndex.set(entry.route, entry);
  }

  // Index posts by category
  for (const post of data.posts) {
    for (const catId of post.categoryIds) {
      if (!categoryIndex.has(catId)) {
        categoryIndex.set(catId, []);
      }
      categoryIndex.get(catId)!.push(post);
    }

    // Index by tag
    for (const tagId of post.tagIds) {
      if (!tagIndex.has(tagId)) {
        tagIndex.set(tagId, []);
      }
      tagIndex.get(tagId)!.push(post);
    }

    // Index by author
    if (post.authorId) {
      if (!authorIndex.has(post.authorId)) {
        authorIndex.set(post.authorId, []);
      }
      authorIndex.get(post.authorId)!.push(post);
    }
  }

  indexes = { routeIndex, categoryIndex, tagIndex, authorIndex };
  return indexes;
}

function normalizePath(input: string): string {
  if (!input) return '/';
  let value = input.startsWith('/') ? input : `/${input}`;
  if (!value.endsWith('/')) value = `${value}/`;
  value = value.replace(/\/+/g, '/');
  return value;
}

export function getSiteData() {
  return loadData();
}

export function getMenu() {
  return loadData().menu;
}

export function findByRoute(route: string): ContentEntry | null {
  const normalized = normalizePath(route);
  const data = loadData();
  const idx = buildIndexes(data);
  return idx.routeIndex.get(normalized) ?? null;
}

export function getAllEntries(): ContentEntry[] {
  const data = loadData();
  return [...data.pages, ...data.posts];
}

export function getLatestPosts(limit = 10): ContentEntry[] {
  return loadData().posts.slice(0, limit);
}

export function getPostsByPage(pageNumber: number, pageSize = 10): {
  items: ContentEntry[];
  page: number;
  totalPages: number;
} {
  const allPosts = loadData().posts;
  const totalPages = Math.max(1, Math.ceil(allPosts.length / pageSize));
  const page = Math.min(Math.max(pageNumber, 1), totalPages);
  const start = (page - 1) * pageSize;
  return {
    items: allPosts.slice(start, start + pageSize),
    page,
    totalPages
  };
}

export function getCategoryByRoute(route: string): TaxonomyEntry | null {
  const normalized = normalizePath(route);
  return loadData().categories.find((category) => category.route === normalized) ?? null;
}

export function getTagByRoute(route: string): TaxonomyEntry | null {
  const normalized = normalizePath(route);
  return loadData().tags.find((tag) => tag.route === normalized) ?? null;
}

export function getAuthorByRoute(route: string): AuthorEntry | null {
  const normalized = normalizePath(route);
  return loadData().authors.find((author) => author.route === normalized) ?? null;
}

export function getPostsByCategory(categoryId: number): ContentEntry[] {
  const data = loadData();
  const idx = buildIndexes(data);
  return idx.categoryIndex.get(categoryId) ?? [];
}

export function getPostsByTag(tagId: number): ContentEntry[] {
  const data = loadData();
  const idx = buildIndexes(data);
  return idx.tagIndex.get(tagId) ?? [];
}

export function getPostsByAuthor(authorId: number): ContentEntry[] {
  const data = loadData();
  const idx = buildIndexes(data);
  return idx.authorIndex.get(authorId) ?? [];
}

export function searchEntries(query: string, limit = 30): ContentEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllEntries()
    .filter((entry) => {
      const haystack = `${entry.title} ${entry.excerpt}`.toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, limit);
}

export function getAuthorName(authorId: number | null): string {
  if (authorId == null) return 'ATASAL';
  const author = loadData().authors.find((item) => item.id === authorId);
  return author?.name ?? 'ATASAL';
}

export function getCategoryNames(ids: number[]): string[] {
  const categories = loadData().categories;
  return ids
    .map((id) => categories.find((category) => category.id === id)?.name)
    .filter((name): name is string => Boolean(name));
}

export function getRelatedPosts(
  currentPostId: number,
  categoryIds: number[],
  limit = 3
): ContentEntry[] {
  if (categoryIds.length === 0) return [];
  return loadData().posts
    .filter((post) => post.id !== currentPostId)
    .filter((post) => post.categoryIds.some((categoryId) => categoryIds.includes(categoryId)))
    .slice(0, limit);
}

export function getPageChildren(parentId: number): ContentEntry[] {
  return loadData().pages
    .filter((page) => page.parentId === parentId)
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getPageSiblings(current: ContentEntry): ContentEntry[] {
  if (current.kind !== 'page') return [];
  return loadData().pages
    .filter((page) => page.parentId === current.parentId)
    .filter((page) => page.id !== current.id)
    .sort((a, b) => a.title.localeCompare(b.title));
}
