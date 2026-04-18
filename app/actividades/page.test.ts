import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const activitiesPageSource = fs.readFileSync(path.resolve(__dirname, './page.tsx'), 'utf8');

describe('ActivitiesPage source', () => {
  it('renders both events and activities in the unified section', () => {
    expect(activitiesPageSource).toContain('EventCard');
    expect(activitiesPageSource).toContain('ActivityCard');
    expect(activitiesPageSource).toContain('Eventos y actividades');
  });
});
