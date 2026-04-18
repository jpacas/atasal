import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { buildBreadcrumbItems, buildBreadcrumbSchema } from '@/lib/seo';
import { contactContent } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Canales de contacto institucional de ATASAL.',
  alternates: {
    canonical: '/contacto/'
  }
};

export default function ContactPage() {
  const breadcrumbs = buildBreadcrumbItems('/contacto/', 'Contacto');
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <section className="stack">
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="page-hero">
        <p className="section-eyebrow">Contacto</p>
        <h1>Canales institucionales de ATASAL</h1>
        <p className="section-summary">
          Información base para consultas generales, coordinación institucional y seguimiento de membresía.
        </p>
      </section>

      <section className="contact-grid">
        <article className="rich-panel">
          <h2>Correo</h2>
          <p>
            <a href={`mailto:${contactContent.email}`}>{contactContent.email}</a>
          </p>
        </article>
        <article className="rich-panel">
          <h2>Teléfono</h2>
          <p>{contactContent.phone}</p>
        </article>
        <article className="rich-panel">
          <h2>Oficina</h2>
          <p>{contactContent.office.join(', ')}</p>
        </article>
        <article className="rich-panel">
          <h2>Red social principal</h2>
          <p>
            <a href={contactContent.facebookUrl} target="_blank" rel="noopener noreferrer">
              Facebook oficial de ATASAL
            </a>
          </p>
        </article>
      </section>

      <section className="band-callout">
        <div>
          <p className="section-eyebrow">Membresía</p>
          <h2>¿Quiere integrarse a la asociación?</h2>
          <p>La nueva landing de membresía centraliza beneficios, requisitos y el primer contacto.</p>
        </div>
        <div className="button-row">
          <Link href="/hazte-socio/" className="cta-link">
            Ir a Hazte socio
          </Link>
        </div>
      </section>
    </section>
  );
}
