import {
  DollarOutlined,
  FileDoneOutlined,
  RiseOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Card, Progress, Space, Tag, Typography } from 'antd';
import {
  createChart,
  defaultBarOption,
  defaultLineOption,
  graphic,
  type EChartsCoreOption,
} from '@central-platform/charts';
import { useEffect, useRef } from 'react';

const salesOption: EChartsCoreOption = {
  ...defaultLineOption(),
  color: ['#e97852'],
  tooltip: { trigger: 'axis' },
  grid: { left: 18, right: 18, top: 34, bottom: 16, containLabel: true },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['07/27', '07/28', '07/29', '07/30', '07/31', '08/01', '08/02'],
    axisLine: { lineStyle: { color: '#dce3df' } },
    axisLabel: { color: '#7b8781' },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#7b8781', formatter: '¥{value}k' },
    splitLine: { lineStyle: { color: '#edf0ee', type: 'dashed' } },
  },
  series: [
    {
      name: '销售额',
      type: 'line',
      smooth: true,
      symbolSize: 7,
      data: [18, 24, 21, 36, 32, 46, 52],
      lineStyle: { width: 3 },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(233, 120, 82, 0.30)' },
          { offset: 1, color: 'rgba(233, 120, 82, 0.01)' },
        ]),
      },
    },
  ],
};

const categoryOption: EChartsCoreOption = {
  ...defaultBarOption(),
  color: ['#244d3c'],
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 18, right: 18, top: 34, bottom: 16, containLabel: true },
  xAxis: {
    type: 'category',
    data: ['电脑配件', '影音设备', '家居生活', '食品饮料', '办公用品'],
    axisTick: { show: false },
    axisLine: { lineStyle: { color: '#dce3df' } },
    axisLabel: { color: '#7b8781', interval: 0 },
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: '#7b8781' },
    splitLine: { lineStyle: { color: '#edf0ee', type: 'dashed' } },
  },
  series: [
    {
      name: '销量',
      type: 'bar',
      barWidth: 24,
      data: [268, 192, 224, 156, 118],
      itemStyle: { borderRadius: [7, 7, 2, 2] },
    },
  ],
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
      <Card
        className="chart-card"
        bordered={false}
        title="近 7 日销售趋势"
        extra={<Space><span className="chart-legend coral" />销售额（千元）</Space>}
      >
        <Chart option={salesOption} />
      </Card>
      <Card
        className="chart-card"
        bordered={false}
        title="商品类目销量"
        extra={<Space><span className="chart-legend green" />销量（件）</Space>}
      >
        <Chart option={categoryOption} />
      </Card>
    </div>
  </section>
);

export default Dashboard;
