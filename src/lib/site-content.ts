export interface NavigationItem {
  label: string;
  href: string;
}

export interface LinkAction {
  label: string;
  href: string;
}

export interface Pillar {
  slug: string;
  title: string;
  summary: string;
  emphasis: string;
}

export interface EventEntry {
  slug: string;
  title: string;
  summary: string;
  description: string;
  date: string;
  timeLabel?: string;
  location?: string;
  statusLabel: string;
  audience?: string;
  image?: string | null;
  cta: LinkAction;
  sourceRoute?: string;
}

export interface ActivityEntry {
  slug: string;
  title: string;
  summary: string;
  description: string;
  date: string;
  location: string;
  image: string;
  pillar: string;
  relatedRoute?: string;
}

export interface HighlightLink {
  title: string;
  summary: string;
  href: string;
}

export interface MembershipContent {
  intro: string;
  benefits: string[];
  requirements: string[];
  steps: string[];
}

export interface ContactContent {
  email: string;
  phone: string;
  office: string[];
  facebookUrl: string;
}

export const homeContent = {
  hero: {
    eyebrow: 'Asociación técnica activa desde 1978',
    title: 'La comunidad técnica de la agroindustria azucarera en El Salvador.',
    summary:
      'ATASAL impulsa formación, integración gremial y vida asociativa para profesionales vinculados al sector azucarero salvadoreño.',
    primaryAction: { label: 'Conocer ATASAL', href: '/atasal/' },
    secondaryAction: { label: 'Ver actividades', href: '/actividades/' }
  },
  intro: {
    title: 'Información esencial para entender la asociación',
    summary:
      'Historia, misión, dirección institucional y continuidad gremial reunidas en una navegación clara.'
  },
  pillars: [
    {
      slug: 'conocimiento',
      title: 'Conocimiento',
      summary: 'Capacitaciones, congresos, recursos técnicos y actualización profesional.',
      emphasis: 'Formación útil para la práctica del sector.'
    },
    {
      slug: 'deporte',
      title: 'Deporte',
      summary: 'Actividades que fortalecen la integración gremial y el sentido de pertenencia.',
      emphasis: 'Encuentros que convierten la red técnica en comunidad.'
    },
    {
      slug: 'entretenimiento',
      title: 'Entretenimiento',
      summary: 'Espacios sociales que documentan la vida activa de la asociación.',
      emphasis: 'Una agenda que también construye identidad.'
    }
  ] as Pillar[],
  strategicNotes: [
    'Congresos, talleres y memoria técnica del sector.',
    'Actividades de integración y vida asociativa.',
    'Canal directo para membresía y contacto institucional.'
  ]
};

export const institutionalHighlights: HighlightLink[] = [
  {
    title: 'Historia y origen',
    summary: 'Contexto institucional y evolución de ATASAL dentro del sector.',
    href: '/quienes-somos/agroindustria/historia/'
  },
  {
    title: 'Misión y visión',
    summary: 'Marco que orienta la nueva etapa de la asociación.',
    href: '/quienes-somos/atasal/mision/'
  },
  {
    title: 'Junta directiva',
    summary: 'Referencia institucional para el trabajo gremial y la coordinación actual.',
    href: '/quienes-somos/atasal/junta-directiva/'
  },
  {
    title: 'Presidentes',
    summary: 'Memoria institucional y continuidad del liderazgo técnico.',
    href: '/quienes-somos/presidentes/'
  }
];

