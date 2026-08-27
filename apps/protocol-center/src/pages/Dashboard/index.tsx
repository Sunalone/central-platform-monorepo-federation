import {
  ClockCircleOutlined,
  FileDoneOutlined,
  FileProtectOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Card, Timeline, Typography } from 'antd';
import { lazy, Suspense } from 'react';

const DashboardCharts = lazy(() => import('./DashboardCharts'));

const ChartsLoading = () => (
  <>
    <Card className="chart-card top-chart" bordered={false} title="协议被使用 TOP5">
      <div className="dashboard-chart chart-loading">图表加载中...</div>
    </Card>
    <Card className="chart-card" bordered={false} title="协议状态分布">
      <div className="dashboard-chart chart-loading">图表加载中...</div>
    </Card>
  </>
);

const metrics = [
  { label: '协议总数', value: 12, note: '覆盖 5 个业务域', icon: <FileProtectOutlined />, tone: 'navy' },
  { label: '已生效', value: 8, note: '本月新增 2 份', icon: <FileDoneOutlined />, tone: 'teal' },
  { label: '草稿协议', value: 3, note: '待合规审核', icon: <FileTextOutlined />, tone: 'gold' },
  { label: '即将到期', value: 1, note: '30 天内到期', icon: <ClockCircleOutlined />, tone: 'coral' },
];

const Dashboard = () => (
  <section className="dashboard-page">
    <div className="dashboard-hero">
      <div>
        <Typography.Text className="hero-kicker">PROTOCOL OVERVIEW · 2026/08/02</Typography.Text>
        <Typography.Title level={2}>协议资产，一目了然。</Typography.Title>
        <Typography.Paragraph>
          当前协议库共 12 份文件，本月累计被业务系统调用 556 次，整体运行稳定。
        </Typography.Paragraph>
      </div>
      <div className="hero-seal">
        <FileProtectOutlined />
        <span>文件校验正常</span>
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
            { color: '#2f7085', children: <><strong>企业产品服务协议</strong><span>发布 V3.2 版本 · 09:30</span></> },
            { color: '#e4a853', children: <><strong>开放接口接入协议</strong><span>进入到期提醒 · 昨天</span></> },
            { color: '#2f7085', children: <><strong>数据安全补充协议</strong><span>完成合规复核 · 08/01</span></> },
          ]}
        />
      </Card>
    </div>
  </section>
);

export default Dashboard;
