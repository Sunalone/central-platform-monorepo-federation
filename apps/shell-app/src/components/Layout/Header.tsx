import {
  AppstoreOutlined,
  FileProtectOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, Menu, Space, Tag } from 'antd';
import type { MenuProps } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const topMenuItems: MenuProps['items'] = [
  { key: '/product', icon: <AppstoreOutlined />, label: '产品中心' },
  { key: '/protocol', icon: <FileProtectOutlined />, label: '协议中心' },
];

const userMenuItems: MenuProps['items'] = [
  { key: 'setting', icon: <SettingOutlined />, label: '个人设置' },
  { type: 'divider' },
  { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
];

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentKey = pathname.startsWith('/protocol') ? '/protocol' : '/product';

  return (
    <header className="shell-header">
      <div className="shell-header-left">
        <button className="shell-brand" type="button" onClick={() => navigate('/product')}>
          <span className="shell-brand-mark">C</span>
          <span>
            <strong>Central Desk</strong>
            <small>业务中台</small>
          </span>
        </button>
        <Menu
          className="shell-nav"
          mode="horizontal"
          items={topMenuItems}
          selectedKeys={[currentKey]}
          onClick={({ key }) => navigate(key)}
        />
      </div>

      <div className="shell-user">
        <Tag className="shell-environment">DEV</Tag>
        <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
          <Space className="shell-user-trigger" size={9}>
            <Avatar size={30} icon={<UserOutlined />} />
            <span>
              <strong>管理员</strong>
              <small>平台运营</small>
            </span>
          </Space>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
