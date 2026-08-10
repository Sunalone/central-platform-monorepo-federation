import { EyeOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentRecords } from '../../data/payments';
import type { PaymentRecord, PaymentStatus } from '../../data/payments';

const PAGE_SIZE = 5;

const statusColor: Record<PaymentStatus, string> = {
  已支付: 'green',
  处理中: 'blue',
  已退款: 'orange',
  待支付: 'default',
};

interface SearchValues {
  keyword?: string;
  channel?: string;
  status?: PaymentStatus;
}

const PaymentManagement = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<SearchValues>();
  const [filters, setFilters] = useState<SearchValues>({});
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = paymentRecords.filter((record) => {
    const keywordMatched = !filters.keyword
      || `${record.orderNo}${record.customer}${record.product}`.includes(filters.keyword);
    const channelMatched = !filters.channel || record.channel === filters.channel;
    const statusMatched = !filters.status || record.status === filters.status;
    return keywordMatched && channelMatched && statusMatched;
  });

  const columns: ColumnsType<PaymentRecord> = [
    { title: '支付单号', dataIndex: 'orderNo', width: 190 },
    {
      title: '客户 / 产品',
      dataIndex: 'customer',
      width: 230,
      render: (value, record) => (
        <div className="payment-name-cell">
          <span className="payment-badge">PAY</span>
          <div><strong>{value}</strong><span>{record.product}</span></div>
        </div>
      ),
    },
    { title: '支付渠道', dataIndex: 'channel', width: 120 },
    {
      title: '支付金额',
      dataIndex: 'amount',
      width: 120,
      render: (value: number) => <strong className="amount-value">¥ {value.toLocaleString()}</strong>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 105,
      render: (value: PaymentStatus) => <Tag color={statusColor[value]}>{value}</Tag>,
    },
    { title: '支付时间', dataIndex: 'paidAt', width: 165 },
    { title: '经办人', dataIndex: 'operator', width: 90 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 90,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/payment/detail/${encodeURIComponent(record.orderNo)}`)}
        >
          详情
        </Button>
      ),
    },
  ];

  const handleSearch = (values: SearchValues) => {
    setFilters(values);
    setCurrentPage(1);
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <section className="payment-page">
      <div className="page-intro">
        <div>
          <Typography.Title level={2}>支付记录</Typography.Title>
          <Typography.Text>统一查询支付订单、金额、渠道和处理状态。</Typography.Text>
        </div>
      </div>

      <Card className="query-card" bordered={false}>
        <Form form={form} layout="inline" onFinish={handleSearch} className="query-form">
          <Form.Item name="keyword" label="订单查询">
            <Input allowClear placeholder="单号、客户或产品" />
          </Form.Item>
          <Form.Item name="channel" label="支付渠道">
            <Select allowClear placeholder="选择渠道" options={[
              { label: '微信支付', value: '微信支付' },
              { label: '支付宝', value: '支付宝' },
              { label: '企业网银', value: '企业网银' },
            ]} />
          </Form.Item>
          <Form.Item name="status" label="支付状态">
            <Select allowClear placeholder="选择状态" options={Object.keys(statusColor).map((value) => ({ label: value, value }))} />
          </Form.Item>
          <Form.Item className="query-actions">
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card className="table-card" bordered={false}>
        <div className="table-toolbar">
          <div><strong>支付订单</strong><span>共 {filteredRecords.length} 笔</span></div>
        </div>
        <Table<PaymentRecord>
          rowKey="key"
          columns={columns}
          dataSource={filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)}
          pagination={false}
          scroll={{ x: 1120 }}
          locale={{ emptyText: '暂无符合条件的支付记录' }}
        />
        <div className="table-pagination">
          <span>每页 {PAGE_SIZE} 条</span>
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={filteredRecords.length}
            showSizeChanger={false}
            onChange={setCurrentPage}
          />
        </div>
      </Card>
    </section>
  );
};

export default PaymentManagement;
