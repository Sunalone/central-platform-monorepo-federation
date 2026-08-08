import { App as AntdApp } from 'antd';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PaymentLayout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PaymentDetail from './pages/PaymentDetail';
import PaymentManagement from './pages/PaymentManagement';
import type { PageKey } from './types/navigation';
import './index.css';

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
      {page}
    </PaymentLayout>
  );
};

const App = () => (
  <AntdApp>
    <RoutedPaymentApp />
  </AntdApp>
);

export default App;
