import {
  DollarOutlined,
  FileDoneOutlined,
  RiseOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Card, Progress, Tag, Typography } from 'antd';
import { lazy, Suspense } from 'react';

const DashboardCharts = lazy(() => import('./DashboardCharts'));

const ChartsLoading = () => (
  <>
    <Card className="chart-card" bordered={false} title="近 7 日销售趋势">
      <div className="dashboard-chart chart-loading">图表加载中...</div>
    </Card>
    <Card className="chart-card" bordered={false} title="商品类目销量">
      <div className="dashboard-chart chart-loading">图表加载中...</div>
    </Card>
  </>
);

const metrics = [
  { label: '今日销售额', value: '¥52,680', trend: '+12.8%', icon: <DollarOutlined />, tone: 'coral' },
  { label: '今日订单', value: '286', trend: '+8.4%', icon: <FileDoneOutlined />, tone: 'green' },
  { label: '在售商品', value: '1,248', trend: '+24', icon: <ShoppingOutlined />, tone: 'gold' },
  { label: '转化率', value: '4.82%', trend: '+0.6%', icon: <RiseOutlined />, tone: 'blue' },
];

const Dashboard = () => (
  <section className="dashboard-page">
    <div className="dashboard-hero">
      <div>
        <Typography.Text className="hero-kicker">2026 年 8 月 2 日 · 周日</Typography.Text>
        <Typography.Title level={2}>上午好，今天的生意不错。</Typography.Title>
        <Typography.Paragraph>
          截至 10:30，销售额已完成今日目标的 68%，数码办公类目表现领先。
        </Typography.Paragraph>
      </div>
      <div className="target-progress">
        <Progress type="circle" percent={68} size={76} strokeColor="#e97852" />
        <span>今日目标</span>
      </div>
    </div>

    <div className="metric-grid">
      {metrics.map((metric) => (
        <Card key={metric.label} className="metric-card" bordered={false}>
          <div className={`metric-icon metric-${metric.tone}`}>{metric.icon}</div>
          <Typography.Text>{metric.label}</Typography.Text>
          <div className="metric-value-row">
            <strong>{metric.value}</strong>
            <Tag color="green">{metric.trend}</Tag>
          </div>
          <span className="metric-note">较昨日同期</span>
        </Card>
      ))}
    </div>

    <div className="chart-grid">
      <Suspense fallback={<ChartsLoading />}>
        <DashboardCharts />
      </Suspense>
    </div>
  </section>
);

export default Dashboard;
