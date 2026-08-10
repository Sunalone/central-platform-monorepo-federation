import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Card, Form, Input, Pagination, Select, Space, Table, Typography } from 'antd';
import { Button } from '@central-platform/ui';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

export type TableRecord = { key: string; [key: string]: string | number };

export interface QueryField {
  name: string;
  label: string;
  placeholder: string;
  options?: { label: string; value: string }[];
}

export interface DataTablePageProps {
  title: string;
  description: string;
  fields: QueryField[];
  columns: ColumnsType<TableRecord>;
  data: TableRecord[];
}

const PAGE_SIZE = 5;

const DataTablePage = ({ title, description, fields, columns, data }: DataTablePageProps) => {
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter((record) =>
    Object.entries(filters).every(([name, value]) => {
      if (!value) return true;
      return String(record[name] ?? '')
        .toLocaleLowerCase()
        .includes(value.toLocaleLowerCase());
    }),
  );

  const pageData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (values: Record<string, string | undefined>) => {
    const nextFilters = Object.fromEntries(
      Object.entries(values).filter((entry): entry is [string, string] => Boolean(entry[1])),
    );
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <section className="data-page">
      <div className="page-intro">
        <div>
          <Typography.Title level={2}>{title}</Typography.Title>
          <Typography.Text>{description}</Typography.Text>
        </div>
        <span className="record-count">共 {filteredData.length} 条数据</span>
      </div>

      <Card className="query-card" bordered={false}>
        <Form form={form} layout="inline" onFinish={handleSearch} className="query-form">
          {fields.map((field) => (
            <Form.Item key={field.name} name={field.name} label={field.label}>
              {field.options ? (
                <Select allowClear placeholder={field.placeholder} options={field.options} />
              ) : (
                <Input allowClear placeholder={field.placeholder} />
              )}
            </Form.Item>
          ))}
          <Form.Item className="query-actions">
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card className="table-card" bordered={false}>
        <Table<TableRecord>
          rowKey="key"
          columns={columns}
          dataSource={pageData}
          pagination={false}
          scroll={{ x: 900 }}
          locale={{ emptyText: '暂无符合条件的数据' }}
        />
        <div className="table-pagination">
          <span>每页 {PAGE_SIZE} 条</span>
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={filteredData.length}
            showSizeChanger={false}
            onChange={setCurrentPage}
          />
        </div>
      </Card>
    </section>
  );
};

export default DataTablePage;
