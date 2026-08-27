import { App as AntdApp } from 'antd';
import { lazy, Suspense, useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserLayout from './components/Layout';
import type { PageKey } from './types/navigation';
import './index.css';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserDetail = lazy(() => import('./pages/UserDetail'));
const UserManagement = lazy(() => import('./pages/UserManagement'));

const PageLoading = () => (
  <div className="page-chunk-loading" role="status">页面加载中...</div>
);

const RoutedUserApp = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const pageKey: PageKey = pathname.includes('/records') || pathname.includes('/detail/')
    ? 'users'
    : 'dashboard';

  const page = pathname.includes('/detail/')
    ? <UserDetail key={pathname} />
    : pathname.includes('/records')
      ? <UserManagement />
      : <Dashboard />;

  return (
    <UserLayout
      collapsed={collapsed}
      pageKey={pageKey}
      onToggle={() => setCollapsed((value) => !value)}
    >
      <Suspense fallback={<PageLoading />}>{page}</Suspense>
    </UserLayout>
  );
};

const App = () => (
  <AntdApp>
    <RoutedUserApp />
  </AntdApp>
);

export default App;

