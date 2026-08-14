export type ProductStatus = '在售' | '审核中' | '已下架';

export interface ProductProtocol {
  id: string;
  name: string;
  version: string;
  fileName: string;
}

export interface ProductRecord {
  id: string;
  name: string;
  category: string;
  status: ProductStatus;
  annualRate: string;
  term: string;
  customerCount: number;
  updatedAt: string;
  description: string;
  features: string[];
  protocols: ProductProtocol[];
}

export type PaymentStatus = '支付成功' | '处理中' | '退款中' | '支付失败';
export type PaymentNodeState = 'complete' | 'current' | 'waiting' | 'error';

export interface PaymentFlowNode {
  id: string;
  title: string;
  state: PaymentNodeState;
  time: string;
  description: string;
  details: Array<{ label: string; value: string }>;
}

export interface PaymentRecord {
  id: string;
  orderNo: string;
  userName: string;
  productName: string;
  amount: number;
  channel: string;
  status: PaymentStatus;
  createdAt: string;
  nodes: PaymentFlowNode[];
}

export type UserStatus = '正常' | '待认证' | '已冻结';
export type RiskLevel = '低风险' | '中风险' | '高风险';

export interface UserRecord {
  id: string;
  name: string;
  mobile: string;
  level: string;
  status: UserStatus;
  realNameStatus: string;
  verificationProgress: number;
  riskLevel: RiskLevel;
  source: string;
  registeredAt: string;
  lastActiveAt: string;
  orderCount: number;
  documentType: string;
  documentNo: string;
}
