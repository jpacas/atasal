import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { ActivityCard } from '@/components/ui/activity-card';
import { EventCard } from '@/components/ui/event-card';
import { SectionHeader } from '@/components/ui/section-header';
import { buildBreadcrumbItems, buildBreadcrumbSchema } from '@/lib/seo';
import { activities, getFeaturedActivities, getPastEvents, getUpcomingEvents } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Actividades',
  description: 'Memoria visual y registro de actividades de ATASAL.',
  alternates: {
    canonical: '/actividades/'
  }
};

export default function ActivitiesPage() {
  const breadcrumbs = buildBreadcrumbItems('/actividades/', 'Actividades');
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
  const featured = getFeaturedActivities();
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();

  return (
    <section className="stack">
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="page-hero">
        <p className="section-eyebrow">Agenda y memoria</p>
        <h1>Actividades de ATASAL</h1>
        <p className="section-summary">
          Eventos, convocatorias históricas y registro visual de la vida gremial reunidos en una sola sección.
        </p>
      </section>

      <section className="feature-slab">
        <SectionHeader
          eyebrow="Archivo integrado"
          title="Eventos y actividades"
          summary="La sección unifica convocatorias, memoria técnica y cobertura institucional sin separar la experiencia en dos áreas distintas."
        />
        {upcoming.length > 0 ? (
          <div className="feature-stack">
            {upcoming.map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="post-meta">Sin actividades futuras confirmadas en el archivo actual.</p>
            <p>Mientras ATASAL publica nueva agenda, esta sección mantiene visible el archivo reciente y la memoria institucional.</p>
          </div>
        )}
        <div className="feature-stack">
          {past.slice(0, 3).map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </section>

      <section className="feature-slab muted">
        <SectionHeader
          eyebrow="Cobertura"
          title="Registro de actividades realizadas"
          summary="Las actividades muestran comunidad y continuidad; complementan el archivo de eventos dentro del mismo espacio."
        />
        <div className="feature-stack">
          {featured.map((activity) => (
            <ActivityCard key={activity.slug} activity={activity} />
          ))}
        </div>
      </section>

      <section className="feature-slab muted">
        <SectionHeader
          eyebrow="Archivo base"
          title={`${activities.length} actividades curadas para esta fase`}
          summary="La estructura queda lista para seguir creciendo con más galerías, coberturas y actividades vinculadas a eventos."
        />
      </section>
    </section>
  );
}
