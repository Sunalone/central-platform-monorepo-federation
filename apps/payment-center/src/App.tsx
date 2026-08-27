import { App as AntdApp } from 'antd';
import { lazy, Suspense, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentLayout from './components/Layout';
import type { PageKey } from './types/navigation';
import './index.css';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const PaymentDetail = lazy(() => import('./pages/PaymentDetail'));
const PaymentManagement = lazy(() => import('./pages/PaymentManagement'));

const PageLoading = () => (
  <div className="page-chunk-loading" role="status">页面加载中...</div>
);

const RoutedPaymentApp = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const pageKey: PageKey = pathname.includes('/records') || pathname.includes('/detail/')
    ? 'payments'
    : 'dashboard';

  const page = pathname.includes('/detail/')
    ? <PaymentDetail />
    : pathname.includes('/records')
      ? <PaymentManagement />
      : <Dashboard />;

  return (
    <PaymentLayout
      collapsed={collapsed}
      pageKey={pageKey}
      onToggle={() => setCollapsed((value) => !value)}
    >
      <Suspense fallback={<PageLoading />}>{page}</Suspense>
    </PaymentLayout>
  );
};

const App = () => (
  <AntdApp>
    <RoutedPaymentApp />
  </AntdApp>
);

export default App;
