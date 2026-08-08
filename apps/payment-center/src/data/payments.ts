export type PaymentStatus = '已支付' | '处理中' | '已退款' | '待支付';

export interface PaymentRecord {
  key: string;
  orderNo: string;
  customer: string;
  product: string;
  channel: string;
  amount: number;
  status: PaymentStatus;
  paidAt: string;
  operator: string;
}

export const paymentRecords: PaymentRecord[] = [
  {
    key: '1',
    orderNo: 'PAY-20260808-001',
    customer: '星河科技有限公司',
    product: '企业版订阅',
    channel: '微信支付',
    amount: 12800,
    status: '已支付',
    paidAt: '2026-08-08 09:42',
    operator: '陈晓',
  },
  {
    key: '2',
    orderNo: 'PAY-20260808-002',
    customer: '远山零售集团',
    product: '数据增值包',
    channel: '企业网银',
    amount: 8600,
    status: '处理中',
    paidAt: '2026-08-08 09:15',
    operator: '方妍',
  },
  {
    key: '3',
    orderNo: 'PAY-20260807-018',
    customer: '北辰供应链',
    product: '标准版订阅',
    channel: '支付宝',
    amount: 4200,
    status: '已支付',
    paidAt: '2026-08-07 18:36',
    operator: '林涛',
  },
  {
    key: '4',
    orderNo: 'PAY-20260807-015',
    customer: '云杉教育科技',
    product: '企业版订阅',
    channel: '微信支付',
    amount: 12800,
    status: '已退款',
    paidAt: '2026-08-07 16:20',
    operator: '陈晓',
  },
  {
    key: '5',
    orderNo: 'PAY-20260806-022',
    customer: '启明制造',
    product: 'API 调用包',
    channel: '企业网银',
    amount: 3600,
    status: '待支付',
    paidAt: '-',
    operator: '方妍',
  },
];
