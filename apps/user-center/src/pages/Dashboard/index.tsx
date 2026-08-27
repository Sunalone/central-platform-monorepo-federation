import {
  CheckCircleOutlined,
  StopOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Card, Timeline, Typography } from 'antd';
import { lazy, Suspense } from 'react';

const DashboardCharts = lazy(() => import('./DashboardCharts'));

const ChartsLoading = () => (
  <>
    <Card className="chart-card top-chart" bordered={false} title="企业用户数 TOP5">
      <div className="dashboard-chart chart-loading">图表加载中...</div>
    </Card>
    <Card className="chart-card" bordered={false} title="用户状态分布">
      <div className="dashboard-chart chart-loading">图表加载中...</div>
    </Card>
  </>
);

const metrics = [
  { label: '用户总数', value: '1,286', note: '覆盖 56 家企业', icon: <TeamOutlined />, tone: 'navy' },
  { label: '正常用户', value: '1,068', note: '本月新增 128 人', icon: <CheckCircleOutlined />, tone: 'teal' },
  { label: '待激活用户', value: '96', note: '建议在 7 天内完成激活', icon: <UserAddOutlined />, tone: 'gold' },
  { label: '已停用用户', value: '42', note: '本月停用 6 人', icon: <StopOutlined />, tone: 'coral' },
];

const Dashboard = () => (
  <section className="dashboard-page">
    <div className="dashboard-hero">
      <div>
        <Typography.Text className="hero-kicker">USER OVERVIEW · 2026/08/08</Typography.Text>
        <Typography.Title level={2}>用户资产，一目了然。</Typography.Title>
        <Typography.Paragraph>
          当前用户库共 1,286 位用户，覆盖企业、角色和登录状态，账号运行整体稳定。
        </Typography.Paragraph>
      </div>
      <div className="hero-seal">
        <CheckCircleOutlined />
        <span>账号运行正常</span>
      </div>
    </div>

    <div className="metric-grid">
      {metrics.map((metric) => (
        <Card key={metric.label} className="metric-card" bordered={false}>
          <div className={`metric-icon metric-${metric.tone}`}>{metric.icon}</div>
          <Typography.Text>{metric.label}</Typography.Text>
          <strong className="metric-value">{metric.value}</strong>
          <span className="metric-note">{metric.note}</span>
        </Card>
      ))}
    </div>

    <div className="dashboard-grid">
      <Suspense fallback={<ChartsLoading />}>
        <DashboardCharts />
      </Suspense>
      <Card className="activity-card" bordered={false} title="最近动态">
        <Timeline
          items={[
            { color: '#2f7085', children: <><strong>星河科技有限公司</strong><span>新增企业管理员 12 人 · 09:42</span></> },
            { color: '#e4a853', children: <><strong>北辰供应链</strong><span>邀请用户进入待激活状态 · 09:15</span></> },
            { color: '#2f7085', children: <><strong>云杉教育科技</strong><span>停用普通用户 3 人 · 昨天</span></> },
          ]}
        />
      </Card>
    </div>
  </section>
);

export default Dashboard;
