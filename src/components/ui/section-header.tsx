interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  summary?: string;
}

export function SectionHeader({ eyebrow, title, summary }: SectionHeaderProps) {
  return (
    <header className="section-header">
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h2>{title}</h2>
      {summary ? <p className="section-summary">{summary}</p> : null}
    </header>
  );
}
