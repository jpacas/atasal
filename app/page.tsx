import Link from 'next/link';
import type { Metadata } from 'next';
import { getLatestPosts } from '@/lib/content';
import { JsonLd } from '@/components/json-ld';
import { PostCard } from '@/components/ui/post-card';
import { ActivityCard } from '@/components/ui/activity-card';
import { EventCard } from '@/components/ui/event-card';
import { SectionHeader } from '@/components/ui/section-header';
import {
  contactContent,
  events,
  getFeaturedActivities,
  getUpcomingEvents,
  homeContent,
  institutionalHighlights
} from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Plataforma institucional de ATASAL con agenda, actividades y ruta de membresía.',
  alternates: {
    canonical: '/'
  }
};

export default function HomePage() {
  const latest = getLatestPosts(3);
  const upcomingEvents = getUpcomingEvents();
  const featuredEvents = events.slice(0, 3);
  const featuredActivities = getFeaturedActivities(3);
  const homeSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Inicio',
    url: 'https://www.atasal.org/',
    inLanguage: 'es-SV'
  };

  return (
    <section className="stack landing-shell">
      <JsonLd data={homeSchema} />
      <section className="hero-panel home-hero">
        <div className="hero-copy">
          <p className="section-eyebrow">{homeContent.hero.eyebrow}</p>
          <h1>{homeContent.hero.title}</h1>
          <p className="hero-summary">{homeContent.hero.summary}</p>
          <div className="button-row">
            <Link className="cta-link" href={homeContent.hero.primaryAction.href}>
              {homeContent.hero.primaryAction.label}
            </Link>
            <Link className="secondary-link" href={homeContent.hero.secondaryAction.href}>
              {homeContent.hero.secondaryAction.label}
            </Link>
          </div>
        </div>
        <aside className="hero-rail" aria-label="Enfoques principales de ATASAL">
          <div className="hero-rail-header">
            <p className="section-eyebrow">Enfoque</p>
            <p className="hero-rail-summary">
              Formación, agenda gremial y vínculo directo con la asociación.
            </p>
          </div>
          <ul className="hero-key-points">
            {homeContent.strategicNotes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="hero-contact">
            <span>{contactContent.phone}</span>
            <a href={`mailto:${contactContent.email}`}>{contactContent.email}</a>
          </div>
        </aside>
      </section>

      <section className="feature-slab">
        <SectionHeader
          eyebrow="ATASAL"
          title={homeContent.intro.title}
          summary={homeContent.intro.summary}
        />
        <div className="highlight-grid">
          {institutionalHighlights.map((item) => (
            <article key={item.href} className="highlight-card">
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <Link href={item.href} className="text-link">
                Explorar
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-slab">
        <SectionHeader
          eyebrow="Pilares"
          title="Formación, integración y vida asociativa"
          summary="ATASAL articula conocimiento técnico, comunidad y espacios de encuentro para el sector."
        />
        <div className="three-column-grid">
          {homeContent.pillars.map((pillar) => (
            <article key={pillar.slug} className="mini-panel">
              <h3>{pillar.title}</h3>
              <p>{pillar.summary}</p>
              <p className="support-copy">{pillar.emphasis}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-slab muted">
        <SectionHeader
          eyebrow="Actividades"
          title="Agenda, archivo y memoria viva"
          summary="Eventos, convocatorias y registro visual de la asociación reunidos en una sola sección."
        />
        {upcomingEvents.length > 0 ? (
          <div className="feature-stack">
            {upcomingEvents.slice(0, 3).map((event) => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="post-meta">No hay actividades futuras confirmadas en este momento.</p>
            <p>Mientras se actualiza la agenda, ATASAL mantiene accesible su archivo reciente y la memoria institucional.</p>
          </div>
        )}
        <div className="feature-stack">
          {featuredEvents.map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
        <div className="feature-stack">
          {featuredActivities.map((activity) => (
            <ActivityCard key={activity.slug} activity={activity} />
          ))}
        </div>
      </section>

      <section className="feature-slab">
        <SectionHeader
          eyebrow="Noticias"
          title="Archivo editorial y novedades recientes"
          summary="Publicaciones del sitio histórico y notas útiles para seguir la actividad del sector."
        />
        <div className="post-list">
          {latest.map((post, index) => (
            <PostCard key={post.id} post={post} priority={index < 2} />
          ))}
        </div>
      </section>

      <section className="band-callout">
        <div>
          <p className="section-eyebrow">Hazte socio</p>
          <h2>Incorpórate a la comunidad técnica azucarera.</h2>
          <p>
            Consulta beneficios, requisitos y el canal directo para iniciar tu acercamiento con ATASAL.
          </p>
        </div>
        <div className="button-row">
          <Link className="cta-link" href="/hazte-socio/">
            Iniciar solicitud
          </Link>
          <Link className="secondary-link" href="/contacto/">
            Ver contacto
          </Link>
        </div>
      </section>

      <section className="landing-social">
        <p className="landing-social-label">Redes</p>
        <a
          className="landing-social-link"
          href={contactContent.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook de ATASAL
        </a>
      </section>
    </section>
  );
}
