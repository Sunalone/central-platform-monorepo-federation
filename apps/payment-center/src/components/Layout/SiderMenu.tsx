import { AccountBookOutlined, DashboardOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import type { PageKey } from '../../types/navigation';

interface SiderMenuProps {
  selectedKey: PageKey;
  onSelect: (key: PageKey) => void;
}

const menuItems: MenuProps['items'] = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: 'payments', icon: <AccountBookOutlined />, label: '支付记录' },
];

const SiderMenu = ({ selectedKey, onSelect }: SiderMenuProps) => (
  <Menu
    className="payment-menu"
    mode="inline"
    theme="dark"
    selectedKeys={[selectedKey]}
    items={menuItems}
    onClick={({ key }) => onSelect(key as PageKey)}
  />
);

export default SiderMenu;
