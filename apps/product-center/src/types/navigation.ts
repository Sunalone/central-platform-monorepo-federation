export type PageKey =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'agreements'
  | 'orders'
  | 'bills'
  | 'finance'
  | 'settings';

export const PAGE_META: Record<PageKey, { title: string; group: string }> = {
  dashboard: { title: '经营仪表盘', group: '数据概览' },
  products: { title: '商品列表', group: '商品管理' },
  categories: { title: '商品分类', group: '商品管理' },
  agreements: { title: '产品协议', group: '客户协议' },
  orders: { title: '订单管理', group: '交易管理' },
  bills: { title: '账单明细', group: '财务管理' },
  finance: { title: '财务统计', group: '财务管理' },
  settings: { title: '系统设置', group: '平台配置' },
};
