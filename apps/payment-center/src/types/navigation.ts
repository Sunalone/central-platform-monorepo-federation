export type PageKey = 'dashboard' | 'payments';

export const PAGE_META: Record<PageKey, { title: string; group: string }> = {
  dashboard: { title: '支付仪表盘', group: '数据概览' },
  payments: { title: '支付记录', group: '交易管理' },
};
