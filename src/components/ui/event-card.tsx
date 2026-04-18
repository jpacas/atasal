import Link from 'next/link';
import type { EventEntry } from '@/lib/site-content';
import { formatShortDate } from '@/lib/date';

export function EventCard({ event }: { event: EventEntry }) {
  return (
    <article className="feature-card event-card">
      <div className="feature-card-media">
        {event.image ? (
          <img src={event.image} alt={event.title} width={960} height={640} />
        ) : (
          <div className="card-image-placeholder">
            <span>ATASAL</span>
          </div>
        )}
      </div>
      <div className="feature-card-body">
        <div className="feature-card-topline">
          <span className="date-chip">{formatShortDate(event.date)}</span>
          <span className="status-chip">{event.statusLabel}</span>
        </div>
        <h3>
          <Link href={`/eventos/${event.slug}/`}>{event.title}</Link>
        </h3>
        <p>{event.summary}</p>
        {event.timeLabel || event.location ? (
          <dl className="feature-meta-list">
            {event.timeLabel ? (
              <div>
                <dt>Referencia</dt>
                <dd>{event.timeLabel}</dd>
              </div>
            ) : null}
            {event.location ? (
              <div>
                <dt>Lugar</dt>
                <dd>{event.location}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
        <div className="feature-card-actions">
          <Link href={`/eventos/${event.slug}/`} className="text-link">
            Ver ficha
          </Link>
          <Link href={event.cta.href} className="text-link subdued">
            {event.cta.label}
          </Link>
        </div>
      </div>
    </article>
  );
}
