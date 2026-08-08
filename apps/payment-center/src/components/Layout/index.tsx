import { Layout } from 'antd';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PageKey } from '../../types/navigation';
import Header from './Header';
import SiderMenu from './SiderMenu';

const { Sider, Content } = Layout;

interface PaymentLayoutProps {
  collapsed: boolean;
  onToggle: () => void;
  pageKey: PageKey;
  children: ReactNode;
}

const PaymentLayout = ({ collapsed, onToggle, pageKey, children }: PaymentLayoutProps) => {
  const navigate = useNavigate();

  const handleSelect = (key: PageKey) => {
    navigate(key === 'dashboard' ? '/payment' : '/payment/records');
  };

  return (
    <Layout className="payment-shell">
      <Sider
        className="payment-sider"
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={76}
        width={248}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken !== collapsed) onToggle();
        }}
      >
        <div className="brand-lockup">
          <span className="brand-mark">$</span>
          {!collapsed && (
            <span className="brand-copy">
              <strong>Payment Hub</strong>
              <small>企业支付中心</small>
            </span>
          )}
        </div>
        <div className="menu-caption">{collapsed ? '•••' : '支付工作台'}</div>
        <SiderMenu selectedKey={pageKey} onSelect={handleSelect} />
      </Sider>

      <Layout className="payment-main-layout">
        <Header collapsed={collapsed} pageKey={pageKey} onToggle={onToggle} />
        <Content className="payment-content">
          <div className="page-stage">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PaymentLayout;
