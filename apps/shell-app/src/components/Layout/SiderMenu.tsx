import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  MoneyCollectOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const SiderMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems: MenuProps['items'] = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
    { key: '/product', icon: <ShoppingOutlined />, label: '商品列表' },
    { key: '/category', icon: <AppstoreAddOutlined />, label: '分类管理' },
    { key: '/order', icon: <FileTextOutlined />, label: '订单管理' },
    {
      key: '/finance',
      icon: <MoneyCollectOutlined />,
      label: '财务管理',
      children: [
        { key: '/finance/bill', label: '账单明细' },
        { key: '/finance/stat', label: '财务统计' },
      ],
    },
    { key: '/system', icon: <SettingOutlined />, label: '系统设置' },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => navigate(key);

  return (
    <Menu
      mode="inline"
      selectedKeys={[currentPath]}
      items={menuItems}
      onClick={handleMenuClick}
      style={{ height: '100%', borderRight: '1px solid #f0f0f0' }}
    />
  );
};

export default SiderMenu;