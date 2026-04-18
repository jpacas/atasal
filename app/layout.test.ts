import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const layoutSource = fs.readFileSync(path.resolve(__dirname, './layout.tsx'), 'utf8');

describe('RootLayout source', () => {
  it('removes the top header strip and brand copy from the navbar', () => {
    expect(layoutSource).not.toContain('className="header-strip"');
    expect(layoutSource).not.toContain('className="brand-copy"');
    expect(layoutSource).toContain('className="brand-group"');
  });

  it('removes the large hazte socio cta from the header', () => {
    expect(layoutSource).not.toContain('className="cta-link header-cta"');
    expect(layoutSource).not.toContain('>Hazte socio<');
  });
});
