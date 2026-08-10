import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';

export interface MetricCardProps {
  label: string;
  value: number | string;
  suffix?: ReactNode;
  icon?: ReactNode;
  note?: ReactNode;
  tone?: 'teal' | 'gold' | 'blue' | 'coral';
}

export const MetricCard = ({ label, value, suffix, icon, note, tone = 'teal' }: MetricCardProps) => (
  <Card className={`metric-card metric-card-${tone}`} bordered={false}>
    <div className="metric-card-topline">
      <span className="metric-card-label">{label}</span>
      {icon && <span className="metric-card-icon">{icon}</span>}
    </div>
    <Statistic value={value} suffix={suffix} />
    {note && <span className="metric-card-note">{note}</span>}
  </Card>
);
