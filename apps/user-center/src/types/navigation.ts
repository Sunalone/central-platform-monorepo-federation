export type PageKey = 'dashboard' | 'users';

export const PAGE_META: Record<PageKey, { title: string; group: string }> = {
  dashboard: { title: '用户仪表盘', group: '数据概览' },
  users: { title: '用户库', group: '用户管理' },
};
