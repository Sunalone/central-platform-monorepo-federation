import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Descriptions } from 'antd';
import { PlatformCard } from './index';

const meta = {
  title: '布局/PlatformCard',
  component: PlatformCard,
  parameters: { layout: 'centered' },
  args: {
    eyebrow: 'PRODUCT CENTER',
    title: '产品配置概览',
    description: '用于承载中台页面中的业务卡片内容。',
  },
} satisfies Meta<typeof PlatformCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <PlatformCard {...args} extra={<Button type="link">查看更多</Button>} style={{ width: 620 }}>
      <Descriptions column={2} items={[
        { key: '1', label: '产品数量', children: '36' },
        { key: '2', label: '本月新增', children: '8' },
        { key: '3', label: '运行状态', children: '正常' },
        { key: '4', label: '最后同步', children: '今天 09:42' },
      ]} />
    </PlatformCard>
  ),
};
