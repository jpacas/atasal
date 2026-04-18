import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { JsonLd } from '@/components/json-ld';
import { MembershipInterestForm } from '@/components/membership-interest-form';
import { SectionHeader } from '@/components/ui/section-header';
import { buildBreadcrumbItems, buildBreadcrumbSchema } from '@/lib/seo';
import { contactContent, membershipContent } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Hazte socio',
  description: 'Beneficios, requisitos y canal inicial de contacto para integrarse a ATASAL.',
  alternates: {
    canonical: '/hazte-socio/'
  }
};

export default function MembershipPage() {
  const breadcrumbs = buildBreadcrumbItems('/hazte-socio/', 'Hazte socio');
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <section className="stack">
      <JsonLd data={breadcrumbSchema} />
      <Breadcrumbs items={breadcrumbs} />
      <section className="page-hero membership-hero">
        <p className="section-eyebrow">Membresía</p>
        <h1>Hazte socio de ATASAL</h1>
        <p className="section-summary">{membershipContent.intro}</p>
        <div className="button-row">
          <a href={`mailto:${contactContent.email}`} className="cta-link">
            Escribir a ATASAL
          </a>
          <Link href="/actividades/" className="secondary-link">
            Revisar actividades
          </Link>
        </div>
      </section>

      <section className="two-panel-layout">
        <div className="rich-panel">
          <SectionHeader
            eyebrow="Beneficios"
            title="Por qué integrarse"
            summary="Una propuesta de valor simple para una primera fase con gestión manual."
          />
          <ul className="check-list">
            {membershipContent.benefits.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rich-panel">
          <SectionHeader eyebrow="Requisitos" title="Quién puede aplicar" />
          <ul className="check-list">
            {membershipContent.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="feature-slab">
        <SectionHeader
          eyebrow="Proceso"
          title="Cómo funciona el primer contacto"
          summary="ATASAL recibe la solicitud y continúa el seguimiento de forma manual."
        />
        <div className="three-column-grid">
          {membershipContent.steps.map((step, index) => (
            <article key={step} className="mini-panel numbered">
              <span>{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="feature-slab muted">
        <SectionHeader
          eyebrow="Solicitud"
          title="Formulario de interés"
          summary="Esta versión abre un correo preparado con tus datos para acelerar la gestión inicial."
        />
        <MembershipInterestForm contact={contactContent} />
      </section>
    </section>
  );
}
