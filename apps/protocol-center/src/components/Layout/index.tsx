import { useState } from 'react';
import { Layout } from 'antd';
import Dashboard from '../../pages/Dashboard';
import ProtocolManagement from '../../pages/ProtocolManagement';
import type { PageKey } from '../../types/navigation';
import Header from './Header';
import SiderMenu from './SiderMenu';

const { Sider, Content } = Layout;

const ProtocolLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [pageKey, setPageKey] = useState<PageKey>('dashboard');

  return (
    <Layout className="protocol-shell">
      <Sider
        className="protocol-sider"
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
              <strong>Protocol Hub</strong>
              <small>企业协议中心</small>
            </span>
          )}
        </div>
        <div className="menu-caption">{collapsed ? '•••' : '协议工作台'}</div>
        <SiderMenu selectedKey={pageKey} onSelect={setPageKey} />
      </Sider>

      <Layout className="protocol-main-layout">
        <Header
          collapsed={collapsed}
          pageKey={pageKey}
          onToggle={() => setCollapsed((value) => !value)}
        />
        <Content className="protocol-content">
          <div className="page-stage" key={pageKey}>
            {pageKey === 'dashboard' ? <Dashboard /> : <ProtocolManagement />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProtocolLayout;
