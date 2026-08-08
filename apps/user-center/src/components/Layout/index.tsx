import { Layout } from 'antd';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PageKey } from '../../types/navigation';
import Header from './Header';
import SiderMenu from './SiderMenu';

const { Sider, Content } = Layout;

interface UserLayoutProps {
  collapsed: boolean;
  onToggle: () => void;
  pageKey: PageKey;
  children: ReactNode;
}

const UserLayout = ({ collapsed, onToggle, pageKey, children }: UserLayoutProps) => {
  const navigate = useNavigate();

  const handleSelect = (key: PageKey) => {
    navigate(key === 'dashboard' ? '/user' : '/user/records');
  };

  return (
    <Layout className="user-shell">
      <Sider
        className="user-sider"
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
              <strong>User Hub</strong>
              <small>企业用户中心</small>
            </span>
          )}
        </div>
        <div className="menu-caption">{collapsed ? '•••' : '用户工作台'}</div>
        <SiderMenu selectedKey={pageKey} onSelect={handleSelect} />
      </Sider>

      <Layout className="user-main-layout">
        <Header collapsed={collapsed} pageKey={pageKey} onToggle={onToggle} />
        <Content className="user-content">
          <div className="page-stage">{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserLayout;

