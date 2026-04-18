import Link from 'next/link';
import type { ActivityEntry } from '@/lib/site-content';
import { formatShortDate } from '@/lib/date';

export function ActivityCard({ activity }: { activity: ActivityEntry }) {
  return (
    <article className="feature-card activity-card">
      <div className="feature-card-media">
        <img src={activity.image} alt={activity.title} width={960} height={640} />
      </div>
      <div className="feature-card-body">
        <div className="feature-card-topline">
          <span className="date-chip">{formatShortDate(activity.date)}</span>
          <span className="status-chip">{activity.pillar}</span>
        </div>
        <h3>
          <Link href={`/actividades/${activity.slug}/`}>{activity.title}</Link>
        </h3>
        <p>{activity.summary}</p>
        <p className="support-copy">{activity.location}</p>
        <div className="feature-card-actions">
          <Link href={`/actividades/${activity.slug}/`} className="text-link">
            Ver actividad
          </Link>
          {activity.relatedRoute ? (
            <Link href={activity.relatedRoute} className="text-link subdued">
              Ver publicación relacionada
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
