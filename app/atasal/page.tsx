import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { SectionHeader } from '@/components/ui/section-header';
import { buildBreadcrumbItems, buildBreadcrumbSchema } from '@/lib/seo';
import { homeContent, institutionalHighlights } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'ATASAL',
  description: 'Información institucional, propósito y prioridades de ATASAL.',
  alternates: {
    canonical: '/atasal/'
  }
};

export default function AboutPage() {
  const breadcrumbs = buildBreadcrumbItems('/atasal/', 'ATASAL');
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <section className="stack">
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="page-hero">
        <p className="section-eyebrow">Institución</p>
        <h1>ATASAL como plataforma gremial del técnico azucarero.</h1>
        <p className="section-summary">
          La asociación articula conocimiento, integración y visibilidad para fortalecer a la comunidad técnica vinculada a la agroindustria azucarera de El Salvador.
        </p>
      </section>

      <section className="feature-slab">
        <SectionHeader
          eyebrow="Marco institucional"
          title="Una experiencia más clara que separa identidad, agenda y archivo"
          summary="La nueva arquitectura del sitio organiza lo institucional por un lado, la agenda visible por otro y el histórico editorial como respaldo."
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

      <section className="feature-slab">
        <SectionHeader
          eyebrow="Explorar"
          title="Secciones institucionales clave"
          summary="Accesos directos al contenido histórico y estructural más útil para entender la asociación."
        />
        <div className="highlight-grid">
          {institutionalHighlights.map((item) => (
            <article key={item.href} className="highlight-card">
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <Link href={item.href} className="text-link">
                Ir a la sección
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="band-callout">
        <div>
          <p className="section-eyebrow">Próximo paso</p>
          <h2>La vida institucional necesita visibilidad operativa.</h2>
          <p>
            Por eso la homepage prioriza próximos eventos, actividades recientes y un canal directo para captar nuevos socios.
          </p>
        </div>
        <div className="button-row">
          <Link href="/actividades/" className="cta-link">
            Ver actividades
          </Link>
          <Link href="/hazte-socio/" className="secondary-link">
            Revisar membresía
          </Link>
        </div>
      </section>
    </section>
  );
}
