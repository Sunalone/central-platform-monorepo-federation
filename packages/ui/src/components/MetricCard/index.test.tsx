import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MetricCard } from './index';

describe('指标卡片组件', () => {
  it('展示标签、数值、后缀、图标和说明', () => {
    const { container } = render(
      <MetricCard
        label="协议总数"
        value={128}
        suffix="份"
        icon={<span aria-label="协议图标">图标</span>}
        note="较上月新增 8 份"
      />,
    );

    expect(screen.getByText('协议总数')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.getByText('份')).toBeInTheDocument();
    expect(screen.getByLabelText('协议图标')).toBeInTheDocument();
    expect(screen.getByText('较上月新增 8 份')).toBeInTheDocument();
    expect(container.querySelector('.metric-card-teal')).toBeInTheDocument();
  });

  it('根据 tone 添加对应主题类名', () => {
    const { container } = render(<MetricCard label="支付成功率" value="99.8%" tone="gold" />);
    expect(container.querySelector('.metric-card-gold')).toBeInTheDocument();
  });
});