export const events: EventEntry[] = [
  {
    slug: 'segunda-copa-de-futbol-atasal-2019',
    title: 'Segunda Copa de Fútbol ATASAL 2019',
    summary:
      'La segunda edición del torneo para 2019 se publicó con sede en Ingenio Chaparrastique de San Miguel.',
    description:
      'Registro histórico de una convocatoria deportiva de ATASAL publicada en el sitio. La nota anuncia el torneo y sirve como referencia del tipo de actividades de integración impulsadas por la asociación.',
    date: '2019-10-22',
    timeLabel: 'Desde las 8:00 a. m. según la publicación original',
    location: 'Ingenio Chaparrastique, San Miguel',
    statusLabel: 'Convocatoria histórica',
    image: '/legacy/wp-content/uploads/2019/11/01-copa-atasal-caballos-1024x768.jpeg',
    cta: { label: 'Ver publicación original', href: '/segunda-copa-de-futbol-atasal-2019/' },
    sourceRoute: '/segunda-copa-de-futbol-atasal-2019/'
  },
  {
    slug: 'conferencias-iv-congreso-atasal-2019',
    title: 'CONFERENCIAS IV CONGRESO ATASAL 2019',
    summary:
      'Conferencias presentadas durante el IV Congreso de ATASAL 2019 en San Salvador.',
    description:
      'Ficha de archivo basada en la publicación histórica que reúne materiales y memoria del congreso nacional de técnicos azucareros.',
    date: '2019-08-01',
    statusLabel: 'Memoria técnica',
    image: '/legacy/wp-content/uploads/2019/07/atasal_congreso_006-1024x768.jpg',
    cta: { label: 'Ver publicación original', href: '/conferencias-iv-congreso-atasal-2019/' },
    sourceRoute: '/conferencias-iv-congreso-atasal-2019/'
  },
  {
    slug: 'ii-taller-de-fabricacion-atasal-ingenio-el-angel',
    title: 'II Taller de Fabricación ATASAL - Ingenio El Ángel',
    summary:
      'La publicación registra una buena participación de ingenieros del área de molinos, fabricación y agrícola.',
    description:
      'Evento histórico del archivo de ATASAL centrado en formación técnica y participación de profesionales del sector.',
    date: '2019-02-28',
    statusLabel: 'Actividad realizada',
    image: '/legacy/wp-content/uploads/2019/02/01-segundo_talller_atasal_el_angel-1024x577.jpg',
    cta: { label: 'Ver publicación original', href: '/ii-taller-de-fabricacion-atasal-ingenio-el-angel/' },
    sourceRoute: '/ii-taller-de-fabricacion-atasal-ingenio-el-angel/'
  },
  {
    slug: 'primera-copa-atasal',
    title: 'Primera Copa ATASAL',
    summary:
      'La convocatoria original anunciaba la Primera Copa ATASAL en modalidad de Fútbol 8.',
    description:
      'Publicación histórica de ATASAL enfocada en integración gremial a través de una actividad deportiva organizada por la asociación.',
    date: '2018-08-28',
    statusLabel: 'Convocatoria histórica',
    image: '/legacy/wp-content/uploads/2018/08/torneo-atasal-final-1024x1021.jpg',
    cta: { label: 'Ver publicación original', href: '/primera-copa-atasal/' },
    sourceRoute: '/primera-copa-atasal/'
  },
  {
    slug: 'seminario-por-el-proximo-dia-del-tecnico-azucarero',
    title: 'Seminario por el próximo Día del Técnico Azucarero',
    summary:
      'La publicación anunciaba un seminario para el 26 de mayo y dirige a la información completa del evento.',
    description:
      'Registro histórico de una convocatoria de ATASAL vinculada al Día del Técnico Azucarero.',
    date: '2017-05-17',
    statusLabel: 'Convocatoria histórica',
    cta: { label: 'Ver publicación original', href: '/seminario-por-el-proximo-dia-del-tecnico-azucarero/' },
    sourceRoute: '/seminario-por-el-proximo-dia-del-tecnico-azucarero/'
  }
];

