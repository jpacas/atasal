import { describe, expect, it } from 'vitest';
import { findByRoute, sanitizeLegacyContent } from '@/lib/content';

describe('legacy content sanitation', () => {
  it('removes shortcode artifacts from legacy html', () => {
    const html = '<p>Antes</p><p>[table id=1 /]</p><div>[siteorigin_widget class="Foo"]<input /></div>[/siteorigin_widget]<p>Después</p>';

    const sanitized = sanitizeLegacyContent(html);

    expect(sanitized).not.toContain('[table id=1 /]');
    expect(sanitized).not.toContain('[siteorigin_widget');
    expect(sanitized).toContain('Antes');
    expect(sanitized).toContain('Después');
  });

  it('applies curated cleanup to the junta directiva page', () => {
    const entry = findByRoute('/quienes-somos/atasal/junta-directiva/');

    expect(entry?.contentHtml).toContain('Junta Directiva 2019 - 2021');
    expect(entry?.contentHtml).not.toContain('[table id=1 /]');
  });
});
