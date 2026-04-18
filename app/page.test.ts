import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const homeSource = fs.readFileSync(path.resolve(__dirname, './page.tsx'), 'utf8');

describe('HomePage source', () => {
  it('adds the ATASAL Facebook link at the bottom of the landing page', () => {
    expect(homeSource).toContain('Facebook de ATASAL');
  });

  it('removes pagination controls from the landing page', () => {
    expect(homeSource).not.toContain('className="pagination"');
    expect(homeSource).not.toContain('Página 1 de');
    expect(homeSource).not.toContain('/noticias/page/2/');
  });
});
