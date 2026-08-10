import { RiseOutlined, TeamOutlined } from '@ant-design/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricCard } from './index';

const meta = {
  title: '数据展示/MetricCard',
  component: MetricCard,
  parameters: { layout: 'centered' },
  args: {
    label: '用户总数',
    value: '1,286',
    note: '覆盖 56 家企业',
    icon: <TeamOutlined />,
    tone: 'teal',
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSuffix: Story = {
  args: {
    label: '本月增长',
    value: 18.6,
    suffix: '%',
    note: <span><RiseOutlined /> 较上月提升</span>,
    icon: <RiseOutlined />,
    tone: 'gold',
  },
};
