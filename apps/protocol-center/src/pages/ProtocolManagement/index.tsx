import {
  DownloadOutlined,
  EyeOutlined,
  FileAddOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Card,
  App,
  Form,
  Input,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
} from 'antd';
import { Button } from '@central-platform/ui';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  getProtocolRecordUrl,
  protocolRecords,
} from '../../data/protocols';
import type { ProtocolRecord } from '../../data/protocols';

const PAGE_SIZE = 5;
const PdfPreviewModal = lazy(() => import('../../components/PdfPreviewModal'));

const statusColor = {
  已生效: 'green',
  草稿: 'default',
  即将到期: 'orange',
};

interface SearchValues {
  name?: string;
  category?: string;
  status?: string;
}

const ProtocolManagement = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm<SearchValues>();
  const [filters, setFilters] = useState<SearchValues>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [previewRecord, setPreviewRecord] = useState<ProtocolRecord | null>(null);
  const [localRecords, setLocalRecords] = useState<ProtocolRecord[]>([]);
  const uploadedUrlsRef = useRef<string[]>([]);

  useEffect(
    () => () => uploadedUrlsRef.current.forEach((url) => URL.revokeObjectURL(url)),
    [],
  );

  const allRecords = [...localRecords, ...protocolRecords];

  const filteredRecords = allRecords.filter((record) => {
    const nameMatched = !filters.name || `${record.name}${record.code}`.includes(filters.name);
    const categoryMatched = !filters.category || record.category === filters.category;
    const statusMatched = !filters.status || record.status === filters.status;
    return nameMatched && categoryMatched && statusMatched;
  });

  const columns: ColumnsType<ProtocolRecord> = [
    { title: '协议编号', dataIndex: 'code', width: 135 },
    {
      title: '协议文件',
      dataIndex: 'name',
      width: 230,
      render: (value, record) => (
        <div className="protocol-name-cell">
          <span className="pdf-badge">PDF</span>
          <div><strong>{value}</strong><span>{record.fileSize} · {record.version}</span></div>
        </div>
      ),
    },
    { title: '协议类型', dataIndex: 'category', width: 120 },
    { title: '状态', dataIndex: 'status', width: 105, render: (value) => <Tag color={statusColor[value as keyof typeof statusColor]}>{value}</Tag> },
    { title: '使用次数', dataIndex: 'usageCount', width: 110, sorter: (a, b) => a.usageCount - b.usageCount },
    { title: '负责人', dataIndex: 'owner', width: 100 },
    { title: '更新时间', dataIndex: 'updatedAt', width: 165 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size={2}>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => setPreviewRecord(record)}>预览</Button>
          <Button type="link" size="small" icon={<DownloadOutlined />} href={getProtocolRecordUrl(record)} download>下载</Button>
        </Space>
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

  const handleUpload: UploadProps['beforeUpload'] = (file) => {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      void message.error('请选择 PDF 文件。');
      return Upload.LIST_IGNORE;
    }

    const fileUrl = URL.createObjectURL(file);
    uploadedUrlsRef.current.push(fileUrl);
    const now = new Date();
    const uploadedRecord: ProtocolRecord = {
      key: `local-${file.uid}`,
      code: `LOCAL-${String(now.getTime()).slice(-6)}`,
      name: file.name.replace(/\.pdf$/i, ''),
      category: '产品服务',
      version: 'V1.0',
      status: '草稿',
      owner: '当前用户',
      usageCount: 0,
      fileSize: `${Math.max(file.size / 1024, 0.1).toFixed(1)} KB`,
      updatedAt: now.toLocaleString('zh-CN', { hour12: false }),
      fileName: file.name,
      fileUrl,
    };
    setLocalRecords((records) => [uploadedRecord, ...records]);
    setCurrentPage(1);
    void message.success('协议已加入本地草稿，可立即预览。');
    return false;
  };

  return (
    <section className="protocol-page">
      <div className="page-intro">
        <div>
          <Typography.Title level={2}>协议管理</Typography.Title>
          <Typography.Text>统一维护协议 PDF 文件、版本和业务使用状态。</Typography.Text>
        </div>
        <Upload accept="application/pdf,.pdf" showUploadList={false} beforeUpload={handleUpload}>
          <Button type="primary" icon={<FileAddOutlined />}>上传协议</Button>
        </Upload>
      </div>

      <Card className="query-card" bordered={false}>
        <Form form={form} layout="inline" onFinish={handleSearch} className="query-form">
          <Form.Item name="name" label="协议名称">
            <Input allowClear placeholder="名称或协议编号" />
          </Form.Item>
          <Form.Item name="category" label="协议类型">
            <Select allowClear placeholder="选择类型" options={[
              { label: '产品服务', value: '产品服务' },
              { label: '数据合规', value: '数据合规' },
              { label: '开放平台', value: '开放平台' },
            ]} />
          </Form.Item>
          <Form.Item name="status" label="协议状态">
            <Select allowClear placeholder="选择状态" options={[
              { label: '已生效', value: '已生效' },
              { label: '草稿', value: '草稿' },
              { label: '即将到期', value: '即将到期' },
            ]} />
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
          <div><strong>协议文件</strong><span>共 {filteredRecords.length} 份</span></div>
          <Tag color="blue">PDF.js 安全预览</Tag>
        </div>
        <Table<ProtocolRecord>
          rowKey="key"
          columns={columns}
          dataSource={filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)}
          pagination={false}
          scroll={{ x: 1120 }}
          locale={{ emptyText: '暂无符合条件的协议' }}
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

      {previewRecord && (
        <Suspense fallback={null}>
          <PdfPreviewModal
            open
            title={`${previewRecord.name} ${previewRecord.version}`}
            fileUrl={getProtocolRecordUrl(previewRecord)}
            onClose={() => setPreviewRecord(null)}
          />
        </Suspense>
      )}
    </section>
  );
};

export default ProtocolManagement;
