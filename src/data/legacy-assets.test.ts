import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

function assetPath(assetUrl: string) {
  return path.resolve(process.cwd(), 'public', assetUrl.replace(/^\//, ''));
}

describe('legacy assets packaging', () => {
  it('packages representative legacy assets referenced by content for deployment', () => {
    const requiredAssets = [
      '/legacy/wp-content/uploads/2021/02/fusades-atasal-768x512.jpg',
      '/legacy/wp-content/uploads/2020/08/REVISTA-SUCROTECH-II-EDICION.jpg',
      '/legacy/wp-content/uploads/2020/07/Langosta-Centroamericana-Boletin-informativo-ATASAL-280720.pdf'
    ];

    for (const assetUrl of requiredAssets) {
      expect(fs.existsSync(assetPath(assetUrl)), `${assetUrl} is missing from public/legacy`).toBe(true);
    }
  });
});
