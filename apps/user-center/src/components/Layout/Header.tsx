import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Avatar, Button, Space, Tag, Typography } from 'antd';
import type { PageKey } from '../../types/navigation';
import { PAGE_META } from '../../types/navigation';

interface HeaderProps {
  collapsed: boolean;
  pageKey: PageKey;
  onToggle: () => void;
}

const Header = ({ collapsed, pageKey, onToggle }: HeaderProps) => {
  const page = PAGE_META[pageKey];

  return (
    <header className="user-header">
      <Space size={14}>
        <Button
          className="collapse-button"
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          aria-label={collapsed ? '展开菜单' : '收起菜单'}
        />
        <div>
          <Typography.Text className="header-eyebrow">用户中心 / {page.group}</Typography.Text>
          <Typography.Title level={4}>{page.title}</Typography.Title>
        </div>
      </Space>

      <Space size={12}>
        <Tag className="environment-tag">本地演示</Tag>
        <Avatar className="admin-avatar">用</Avatar>
        <div className="admin-copy">
          <strong>用户管理员</strong>
          <span>用户运营组</span>
        </div>
      </Space>
    </header>
  );
};

export default Header;

