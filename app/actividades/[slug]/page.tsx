import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { buildBreadcrumbItems, buildBreadcrumbSchema } from '@/lib/seo';
import { activities, findActivityBySlug } from '@/lib/site-content';
import { formatLongDate } from '@/lib/date';

export async function generateStaticParams() {
  return activities.map((activity) => ({ slug: activity.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const activity = findActivityBySlug(slug);

  if (!activity) {
    return { title: 'Actividad' };
  }

  return {
    title: activity.title,
    description: activity.summary,
    alternates: {
      canonical: `/actividades/${activity.slug}/`
    }
  };
}

export default async function ActivityDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = findActivityBySlug(slug);
  if (!activity) notFound();

  const route = `/actividades/${activity.slug}/`;
  const breadcrumbs = buildBreadcrumbItems(route, activity.title);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <article className="detail-shell">
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumbs items={breadcrumbs} />
      <div className="detail-hero">
        <div className="detail-copy">
          <p className="section-eyebrow">Actividad</p>
          <h1>{activity.title}</h1>
          <p className="section-summary">{activity.summary}</p>
          <div className="detail-meta-grid">
            <div>
              <span>Fecha</span>
              <strong>{formatLongDate(activity.date)}</strong>
            </div>
            <div>
              <span>Lugar</span>
              <strong>{activity.location}</strong>
            </div>
            <div>
              <span>Pilar</span>
              <strong>{activity.pillar}</strong>
            </div>
          </div>
          <div className="button-row">
            {activity.relatedRoute ? (
              <Link href={activity.relatedRoute} className="cta-link">
                Ver publicación relacionada
              </Link>
            ) : null}
            <Link href="/actividades/" className="secondary-link">
              Explorar actividades
            </Link>
          </div>
        </div>
        <div className="detail-media">
          <img src={activity.image} alt={activity.title} width={1200} height={800} />
        </div>
      </div>
      <section className="detail-content">
        <div className="rich-panel">
          <h2>Descripción</h2>
          <p>{activity.description}</p>
        </div>
      </section>
    </article>
  );
}
