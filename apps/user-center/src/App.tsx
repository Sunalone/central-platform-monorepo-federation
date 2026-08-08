import { App as AntdApp } from 'antd';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import UserLayout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UserDetail from './pages/UserDetail';
import UserManagement from './pages/UserManagement';
import type { PageKey } from './types/navigation';
import './index.css';

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
      {page}
    </UserLayout>
  );
};

const App = () => (
  <AntdApp>
    <RoutedUserApp />
  </AntdApp>
);

export default App;

