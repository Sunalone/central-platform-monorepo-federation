import { Space, Tag } from 'antd';
import { Button } from '@central-platform/ui';
import type { ColumnsType } from 'antd/es/table';
import DataTablePage from '../../components/DataTablePage';
import type {
  DataTablePageProps,
  QueryField,
  TableRecord,
} from '../../components/DataTablePage';
import type { PageKey } from '../../types/navigation';

type ManagementKey = Exclude<PageKey, 'dashboard' | 'agreements'>;
type PageConfig = Pick<DataTablePageProps, 'title' | 'description' | 'data'> & {
  fields: QueryField[];
  columns: ColumnsType<TableRecord>;
};

const statusColor: Record<string, string> = {
  在售: 'green',
  草稿: 'default',
  缺货: 'orange',
  已完成: 'green',
  待发货: 'blue',
  已取消: 'default',
  已退款: 'red',
  已入账: 'green',
  处理中: 'gold',
  启用: 'green',
  停用: 'default',
};

const renderStatus = (value: unknown) => (
  <Tag color={statusColor[String(value)] ?? 'blue'}>{String(value)}</Tag>
);

const actionColumn = (): ColumnsType<TableRecord>[number] => ({
  title: '操作',
  key: 'action',
  fixed: 'right',
  width: 130,
  render: () => (
    <Space size={4}>
      <Button type="link" size="small">查看</Button>
      <Button type="link" size="small">编辑</Button>
    </Space>
  ),
});

