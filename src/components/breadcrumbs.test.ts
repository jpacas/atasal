import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const breadcrumbsSource = fs.readFileSync(path.resolve(__dirname, './breadcrumbs.tsx'), 'utf8');

describe('Breadcrumbs source', () => {
  it('does not render breadcrumb UI anywhere in the site', () => {
    expect(breadcrumbsSource).toContain('return null;');
    expect(breadcrumbsSource).not.toContain('aria-label="Migas de pan"');
  });
});
