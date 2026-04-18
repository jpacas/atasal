import { describe, expect, it } from 'vitest';
import {
  findActivityBySlug,
  findEventBySlug,
  getFeaturedActivities,
  getPrimaryNavigation,
  getUpcomingEvents,
  getPastEvents,
  homeContent
} from '@/lib/site-content';

describe('site content', () => {
  it('provides the new institutional primary navigation', () => {
    expect(getPrimaryNavigation().map((item) => item.label)).toEqual([
      'Inicio',
      'ATASAL',
      'Noticias',
      'Actividades',
      'Hazte socio',
      'Contacto'
    ]);
  });

  it('points the home secondary action to the unified activities section', () => {
    expect(homeContent.hero.secondaryAction).toEqual({
      label: 'Ver actividades',
      href: '/actividades/'
    });
  });

  it('splits events into upcoming and past buckets using the provided reference date', () => {
    const upcoming = getUpcomingEvents('2026-06-01');
    const past = getPastEvents('2026-06-01');

    expect(upcoming).toEqual([]);
    expect(past.map((event) => event.slug)).toEqual([
      'segunda-copa-de-futbol-atasal-2019',
      'conferencias-iv-congreso-atasal-2019',
      'ii-taller-de-fabricacion-atasal-ingenio-el-angel',
      'primera-copa-atasal',
      'seminario-por-el-proximo-dia-del-tecnico-azucarero'
    ]);
  });

  it('returns featured activities in descending chronological order', () => {
    expect(getFeaturedActivities(3).map((activity) => activity.slug)).toEqual([
      'congreso-de-innovacion-atasal',
      'copa-atasal-comunidad',
      'reunion-con-proveedores'
    ]);
  });

  it('resolves event and activity details by slug', () => {
    expect(findEventBySlug('segunda-copa-de-futbol-atasal-2019')?.title).toContain('Copa');
    expect(findActivityBySlug('reunion-con-proveedores')?.title).toContain('proveedores');
  });
});
