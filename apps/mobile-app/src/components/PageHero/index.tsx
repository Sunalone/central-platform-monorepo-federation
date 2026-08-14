interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  value: string;
  valueLabel: string;
  tone: 'teal' | 'amber' | 'blue';
}

const PageHero = ({ eyebrow, title, description, value, valueLabel, tone }: PageHeroProps) => (
  <section className={`page-hero page-hero--${tone}`}>
    <div className="page-hero__content">
      <span className="page-hero__eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
    <div className="page-hero__metric">
      <strong>{value}</strong>
      <span>{valueLabel}</span>
    </div>
  </section>
);

export default PageHero;
