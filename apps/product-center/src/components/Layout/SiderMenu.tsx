import {
  AppstoreOutlined,
  DashboardOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  FundProjectionScreenOutlined,
  ReadOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import type { PageKey } from '../../types/navigation';

interface SiderMenuProps {
  selectedKey: PageKey;
  onSelect: (key: PageKey) => void;
}

const menuItems: MenuProps['items'] = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  {
    key: 'product-group',
    icon: <AppstoreOutlined />,
    label: '商品管理',
    children: [
      { key: 'products', icon: <ShoppingCartOutlined />, label: '商品列表' },
      { key: 'categories', icon: <FolderOpenOutlined />, label: '商品分类' },
    ],
  },
  { key: 'agreements', icon: <ReadOutlined />, label: '产品协议' },
  { key: 'orders', icon: <FileTextOutlined />, label: '订单管理' },
  {
    key: 'finance-group',
    icon: <TransactionOutlined />,
    label: '财务管理',
    children: [
      { key: 'bills', icon: <FundProjectionScreenOutlined />, label: '账单明细' },
      { key: 'finance', icon: <TransactionOutlined />, label: '财务统计' },
    ],
  },
  { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
];

const SiderMenu = ({ selectedKey, onSelect }: SiderMenuProps) => (
  <Menu
    className="product-menu"
    mode="inline"
    theme="dark"
    selectedKeys={[selectedKey]}
    defaultOpenKeys={['product-group', 'finance-group']}
    items={menuItems}
    onClick={({ key }) => onSelect(key as PageKey)}
  />
);

export default SiderMenu;
