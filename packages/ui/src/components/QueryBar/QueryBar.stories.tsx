import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, Select } from 'antd';
import { QueryBar } from './index';

const meta = {
  title: '表单/QueryBar',
  component: QueryBar,
  parameters: { layout: 'centered' },
  args: { children: null },
} satisfies Meta<typeof QueryBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <QueryBar onSearch={() => undefined} onReset={() => undefined}>
      <Input placeholder="输入名称或编号" style={{ width: 240 }} />
      <Select placeholder="选择状态" style={{ width: 160 }} options={[
        { label: '正常', value: 'normal' },
        { label: '停用', value: 'disabled' },
      ]} />
    </QueryBar>
  ),
};