const pageConfigs: Record<ManagementKey, PageConfig> = {
  products: {
    title: '商品列表',
    description: '维护商品信息、库存与当前销售状态。',
    fields: [
      { name: 'name', label: '商品名称', placeholder: '输入商品名称' },
      { name: 'category', label: '商品分类', placeholder: '选择分类', options: [
        { label: '数码办公', value: '数码办公' },
        { label: '家居生活', value: '家居生活' },
        { label: '食品饮料', value: '食品饮料' },
      ] },
      { name: 'status', label: '销售状态', placeholder: '选择状态', options: [
        { label: '在售', value: '在售' }, { label: '草稿', value: '草稿' }, { label: '缺货', value: '缺货' },
      ] },
    ],
    columns: [
      { title: '商品编号', dataIndex: 'code', width: 130 },
      { title: '商品名称', dataIndex: 'name', width: 190 },
      { title: '分类', dataIndex: 'category', width: 120 },
      { title: '售价', dataIndex: 'price', width: 100, render: (value) => `¥${value}` },
      { title: '库存', dataIndex: 'stock', width: 90 },
      { title: '状态', dataIndex: 'status', width: 90, render: renderStatus },
      { title: '更新时间', dataIndex: 'updatedAt', width: 170 },
      actionColumn(),
    ],
    data: [
      { key: '1', code: 'SP-10001', name: 'Aurora 无线键盘', category: '数码办公', price: 399, stock: 128, status: '在售', updatedAt: '2026-08-02 09:30' },
      { key: '2', code: 'SP-10002', name: '轻羽降噪耳机', category: '数码办公', price: 699, stock: 62, status: '在售', updatedAt: '2026-08-02 08:42' },
      { key: '3', code: 'SP-10003', name: '模块化桌面收纳盒', category: '家居生活', price: 129, stock: 0, status: '缺货', updatedAt: '2026-08-01 17:16' },
      { key: '4', code: 'SP-10004', name: '冷萃咖啡组合装', category: '食品饮料', price: 89, stock: 350, status: '在售', updatedAt: '2026-08-01 14:20' },
      { key: '5', code: 'SP-10005', name: '便携显示器 15.6', category: '数码办公', price: 1199, stock: 21, status: '在售', updatedAt: '2026-07-31 18:05' },
      { key: '6', code: 'SP-10006', name: '亚麻午休毯', category: '家居生活', price: 159, stock: 84, status: '草稿', updatedAt: '2026-07-31 11:34' },
      { key: '7', code: 'SP-10007', name: '磁吸阅读灯', category: '家居生活', price: 199, stock: 96, status: '在售', updatedAt: '2026-07-30 16:11' },
    ],
  },
  categories: {
    title: '商品分类',
    description: '管理前台分类层级、商品数量和展示顺序。',
    fields: [
      { name: 'name', label: '分类名称', placeholder: '输入分类名称' },
      { name: 'status', label: '状态', placeholder: '选择状态', options: [
        { label: '启用', value: '启用' }, { label: '停用', value: '停用' },
      ] },
    ],
    columns: [
      { title: '分类编号', dataIndex: 'code', width: 130 },
      { title: '分类名称', dataIndex: 'name', width: 180 },
      { title: '上级分类', dataIndex: 'parent', width: 150 },
      { title: '商品数量', dataIndex: 'count', width: 110 },
      { title: '排序', dataIndex: 'sort', width: 90 },
      { title: '状态', dataIndex: 'status', width: 100, render: renderStatus },
      { title: '负责人', dataIndex: 'owner', width: 120 },
      actionColumn(),
    ],
    data: [
      { key: '1', code: 'FL-001', name: '数码办公', parent: '全部分类', count: 126, sort: 10, status: '启用', owner: '陈晓' },
      { key: '2', code: 'FL-002', name: '家居生活', parent: '全部分类', count: 89, sort: 20, status: '启用', owner: '周雨' },
      { key: '3', code: 'FL-003', name: '食品饮料', parent: '全部分类', count: 74, sort: 30, status: '启用', owner: '林涛' },
      { key: '4', code: 'FL-004', name: '电脑配件', parent: '数码办公', count: 42, sort: 11, status: '启用', owner: '陈晓' },
      { key: '5', code: 'FL-005', name: '卧室用品', parent: '家居生活', count: 31, sort: 21, status: '启用', owner: '周雨' },
      { key: '6', code: 'FL-006', name: '季节限定', parent: '食品饮料', count: 8, sort: 99, status: '停用', owner: '林涛' },
    ],
  },
  orders: {
    title: '订单管理',
    description: '查看订单进度、支付信息和履约状态。',
    fields: [
      { name: 'orderNo', label: '订单编号', placeholder: '输入订单编号' },
      { name: 'customer', label: '客户名称', placeholder: '输入客户名称' },
      { name: 'status', label: '订单状态', placeholder: '选择状态', options: [
        { label: '待发货', value: '待发货' }, { label: '已完成', value: '已完成' }, { label: '已取消', value: '已取消' },
      ] },
    ],
    columns: [
      { title: '订单编号', dataIndex: 'orderNo', width: 170 },
      { title: '客户', dataIndex: 'customer', width: 120 },
      { title: '商品件数', dataIndex: 'items', width: 100 },
      { title: '订单金额', dataIndex: 'amount', width: 120, render: (value) => `¥${value}` },
      { title: '支付方式', dataIndex: 'payment', width: 120 },
      { title: '状态', dataIndex: 'status', width: 100, render: renderStatus },
      { title: '下单时间', dataIndex: 'createdAt', width: 170 },
      actionColumn(),
    ],
    data: [
      { key: '1', orderNo: 'PO202608020001', customer: '上海栖木', items: 3, amount: '1,226.00', payment: '企业网银', status: '待发货', createdAt: '2026-08-02 10:12' },
      { key: '2', orderNo: 'PO202608020002', customer: '杭州青禾', items: 1, amount: '699.00', payment: '支付宝', status: '已完成', createdAt: '2026-08-02 09:45' },
      { key: '3', orderNo: 'PO202608010026', customer: '南京序章', items: 8, amount: '3,892.00', payment: '企业网银', status: '已完成', createdAt: '2026-08-01 18:31' },
      { key: '4', orderNo: 'PO202608010025', customer: '苏州见山', items: 2, amount: '288.00', payment: '微信支付', status: '已取消', createdAt: '2026-08-01 17:09' },
      { key: '5', orderNo: 'PO202608010024', customer: '北京方圆', items: 5, amount: '2,155.00', payment: '企业网银', status: '待发货', createdAt: '2026-08-01 15:22' },
      { key: '6', orderNo: 'PO202607310018', customer: '广州印象', items: 1, amount: '1,199.00', payment: '支付宝', status: '已完成', createdAt: '2026-07-31 16:48' },
      { key: '7', orderNo: 'PO202607310017', customer: '成都云起', items: 4, amount: '796.00', payment: '微信支付', status: '待发货', createdAt: '2026-07-31 14:06' },
    ],
  },
  bills: {
    title: '账单明细',
    description: '核对每笔收支流水及关联业务单据。',
    fields: [
      { name: 'billNo', label: '流水号', placeholder: '输入流水号' },
      { name: 'type', label: '收支类型', placeholder: '选择类型', options: [
        { label: '收入', value: '收入' }, { label: '支出', value: '支出' },
      ] },
      { name: 'status', label: '入账状态', placeholder: '选择状态', options: [
        { label: '已入账', value: '已入账' }, { label: '处理中', value: '处理中' }, { label: '已退款', value: '已退款' },
      ] },
    ],
    columns: [
      { title: '流水号', dataIndex: 'billNo', width: 170 },
      { title: '关联订单', dataIndex: 'orderNo', width: 170 },
      { title: '类型', dataIndex: 'type', width: 90 },
      { title: '金额', dataIndex: 'amount', width: 120, render: (value, record) => `${record.type === '支出' ? '-' : '+'}¥${value}` },
      { title: '支付渠道', dataIndex: 'channel', width: 120 },
      { title: '状态', dataIndex: 'status', width: 100, render: renderStatus },
      { title: '入账时间', dataIndex: 'createdAt', width: 170 },
      actionColumn(),
    ],
    data: [
      { key: '1', billNo: 'LS260802001', orderNo: 'PO202608020001', type: '收入', amount: '1,226.00', channel: '企业网银', status: '处理中', createdAt: '2026-08-02 10:13' },
      { key: '2', billNo: 'LS260802002', orderNo: 'PO202608020002', type: '收入', amount: '699.00', channel: '支付宝', status: '已入账', createdAt: '2026-08-02 09:46' },
      { key: '3', billNo: 'LS260801038', orderNo: 'PO202608010026', type: '收入', amount: '3,892.00', channel: '企业网银', status: '已入账', createdAt: '2026-08-01 18:33' },
      { key: '4', billNo: 'LS260801037', orderNo: 'PO202608010025', type: '支出', amount: '288.00', channel: '微信支付', status: '已退款', createdAt: '2026-08-01 17:18' },
      { key: '5', billNo: 'LS260801036', orderNo: 'PO202608010024', type: '收入', amount: '2,155.00', channel: '企业网银', status: '处理中', createdAt: '2026-08-01 15:23' },
      { key: '6', billNo: 'LS260731029', orderNo: 'PO202607310018', type: '收入', amount: '1,199.00', channel: '支付宝', status: '已入账', createdAt: '2026-07-31 16:49' },
    ],
  },
  finance: {
    title: '财务统计',
    description: '按月份查看收入、退款和净收入汇总。',
    fields: [
      { name: 'period', label: '统计月份', placeholder: '输入月份，如 2026-08' },
      { name: 'department', label: '业务部门', placeholder: '选择部门', options: [
        { label: '自营商城', value: '自营商城' }, { label: '企业采购', value: '企业采购' }, { label: '渠道分销', value: '渠道分销' },
      ] },
    ],
    columns: [
      { title: '统计月份', dataIndex: 'period', width: 130 },
      { title: '业务部门', dataIndex: 'department', width: 140 },
      { title: '订单数', dataIndex: 'orders', width: 110 },
      { title: '销售收入', dataIndex: 'income', width: 130, render: (value) => `¥${value}` },
      { title: '退款金额', dataIndex: 'refund', width: 120, render: (value) => `¥${value}` },
      { title: '净收入', dataIndex: 'netIncome', width: 130, render: (value) => `¥${value}` },
      { title: '环比', dataIndex: 'growth', width: 100, render: (value) => <Tag color={String(value).startsWith('-') ? 'red' : 'green'}>{String(value)}</Tag> },
      actionColumn(),
    ],
    data: [
      { key: '1', period: '2026-08', department: '自营商城', orders: 1286, income: '326,820', refund: '8,420', netIncome: '318,400', growth: '+12.6%' },
      { key: '2', period: '2026-08', department: '企业采购', orders: 386, income: '568,200', refund: '12,300', netIncome: '555,900', growth: '+8.2%' },
      { key: '3', period: '2026-08', department: '渠道分销', orders: 612, income: '228,600', refund: '6,800', netIncome: '221,800', growth: '-2.1%' },
      { key: '4', period: '2026-07', department: '自营商城', orders: 1142, income: '290,240', refund: '7,980', netIncome: '282,260', growth: '+6.4%' },
      { key: '5', period: '2026-07', department: '企业采购', orders: 354, income: '525,100', refund: '11,400', netIncome: '513,700', growth: '+4.1%' },
      { key: '6', period: '2026-07', department: '渠道分销', orders: 638, income: '233,500', refund: '7,200', netIncome: '226,300', growth: '+1.8%' },
    ],
  },
  settings: {
    title: '系统设置',
    description: '集中维护产品中心的业务规则和开关。',
    fields: [
      { name: 'name', label: '配置名称', placeholder: '输入配置名称' },
      { name: 'module', label: '所属模块', placeholder: '选择模块', options: [
        { label: '商品', value: '商品' }, { label: '订单', value: '订单' }, { label: '财务', value: '财务' },
      ] },
      { name: 'status', label: '状态', placeholder: '选择状态', options: [
        { label: '启用', value: '启用' }, { label: '停用', value: '停用' },
      ] },
    ],
    columns: [
      { title: '配置编码', dataIndex: 'code', width: 160 },
      { title: '配置名称', dataIndex: 'name', width: 190 },
      { title: '所属模块', dataIndex: 'module', width: 120 },
      { title: '当前值', dataIndex: 'value', width: 160 },
      { title: '状态', dataIndex: 'status', width: 100, render: renderStatus },
      { title: '更新人', dataIndex: 'operator', width: 110 },
      { title: '更新时间', dataIndex: 'updatedAt', width: 170 },
      actionColumn(),
    ],
    data: [
      { key: '1', code: 'PRODUCT_AUDIT', name: '商品上架审核', module: '商品', value: '需要审核', status: '启用', operator: '陈晓', updatedAt: '2026-08-01 10:20' },
      { key: '2', code: 'STOCK_WARNING', name: '库存预警阈值', module: '商品', value: '20 件', status: '启用', operator: '周雨', updatedAt: '2026-07-28 15:36' },
      { key: '3', code: 'ORDER_AUTO_CLOSE', name: '未支付自动关闭', module: '订单', value: '30 分钟', status: '启用', operator: '林涛', updatedAt: '2026-07-25 11:08' },
      { key: '4', code: 'ORDER_AUTO_RECEIVE', name: '自动确认收货', module: '订单', value: '10 天', status: '启用', operator: '林涛', updatedAt: '2026-07-25 10:52' },
      { key: '5', code: 'FINANCE_SETTLEMENT', name: '自动结算周期', module: '财务', value: 'T+1', status: '启用', operator: '方妍', updatedAt: '2026-07-20 16:40' },
      { key: '6', code: 'REFUND_REVIEW', name: '小额退款免审', module: '财务', value: '100 元以内', status: '停用', operator: '方妍', updatedAt: '2026-07-18 14:11' },
    ],
  },
};

interface ManagementPageProps {
  pageKey: ManagementKey;
}

const ManagementPage = ({ pageKey }: ManagementPageProps) => (
  <DataTablePage {...pageConfigs[pageKey]} />
);

export default ManagementPage;
