import { Tag } from 'antd';
import type { TagProps } from 'antd';

export type StatusTone = 'success' | 'processing' | 'warning' | 'error' | 'default';

export interface StatusTagProps extends Omit<TagProps, 'color'> {
  tone?: StatusTone;
}

export const StatusTag = ({ tone = 'default', children, ...props }: StatusTagProps) => (
  <Tag color={tone === 'default' ? undefined : tone} {...props}>
    {children}
  </Tag>
);
