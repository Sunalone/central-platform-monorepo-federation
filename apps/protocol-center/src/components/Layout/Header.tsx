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
    <header className="protocol-header">
      <Space size={14}>
        <Button
          className="collapse-button"
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          aria-label={collapsed ? '展开菜单' : '收起菜单'}
        />
        <div>
          <Typography.Text className="header-eyebrow">协议中心 / {page.group}</Typography.Text>
          <Typography.Title level={4}>{page.title}</Typography.Title>
        </div>
      </Space>

      <Space size={12}>
        <Tag className="environment-tag">本地演示</Tag>
        <Avatar className="admin-avatar">协</Avatar>
        <div className="admin-copy">
          <strong>协议管理员</strong>
          <span>合规运营组</span>
        </div>
      </Space>
    </header>
  );
};

export default Header;
