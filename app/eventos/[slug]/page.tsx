import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { buildBreadcrumbItems, buildBreadcrumbSchema } from '@/lib/seo';
import { formatLongDate } from '@/lib/date';
import { events, findEventBySlug } from '@/lib/site-content';

export async function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = findEventBySlug(slug);

  if (!event) {
    return { title: 'Evento' };
  }

  return {
    title: event.title,
    description: event.summary,
    alternates: {
      canonical: `/eventos/${event.slug}/`
    }
  };
}

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = findEventBySlug(slug);
  if (!event) notFound();

  const route = `/eventos/${event.slug}/`;
  const breadcrumbs = buildBreadcrumbItems(route, event.title);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <article className="detail-shell">
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="detail-hero">
        <div className="detail-copy">
          <p className="section-eyebrow">Evento</p>
          <h1>{event.title}</h1>
          <p className="section-summary">{event.summary}</p>
          <div className="detail-meta-grid">
            <div>
              <span>Publicado</span>
              <strong>{formatLongDate(event.date)}</strong>
            </div>
            {event.timeLabel ? (
              <div>
                <span>Referencia</span>
                <strong>{event.timeLabel}</strong>
              </div>
            ) : null}
            {event.location ? (
              <div>
                <span>Lugar</span>
                <strong>{event.location}</strong>
              </div>
            ) : null}
            {event.audience ? (
              <div>
                <span>Dirigido a</span>
                <strong>{event.audience}</strong>
              </div>
            ) : null}
          </div>
          <div className="button-row">
            <Link href={event.cta.href} className="cta-link">
              {event.cta.label}
            </Link>
            {event.sourceRoute ? (
              <Link href={event.sourceRoute} className="secondary-link">
                Abrir nota original
              </Link>
            ) : (
              <Link href="/contacto/" className="secondary-link">
                Contactar ATASAL
              </Link>
            )}
          </div>
        </div>
        <div className="detail-media">
          {event.image ? <img src={event.image} alt={event.title} width={1200} height={800} /> : null}
        </div>
      </div>
      <section className="detail-content">
        <div className="rich-panel">
          <h2>Contexto</h2>
          <p>{event.description}</p>
          <p className="support-copy">Estado editorial: {event.statusLabel}</p>
        </div>
      </section>
    </article>
  );
}
