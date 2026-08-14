import type { ReactNode } from 'react';

interface ChartPanelProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}

const ChartPanel = ({ title, subtitle, action, children }: ChartPanelProps) => (
  <section className="content-panel chart-panel">
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
    {children}
  </section>
);

export default ChartPanel;
