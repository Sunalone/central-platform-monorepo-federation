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
      {/* 下层：侧边菜单 + 内容区域 */}
      <Layout style={{ background: '#fff' }}>
        {/* 左侧白色侧边栏 */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={220}
          style={{ background: '#fff' }}
        >
          <SiderMenu />
        </Sider>

        {/* 右侧主体内容区 */}
        <Content
          style={{
            margin: 24,
            padding: 0,
            background: '#fff',
            borderRadius: 12,
            minHeight: 'calc(100vh - 128px)',
          }}
        >
          {/* 页面子内容（统计卡片、图表、表格全部在这里渲染） */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;