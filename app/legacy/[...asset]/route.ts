import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';

const PROJECT_ROOT = path.resolve(process.cwd(), '..');

const MIME_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] ?? 'application/octet-stream';
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ asset: string[] }> }
) {
  const { asset } = await context.params;
  const relativePath = asset.join('/');
  const fullPath = path.resolve(PROJECT_ROOT, relativePath);

  if (!fullPath.startsWith(PROJECT_ROOT)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
    return new NextResponse('Not found', { status: 404 });
  }

  const file = fs.readFileSync(fullPath);

  return new NextResponse(file, {
    status: 200,
    headers: {
      'Content-Type': getMimeType(fullPath),
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
