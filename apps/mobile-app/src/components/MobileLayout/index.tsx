import TabBar from 'antd-mobile/es/components/tab-bar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

type ModuleKey = 'products' | 'payments' | 'users';

const modules: Array<{ key: ModuleKey; label: string; subtitle: string }> = [
  { key: 'products', label: '产品', subtitle: '产品经营与配置' },
  { key: 'payments', label: '支付', subtitle: '交易查询与链路' },
  { key: 'users', label: '用户', subtitle: '客户资产与认证' },
];

const ModuleIcon = ({ type, active }: { type: ModuleKey; active: boolean }) => {
  const commonProps = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: active ? 2.2 : 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  if (type === 'products') {
    return (
      <svg {...commonProps}>
        <path d="m4 7 8-4 8 4-8 4-8-4Z" />
        <path d="M4 7v10l8 4 8-4V7M12 11v10" />
      </svg>
    );
  }

  if (type === 'payments') {
    return (
      <svg {...commonProps}>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M3 10h18M7 15h4" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" />
    </svg>
  );
};

const MobileLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const activeKey = modules.find(({ key }) => pathname.includes(`/${key}`))?.key ?? 'products';
  const activeModule = modules.find(({ key }) => key === activeKey) ?? modules[0];

  return (
    <div className="mobile-shell">
      <header className="app-header">
        <div className="app-header__brand" aria-hidden="true">C</div>
        <div className="app-header__copy">
          <strong>Central Go</strong>
          <span>{activeModule.subtitle}</span>
        </div>
        <div className="app-header__env">演示环境</div>
      </header>

      <div className="app-content">
        <Outlet />
      </div>

      <nav className="app-tabbar" aria-label="业务模块导航">
        <TabBar activeKey={activeKey} onChange={(key) => navigate(key)} safeArea>
          {modules.map((item) => (
            <TabBar.Item
              key={item.key}
              title={item.label}
              icon={(active) => <ModuleIcon type={item.key} active={active} />}
            />
          ))}
        </TabBar>
      </nav>
    </div>
  );
};

export default MobileLayout;
