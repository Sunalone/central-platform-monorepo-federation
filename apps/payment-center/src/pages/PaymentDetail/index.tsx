import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { Card, Descriptions, Empty, Space, Tag, Typography } from 'antd';
import { Button } from '@central-platform/ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PaymentFlowGraph from '../../components/PaymentFlowGraph';
import type { PaymentFlowStep } from '../../components/PaymentFlowGraph';
import { paymentRecords } from '../../data/payments';
import type { PaymentRecord } from '../../data/payments';

const statusColor: Record<PaymentRecord['status'], string> = {
  已支付: 'green',
  处理中: 'blue',
  已退款: 'orange',
  待支付: 'default',
};

const buildFlowSteps = (record: PaymentRecord): PaymentFlowStep[] => {
  const isProcessing = record.status === '处理中';
  const isRefunded = record.status === '已退款';
  const isPending = record.status === '待支付';

  return [
    {
      id: 'created',
      title: '创建订单',
      status: '已完成',
      time: record.paidAt === '-' ? '08:58' : record.paidAt.slice(11),
      description: '订单信息已生成',
      state: 'success',
      details: [
        { label: '订单号', value: record.orderNo },
        { label: '创建人', value: record.operator },
        { label: '产品信息', value: record.product },
        { label: '客户', value: record.customer },
      ],
    },
    {
      id: 'risk-control',
      title: '风控校验',
      status: '已完成',
      time: record.paidAt === '-' ? '08:58' : record.paidAt.slice(11),
      description: '风险检查通过',
      state: 'success',
      details: [
        { label: '校验结果', value: '通过' },
        { label: '校验策略', value: '标准支付风控策略' },
        { label: '校验时间', value: record.paidAt === '-' ? '08:58' : record.paidAt.slice(11) },
      ],
    },
    {
      id: 'channel',
      title: '支付渠道',
      status: isPending ? '待处理' : isProcessing ? '处理中' : '已完成',
      time: isProcessing ? '09:15' : record.paidAt === '-' ? '-' : record.paidAt.slice(11),
      description: record.channel,
      state: isPending ? 'pending' : isProcessing ? 'processing' : 'success',
      details: [
        { label: '支付渠道', value: record.channel },
        { label: '支付金额', value: `¥ ${record.amount.toLocaleString()}` },
        { label: '渠道状态', value: isProcessing ? '等待回调' : isPending ? '等待支付' : '回调成功' },
      ],
    },
    {
      id: 'settlement',
      title: '资金入账',
      status: isRefunded ? '已退款' : isPending ? '待处理' : isProcessing ? '待处理' : '已完成',
      time: isRefunded ? '18:40' : isPending || isProcessing ? '-' : record.paidAt.slice(11),
      description: isRefunded ? '原路退回' : '资金到账确认',
      state: isRefunded ? 'warning' : isPending || isProcessing ? 'pending' : 'success',
      details: [
        { label: '处理结果', value: isRefunded ? '原路退款' : isPending || isProcessing ? '等待入账' : '入账成功' },
        { label: '入账金额', value: `¥ ${record.amount.toLocaleString()}` },
        { label: '处理时间', value: isRefunded ? '18:40' : isPending || isProcessing ? '-' : record.paidAt.slice(11) },
      ],
    },
    {
      id: 'reconciliation',
      title: '完成对账',
      status: record.status === '已支付' ? '已完成' : '待处理',
      time: record.status === '已支付' ? '次日 02:00' : '-',
      description: '等待日终对账',
      state: record.status === '已支付' ? 'success' : 'pending',
      details: [
        { label: '对账周期', value: '每日 02:00' },
        { label: '对账状态', value: record.status === '已支付' ? '已完成' : '待处理' },
        { label: '对账范围', value: '支付渠道与资金账户' },
      ],
    },
  ];
};

const PaymentDetail = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [selectedStepId, setSelectedStepId] = useState('channel');
  const orderNo = pathname.split('/detail/')[1] ?? '';
  const record = paymentRecords.find((item) => item.orderNo === decodeURIComponent(orderNo));

  if (!record) {
    return (
      <section className="payment-detail-page">
        <Card bordered={false}><Empty description="未找到支付订单" /></Card>
      </section>
    );
  }

  const flowSteps = buildFlowSteps(record);
  const selectedStep = flowSteps.find((step) => step.id === selectedStepId) ?? flowSteps[0];

  return (
    <section className="payment-detail-page">
      <div className="page-intro detail-intro">
        <div>
          <Button type="link" className="back-link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/payment/records')}>
            返回支付记录
          </Button>
          <Typography.Title level={2}>支付详情</Typography.Title>
          <Typography.Text>{record.orderNo} · {record.customer}</Typography.Text>
        </div>
        <Tag color={statusColor[record.status]}>{record.status}</Tag>
      </div>

      <div className="detail-summary-grid">
        <Card className="detail-highlight-card" bordered={false}>
          <div className="detail-highlight-icon"><DollarOutlined /></div>
          <span>支付金额</span>
          <strong>¥ {record.amount.toLocaleString()}</strong>
          <small>{record.product}</small>
        </Card>
        <Card className="detail-summary-card" bordered={false}>
          <Descriptions column={2} size="small" title="订单信息">
            <Descriptions.Item label="支付单号">{record.orderNo}</Descriptions.Item>
            <Descriptions.Item label="支付渠道">{record.channel}</Descriptions.Item>
            <Descriptions.Item label="客户名称">{record.customer}</Descriptions.Item>
            <Descriptions.Item label="经办人">{record.operator}</Descriptions.Item>
            <Descriptions.Item label="支付时间">{record.paidAt}</Descriptions.Item>
            <Descriptions.Item label="订单状态"><Tag color={statusColor[record.status]}>{record.status}</Tag></Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <Card
        className="flow-card"
        bordered={false}
        title={<Space><CheckCircleOutlined />支付链路</Space>}
      >
        <PaymentFlowGraph steps={flowSteps} onStepSelect={setSelectedStepId} />
        <div className="flow-legend">
          <span><i className="legend-dot legend-success" />已完成</span>
          <span><i className="legend-dot legend-processing" />处理中</span>
          <span><i className="legend-dot legend-pending" />待处理</span>
          <span><i className="legend-dot legend-warning" />退款 / 异常</span>
        </div>
        <div className="flow-step-detail">
          <div className="flow-step-detail-title">
            <strong>{selectedStep.title}</strong>
            <Tag color={selectedStep.state === 'success' ? 'green' : selectedStep.state === 'processing' ? 'blue' : selectedStep.state === 'warning' ? 'orange' : 'default'}>
              {selectedStep.status}
            </Tag>
          </div>
          <span>{selectedStep.description}</span>
          <small>处理时间：{selectedStep.time}</small>
        </div>
      </Card>
    </section>
  );
};

export default PaymentDetail;
