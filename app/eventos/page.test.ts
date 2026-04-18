import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const eventsPageSource = fs.readFileSync(path.resolve(__dirname, './page.tsx'), 'utf8');

describe('EventsPage source', () => {
  it('redirects the legacy eventos section to actividades', () => {
    expect(eventsPageSource).toContain("permanentRedirect('/actividades/')");
  });
});
