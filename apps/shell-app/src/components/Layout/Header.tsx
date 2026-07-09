import { lazy,Suspense } from 'react';
import { Dropdown, Space, Menu } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {}

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 提取一级路由，匹配顶部菜单选中态
  const currentPath = location.pathname;
  const currentKey = `/${currentPath.split('/')[1] || 'product'}`;

  // 顶部水平导航菜单数据
  const topMenuItems: MenuProps['items'] = [
    { key: '/product', label: '产品中心' },
    { key: '/pay', label: '支付中心' },
    { key: '/order', label: '订单中心' },
    { key: '/member', label: '会员中心' },
    { key: '/dashboard', label: '数据概览' },
  ];

  // 菜单点击跳转
  const handleTopMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key);
  };

  // 右上角用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    { key: 'setting', icon: <SettingOutlined />, label: '个人设置' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];


  return (
    <div
      style={{
        height: 44,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      {/* 左侧Logo + 水平顶部Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#165dff' }}>业务中台</div>

        {/* 你指定的水平菜单 */}
        <Menu
          onClick={handleTopMenuClick}
          selectedKeys={[currentKey]}
          mode="horizontal"
          items={topMenuItems}
          style={{ borderBottom: 'none' }}
        />
      </div>

      {/* 右侧登录/用户下拉 */}
      <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
        <Space style={{ cursor: 'pointer' }}>
          <span>登录</span>
          <UserOutlined />
          <span>管理员</span>
          <span>退出</span>
        </Space>
      </Dropdown>
    </div>
  );
};

export default Header;