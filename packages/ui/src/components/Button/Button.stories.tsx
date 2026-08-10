import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Space } from 'antd';
import { Button } from './index';

const meta = {
  title: '基础/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: {
    children: '保存配置',
    color: 'blue',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
  render: () => (
    <Space wrap>
      <Button color="blue" icon={<PlusOutlined />}>新增用户</Button>
      <Button color="grey">取消</Button>
      <Button color="red" icon={<DeleteOutlined />}>删除协议</Button>
      <Button color="green">审核通过</Button>
      <Button color="yellow">待处理</Button>
      <Button color="blue" disabled>暂不可用</Button>
    </Space>
  ),
};
