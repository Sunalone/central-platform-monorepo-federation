import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { Card, Tag, Timeline, Typography } from 'antd';
import { createChart, defaultBarOption, defaultPieOption, type EChartsCoreOption } from '@central-platform/charts';
import { useEffect, useRef } from 'react';

const topProductsOption: EChartsCoreOption = {
  ...defaultBarOption(),
  color: ['#d68c45'],
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 16, right: 28, top: 12, bottom: 8, containLabel: true },
  xAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#e9edf1', type: 'dashed' } },
    axisLabel: { color: '#84909c' },
  },
  yAxis: {
    type: 'category',
    inverse: true,
    data: ['企业版订阅', '标准版订阅', '数据增值包', 'API 调用包', '增值服务包'],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#566474', width: 110, overflow: 'truncate' },
  },
  series: [{
    name: '交易金额（元）',
    type: 'bar',
    barWidth: 16,
    data: [38600, 22400, 16800, 9200, 5800],
    label: { show: true, position: 'right', color: '#566474' },
    itemStyle: { borderRadius: [2, 8, 8, 2] },
  }],
};

const statusOption: EChartsCoreOption = {
  ...defaultPieOption(),
  color: ['#2f7085', '#e4a853', '#c96852', '#9ba8b3'],
  tooltip: { trigger: 'item' },
  legend: { bottom: 4, icon: 'circle', textStyle: { color: '#687582' } },
  series: [{
    name: '支付状态',
    type: 'pie',
    radius: ['48%', '70%'],
    center: ['50%', '43%'],
    label: { formatter: '{b}\n{c} 笔', color: '#566474' },
    itemStyle: { borderColor: '#fffdfa', borderWidth: 4, borderRadius: 8 },
    data: [
      { value: 1068, name: '已支付' },
      { value: 96, name: '处理中' },
      { value: 42, name: '已退款' },
      { value: 80, name: '待支付' },
    ],
  }],
};

interface ChartProps {
  option: EChartsCoreOption;
}

const Chart = ({ option }: ChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const controller = createChart(containerRef.current, option);
    return controller.dispose;
  }, [option]);

  return <div ref={containerRef} className="dashboard-chart" />;
};

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
      <Card className="chart-card top-chart" bordered={false} title="产品交易金额 TOP5" extra={<Tag>今日</Tag>}>
        <Chart option={topProductsOption} />
      </Card>
      <Card className="chart-card" bordered={false} title="支付状态分布">
        <Chart option={statusOption} />
      </Card>
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
