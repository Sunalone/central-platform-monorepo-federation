import { FileTextOutlined, SettingOutlined } from '@ant-design/icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Divider, Input, Space, Typography } from 'antd';
import { useState } from 'react';
import { Modal } from './index';
import type { ModalProps } from './index';

const meta = {
  title: '反馈/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  args: {
    title: '配置详情',
    open: false,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultModalDemo = (args: ModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" icon={<SettingOutlined />} onClick={() => setOpen(true)}>
        打开中号弹窗
      </Button>
      <Modal {...args} open={open} onCancel={() => setOpen(false)} onOk={() => setOpen(false)}>
        <Typography.Paragraph>
          这是默认的中号弹窗，关闭时会销毁内部内容，点击遮罩层不会关闭。
        </Typography.Paragraph>
        <Input placeholder="输入后关闭，再次打开观察内容是否销毁" />
      </Modal>
    </>
  );
};

const AllSizesModalDemo = (args: ModalProps) => {
  const [size, setSize] = useState<'small' | 'middle' | 'large' | null>(null);

  return (
    <Space wrap>
      {(['small', 'middle', 'large'] as const).map((item) => (
        <Button key={item} onClick={() => setSize(item)}>
          {item === 'small' ? '小尺寸' : item === 'middle' ? '中尺寸' : '大尺寸'}
        </Button>
      ))}
      <Modal
        {...args}
        size={size ?? 'middle'}
        open={size !== null}
        title={`${size === 'small' ? '小' : size === 'middle' ? '中' : '大'}尺寸弹窗`}
        onCancel={() => setSize(null)}
        footer={<Button onClick={() => setSize(null)}>关闭</Button>}
      >
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Typography.Text><FileTextOutlined /> 当前尺寸：{size}</Typography.Text>
          <Divider style={{ margin: '12px 0' }} />
          <Typography.Text type="secondary">遮罩不可点击关闭，右上角关闭按钮可用。</Typography.Text>
        </Space>
      </Modal>
    </Space>
  );
};

const LongContentModalDemo = (args: ModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>打开长内容弹窗</Button>
      <Modal {...args} open={open} title="长内容弹窗" onCancel={() => setOpen(false)} onOk={() => setOpen(false)}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {Array.from({ length: 20 }, (_, index) => (
            <Typography.Text key={index}>
              {index + 1}. 内容超出弹窗可视区域后，Modal body 会自动出现纵向滚动条。
            </Typography.Text>
          ))}
        </Space>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: (args) => <DefaultModalDemo {...args} />,
};

export const AllSizes: Story = {
  render: (args) => <AllSizesModalDemo {...args} />,
};

export const LongContent: Story = {
  render: (args) => <LongContentModalDemo {...args} />,
};
