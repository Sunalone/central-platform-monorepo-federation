interface MetricItem {
  label: string;
  value: string;
  hint: string;
}

const MetricGrid = ({ items }: { items: MetricItem[] }) => (
  <section className="metric-grid" aria-label="核心指标">
    {items.map((item) => (
      <article className="metric-card" key={item.label}>
        <span>{item.label}</span>
        <strong>{item.value}</strong>
        <small>{item.hint}</small>
      </article>
    ))}
  </section>
);

export default MetricGrid;
