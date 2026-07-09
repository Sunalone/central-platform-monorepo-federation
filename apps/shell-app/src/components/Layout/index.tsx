import { useState } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SiderMenu from './SiderMenu';

// 解构Antd布局组件
const { Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      {/* 【最顶部全局通栏导航】截图最上方Tab栏 */}
      <Header />

      {/* 下层：侧边菜单 + 内容区域 */}
      <Layout style={{ background: '#fff' }}>
      <Outlet />
      </Layout>
    </Layout>
  );
};

export default AdminLayout;