import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { Card, Timeline, Typography } from 'antd';
import { lazy, Suspense } from 'react';

const DashboardCharts = lazy(() => import('./DashboardCharts'));

const ChartsLoading = () => (
  <>
    <Card className="chart-card top-chart" bordered={false} title="产品交易金额 TOP5">
      <div className="dashboard-chart chart-loading">图表加载中...</div>
    </Card>
    <Card className="chart-card" bordered={false} title="支付状态分布">
      <div className="dashboard-chart chart-loading">图表加载中...</div>
    </Card>
  </>
);

const metrics = [
  { label: '今日交易笔数', value: '1,286', note: '较昨日增长 12.8%', icon: <DollarCircleOutlined />, tone: 'navy' },
  { label: '今日交易金额', value: '¥86.4K', note: '企业版订阅贡献最高', icon: <CheckCircleOutlined />, tone: 'teal' },
  { label: '支付成功率', value: '98.6%', note: '近 7 天保持稳定', icon: <ClockCircleOutlined />, tone: 'gold' },
  { label: '退款金额', value: '¥12.8K', note: '本月累计 42 笔', icon: <RollbackOutlined />, tone: 'coral' },
];

const Dashboard = () => (
  <section className="dashboard-page">
    <div className="dashboard-hero">
      <div>
        <Typography.Text className="hero-kicker">PAYMENT OVERVIEW · 2026/08/08</Typography.Text>
        <Typography.Title level={2}>支付经营，一目了然。</Typography.Title>
        <Typography.Paragraph>
          今日支付交易平稳运行，累计处理 1,286 笔订单，资金到账和退款状态实时可查。
        </Typography.Paragraph>
      </div>
      <div className="hero-seal">
        <CheckCircleOutlined />
        <span>通道运行正常</span>
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
            { color: '#2f7085', children: <><strong>企业版订阅</strong><span>完成支付 ¥12,800 · 09:42</span></> },
            { color: '#e4a853', children: <><strong>远山零售集团</strong><span>订单进入处理中 · 09:15</span></> },
            { color: '#2f7085', children: <><strong>北辰供应链</strong><span>企业网银支付成功 · 昨天</span></> },
          ]}
        />
      </Card>
    </div>
  </section>
);

export default Dashboard;
