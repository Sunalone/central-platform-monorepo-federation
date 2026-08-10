import type { Meta, StoryObj } from '@storybook/react-vite';
import { Space } from 'antd';
import { StatusTag } from './index';

const meta = {
  title: '反馈/StatusTag',
  component: StatusTag,
  parameters: { layout: 'centered' },
  args: {
    tone: 'success',
    children: '正常',
  },
} satisfies Meta<typeof StatusTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllTones: Story = {
  render: () => (
    <Space wrap>
      <StatusTag tone="success">正常</StatusTag>
      <StatusTag tone="processing">处理中</StatusTag>
      <StatusTag tone="warning">待处理</StatusTag>
      <StatusTag tone="error">异常</StatusTag>
      <StatusTag>草稿</StatusTag>
    </Space>
  ),
};
