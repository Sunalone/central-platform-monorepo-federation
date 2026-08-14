import Tag from 'antd-mobile/es/components/tag';

const colorMap: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'default'> = {
  在售: 'success',
  审核中: 'warning',
  已下架: 'default',
  支付成功: 'success',
  处理中: 'primary',
  退款中: 'warning',
  支付失败: 'danger',
  正常: 'success',
  待认证: 'warning',
  已冻结: 'danger',
  低风险: 'success',
  中风险: 'warning',
  高风险: 'danger',
};

const StatusTag = ({ children }: { children: string }) => (
  <Tag color={colorMap[children] ?? 'default'} fill="outline" round>
    {children}
  </Tag>
);

export default StatusTag;
