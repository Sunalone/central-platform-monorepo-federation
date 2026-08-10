import { Card } from 'antd';
import type { CardProps } from 'antd';
import type { ReactNode } from 'react';

export interface PlatformCardProps extends Omit<CardProps, 'title'> {
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
}

export const PlatformCard = ({ eyebrow, title, description, children, className, ...props }: PlatformCardProps) => (
  <Card className={['platform-card', className].filter(Boolean).join(' ')} bordered={false} {...props}>
    {(eyebrow || title || description) && (
      <div className="platform-card-heading">
        {eyebrow && <span className="platform-card-eyebrow">{eyebrow}</span>}
        {title && <strong className="platform-card-title">{title}</strong>}
        {description && <span className="platform-card-description">{description}</span>}
      </div>
    )}
    {children}
  </Card>
);
