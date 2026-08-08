export type PageKey = 'dashboard' | 'protocols';

export const PAGE_META: Record<PageKey, { title: string; group: string }> = {
  dashboard: { title: '协议仪表盘', group: '数据概览' },
  protocols: { title: '协议管理', group: '文件管理' },
};
