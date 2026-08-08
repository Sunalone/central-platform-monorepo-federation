import {
  CheckCircleOutlined,
  StopOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Card, Tag, Timeline, Typography } from 'antd';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { init, use as registerECharts } from 'echarts/core';
import type { EChartsCoreOption } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';

registerECharts([BarChart, PieChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

const companyOption: EChartsCoreOption = {
  color: ['#d68c45'],
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 18, right: 28, top: 12, bottom: 8, containLabel: true },
  xAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#e9edf1', type: 'dashed' } },
    axisLabel: { color: '#84909c' },
  },
  yAxis: {
    type: 'category',
    inverse: true,
    data: ['星河科技', '远山零售', '北辰供应链', '云杉教育', '启明制造'],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: '#566474', width: 110, overflow: 'truncate' },
  },
  series: [{
    name: '用户数',
    type: 'bar',
    barWidth: 16,
    data: [286, 224, 168, 132, 98],
    label: { show: true, position: 'right', color: '#566474' },
    itemStyle: { borderRadius: [2, 8, 8, 2] },
  }],
};

const statusOption: EChartsCoreOption = {
  color: ['#2f7085', '#e4a853', '#c96852'],
  tooltip: { trigger: 'item' },
  legend: { bottom: 4, icon: 'circle', textStyle: { color: '#687582' } },
  series: [{
    name: '用户状态',
    type: 'pie',
    radius: ['48%', '70%'],
    center: ['50%', '43%'],
    label: { formatter: '{b}\n{c} 人', color: '#566474' },
    itemStyle: { borderColor: '#fffdfa', borderWidth: 4, borderRadius: 8 },
    data: [
      { value: 1068, name: '正常' },
      { value: 96, name: '待激活' },
      { value: 42, name: '已停用' },
    ],
  }],
};

interface ChartProps {
  option: EChartsCoreOption;
}

const Chart = ({ option }: ChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return undefined;
    const chart = init(chartRef.current);
    chart.setOption(option);
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(chartRef.current);
    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [option]);

  return <div ref={chartRef} className="dashboard-chart" />;
};

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
      <Card className="chart-card top-chart" bordered={false} title="企业用户数 TOP5" extra={<Tag>本月</Tag>}>
        <Chart option={companyOption} />
      </Card>
      <Card className="chart-card" bordered={false} title="用户状态分布">
        <Chart option={statusOption} />
      </Card>
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
