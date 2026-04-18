import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import redirects from './src/data/redirects.json';

function extractIdFromLegacyPath(pathname: string): string | null {
  const decoded = decodeURIComponent(pathname);
  if (decoded.startsWith('/index.html?p=')) {
    return decoded.replace('/index.html?p=', '').replace(/\.html$/i, '').trim();
  }
  return null;
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  const p = url.searchParams.get('p');
  if (p) {
    const id = p.replace(/\.html$/i, '').trim();
    const destination = redirects[id as keyof typeof redirects];
    if (destination) {
      url.pathname = destination;
      url.search = '';
      return NextResponse.redirect(url, 308);
    }
  }

  const idFromPath = extractIdFromLegacyPath(url.pathname);
  if (idFromPath) {
    const destination = redirects[idFromPath as keyof typeof redirects];
    if (destination) {
      url.pathname = destination;
      url.search = '';
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|legacy).*)']
};
