import { useState } from 'react';
import { Layout } from 'antd';
import Agreements from '../../pages/Agreements';
import Dashboard from '../../pages/Dashboard';
import ManagementPage from '../../pages/Management';
import type { PageKey } from '../../types/navigation';
import Header from './Header';
import SiderMenu from './SiderMenu';

const { Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [pageKey, setPageKey] = useState<PageKey>('dashboard');

  return (
    <Layout className="product-shell">
      <Sider
        className="product-sider"
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={76}
        width={248}
        breakpoint="lg"
        onBreakpoint={setCollapsed}
      >
        <div className="brand-lockup">
          <span className="brand-mark">P</span>
          {!collapsed && (
            <span className="brand-copy">
              <strong>Product Hub</strong>
              <small>产品运营中心</small>
            </span>
          )}
        </div>
        <div className="menu-caption">{collapsed ? '•••' : '工作台'}</div>
        <SiderMenu selectedKey={pageKey} onSelect={setPageKey} />
        {!collapsed && (
          <div className="sider-footnote">
            <span className="status-dot" />
            服务运行正常
          </div>
        )}
      </Sider>

      <Layout className="product-main-layout">
        <Header
          collapsed={collapsed}
          pageKey={pageKey}
          onToggle={() => setCollapsed((value) => !value)}
        />
        <Content className="product-content">
          <div className="page-stage" key={pageKey}>
            {pageKey === 'dashboard' && <Dashboard />}
            {pageKey === 'agreements' && <Agreements />}
            {pageKey !== 'dashboard' && pageKey !== 'agreements' && (
              <ManagementPage pageKey={pageKey} />
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
