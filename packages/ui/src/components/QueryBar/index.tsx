import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Space } from 'antd';
import type { ReactNode } from 'react';

export interface QueryBarProps {
  children: ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
  searchText?: string;
  resetText?: string;
}

export const QueryBar = ({
  children,
  onSearch,
  onReset,
  searchText = '查询',
  resetText = '重置',
}: QueryBarProps) => (
  <Card className="query-bar" bordered={false}>
    <div className="query-bar-fields">{children}</div>
    <Space className="query-bar-actions">
      {onSearch && <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>{searchText}</Button>}
      {onReset && <Button icon={<ReloadOutlined />} onClick={onReset}>{resetText}</Button>}
    </Space>
  </Card>
);
