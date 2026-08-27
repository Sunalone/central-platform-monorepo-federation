import { lazy, Suspense, useState } from 'react';
import { Layout } from 'antd';
import type { PageKey } from '../../types/navigation';
import Header from './Header';
import SiderMenu from './SiderMenu';

const { Sider, Content } = Layout;
const Dashboard = lazy(() => import('../../pages/Dashboard'));
const Agreements = lazy(() => import('../../pages/Agreements'));
const ManagementPage = lazy(() => import('../../pages/Management'));

const PageLoading = () => (
  <div className="page-chunk-loading" role="status">页面加载中...</div>
);

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
            <Suspense fallback={<PageLoading />}>
              {pageKey === 'dashboard' && <Dashboard />}
              {pageKey === 'agreements' && <Agreements />}
              {pageKey !== 'dashboard' && pageKey !== 'agreements' && (
                <ManagementPage pageKey={pageKey} />
              )}
            </Suspense>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
