import { EyeOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
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
import { Button } from '@central-platform/ui';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userRecords } from '../../data/users';
import type { UserRecord, UserStatus } from '../../data/users';

const PAGE_SIZE = 5;

const statusColor: Record<UserStatus, string> = {
  正常: 'green',
  待激活: 'orange',
  已停用: 'default',
};

interface SearchValues {
  keyword?: string;
  status?: UserStatus;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<SearchValues>();
  const [filters, setFilters] = useState<SearchValues>({});
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRecords = userRecords.filter((record) => {
    const keywordMatched = !filters.keyword
      || `${record.userId}${record.name}${record.company}${record.phone}`.includes(filters.keyword);
    const statusMatched = !filters.status || record.status === filters.status;
    return keywordMatched && statusMatched;
  });

  const columns: ColumnsType<UserRecord> = [
    { title: '用户编号', dataIndex: 'userId', width: 165 },
    {
      title: '用户信息',
      dataIndex: 'name',
      width: 220,
      render: (value, record) => (
        <div className="user-name-cell">
          <span className="user-badge">U</span>
          <div><strong>{value}</strong><span>{record.email}</span></div>
        </div>
      ),
    },
    { title: '所属企业', dataIndex: 'company', width: 180 },
    { title: '角色', dataIndex: 'role', width: 115 },
    { title: '手机号', dataIndex: 'phone', width: 130 },
    { title: '状态', dataIndex: 'status', width: 100, render: (value: UserStatus) => <Tag color={statusColor[value]}>{value}</Tag> },
    { title: '最近登录', dataIndex: 'lastLogin', width: 165 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 90,
      render: (_, record) => (
        <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/user/detail/${record.userId}`)}>
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
    <section className="user-page">
      <div className="page-intro">
        <div>
          <Typography.Title level={2}>用户库</Typography.Title>
          <Typography.Text>统一维护用户基础信息、企业归属、角色和账号状态。</Typography.Text>
        </div>
      </div>

      <Card className="query-card" bordered={false}>
        <Form form={form} layout="inline" onFinish={handleSearch} className="query-form">
          <Form.Item name="keyword" label="用户查询">
            <Input allowClear placeholder="编号、姓名、企业或手机号" />
          </Form.Item>
          <Form.Item name="status" label="用户状态">
            <Select allowClear placeholder="选择状态" options={[
              { label: '正常', value: '正常' },
              { label: '待激活', value: '待激活' },
              { label: '已停用', value: '已停用' },
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
          <div><strong>用户信息</strong><span>共 {filteredRecords.length} 人</span></div>
          <Tag color="cyan">本地演示数据</Tag>
        </div>
        <Table<UserRecord>
          rowKey="key"
          columns={columns}
          dataSource={filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)}
          pagination={false}
          scroll={{ x: 1120 }}
          locale={{ emptyText: '暂无符合条件的用户' }}
        />
        <div className="table-pagination">
          <span>每页 {PAGE_SIZE} 条</span>
          <Pagination current={currentPage} pageSize={PAGE_SIZE} total={filteredRecords.length} showSizeChanger={false} onChange={setCurrentPage} />
        </div>
      </Card>
    </section>
  );
};

export default UserManagement;
