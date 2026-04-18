'use client';

import { FormEvent, useState } from 'react';
import type { ContactContent } from '@/lib/site-content';

interface FormState {
  fullName: string;
  email: string;
  role: string;
  organization: string;
  interest: string;
}

const initialState: FormState = {
  fullName: '',
  email: '',
  role: '',
  organization: '',
  interest: ''
};

export function MembershipInterestForm({ contact }: { contact: ContactContent }) {
  const [form, setForm] = useState<FormState>(initialState);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = `Solicitud de membresía ATASAL - ${form.fullName || 'Nuevo interesado'}`;
    const body = [
      'Hola ATASAL,',
      '',
      'Comparto mis datos para recibir información sobre membresía:',
      '',
      `Nombre completo: ${form.fullName}`,
      `Correo: ${form.email}`,
      `Perfil o cargo: ${form.role}`,
      `Institución / empresa: ${form.organization || 'No indicado'}`,
      '',
      'Interés:',
      form.interest || 'Solicito información general sobre beneficios, requisitos y siguiente paso.'
    ].join('\n');

    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="interest-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label>
          Nombre completo
          <input
            required
            type="text"
            name="full_name"
            autoComplete="name"
            value={form.fullName}
            onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
          />
        </label>
        <label>
          Correo electrónico
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            spellCheck={false}
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
        </label>
        <label>
          Perfil o cargo
          <input
            required
            type="text"
            name="role"
            autoComplete="organization-title"
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
          />
        </label>
        <label>
          Institución o empresa
          <input
            type="text"
            name="organization"
            autoComplete="organization"
            value={form.organization}
            onChange={(event) => setForm((current) => ({ ...current, organization: event.target.value }))}
          />
        </label>
      </div>
      <label>
        ¿Qué le interesa de ATASAL?
        <textarea
          name="interest"
          rows={5}
          value={form.interest}
          onChange={(event) => setForm((current) => ({ ...current, interest: event.target.value }))}
        />
      </label>
      <div className="form-actions">
        <button type="submit" className="cta-link">
          Enviar solicitud por correo
        </button>
        <p className="support-copy">
          El formulario abre un correo dirigido a {contact.email} para que ATASAL gestione el seguimiento de forma manual.
        </p>
      </div>
    </form>
  );
}