export const activities: ActivityEntry[] = [
  {
    slug: 'congreso-de-innovacion-atasal',
    title: 'Técnicos azucareros realizan congreso de Innovación y sostenibilidad de la Agroindustria',
    summary:
      'Memoria visual de una jornada con participación técnica y agenda de innovación en la agroindustria.',
    description:
      'Cobertura basada en la publicación original del congreso y su valor para la proyección técnica de ATASAL.',
    date: '2019-07-26',
    location: 'San Salvador',
    image: '/legacy/wp-content/uploads/2019/07/atasal-carlos-morales.jpg',
    pillar: 'Conocimiento',
    relatedRoute: '/tecnicos-azucareros-realizan-congreso-de-innovacion-y-sostenibilidad-de-la-agroindustria/'
  },
  {
    slug: 'copa-atasal-comunidad',
    title: 'La Primera COPA ATASAL 2018 se celebró con mucho éxito',
    summary:
      'Registro visual de una actividad deportiva que fortaleció integración y sentido de pertenencia.',
    description:
      'Memoria de una actividad de convivencia gremial publicada por ATASAL dentro de su archivo histórico.',
    date: '2018-10-17',
    location: 'El Salvador',
    image: '/legacy/wp-content/uploads/2018/10/Copa_ATASAL_006-1024x768.jpeg',
    pillar: 'Deporte',
    relatedRoute: '/la-primera-copa-atasal-se-celebro-con-mucho-exito/'
  },
  {
    slug: 'reunion-con-proveedores',
    title: 'Reunión con proveedores de la agroindustria azucarera de El Salvador',
    summary:
      'Espacio institucional para presentar el programa de actividades técnicas y sociales de ATASAL.',
    description:
      'Cobertura de una reunión institucional enfocada en el plan de trabajo de la junta directiva y la vinculación con aliados.',
    date: '2018-02-06',
    location: 'CDI, San Salvador',
    image: '/legacy/wp-content/uploads/2018/02/ATASAL_028-1024x768.jpeg',
    pillar: 'Entretenimiento',
    relatedRoute: '/reunion-proveedores-la-agroindustria-azucarera-salvador/'
  }
];

export const membershipContent: MembershipContent = {
  intro:
    'Integrarse a ATASAL significa participar en una red técnica con agenda visible, oportunidades de actualización y actividades de integración del sector.',
  benefits: [
    'Acceso preferente a eventos, encuentros y convocatorias gremiales.',
    'Participación en espacios de formación, intercambio técnico y networking.',
    'Visibilidad profesional dentro de la comunidad azucarera salvadoreña.',
    'Acceso a actividades de integración, deporte y vida asociativa.'
  ],
  requirements: [
    'Tener vínculo profesional, técnico o académico con la agroindustria azucarera o áreas conexas.',
    'Compartir interés por formación, participación gremial y trabajo colaborativo.',
    'Completar la solicitud inicial para que ATASAL pueda dar seguimiento.'
  ],
  steps: [
    'Completa el formulario de interés con tus datos básicos.',
    'ATASAL revisa la solicitud y contacta al postulante por correo o teléfono.',
    'Se comparte el siguiente paso administrativo según el perfil y el tipo de vinculación.'
  ]
};

export const contactContent: ContactContent = {
  email: 'atasal.tecnicos@gmail.com',
  phone: '(503) 2556-3999',
  office: [
    'Urbanización y Bulevar Santa Elena, entre calle Oromotique y Cerro Verde Oriente',
    'Edificio FUSADES, Local No. 2',
    'Antiguo Cuscatlán, La Libertad'
  ],
  facebookUrl: 'https://www.facebook.com/atasalelsalvador'
};

const primaryNavigation: NavigationItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'ATASAL', href: '/atasal/' },
  { label: 'Noticias', href: '/noticias/' },
  { label: 'Actividades', href: '/actividades/' },
  { label: 'Hazte socio', href: '/hazte-socio/' },
  { label: 'Contacto', href: '/contacto/' }
];

function toDate(input: string | Date): Date {
  return input instanceof Date ? input : new Date(`${input}T00:00:00`);
}

function sortAscending<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => toDate(left.date).getTime() - toDate(right.date).getTime());
}

function sortDescending<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => toDate(right.date).getTime() - toDate(left.date).getTime());
}

export function getPrimaryNavigation(): NavigationItem[] {
  return primaryNavigation;
}

export function getUpcomingEvents(referenceDate: string | Date = new Date()): EventEntry[] {
  const baseline = toDate(referenceDate).getTime();
  return sortAscending(events.filter((event) => toDate(event.date).getTime() >= baseline));
}

export function getPastEvents(referenceDate: string | Date = new Date()): EventEntry[] {
  const baseline = toDate(referenceDate).getTime();
  return sortDescending(events.filter((event) => toDate(event.date).getTime() < baseline));
}

export function findEventBySlug(slug: string): EventEntry | null {
  return events.find((event) => event.slug === slug) ?? null;
}

export function getFeaturedActivities(limit = activities.length): ActivityEntry[] {
  return sortDescending(activities).slice(0, limit);
}

export function findActivityBySlug(slug: string): ActivityEntry | null {
  return activities.find((activity) => activity.slug === slug) ?? null;
}
