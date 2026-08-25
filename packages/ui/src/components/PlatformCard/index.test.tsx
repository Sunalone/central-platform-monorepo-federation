import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PlatformCard } from './index';

describe('平台卡片组件', () => {
  it('展示眉题、标题、描述和业务内容', () => {
    render(
      <PlatformCard eyebrow="PRODUCT CENTER" title="产品概览" description="展示产品运行情况">
        <span>业务内容</span>
      </PlatformCard>,
    );

    expect(screen.getByText('PRODUCT CENTER')).toHaveClass('platform-card-eyebrow');
    expect(screen.getByText('产品概览')).toHaveClass('platform-card-title');
    expect(screen.getByText('展示产品运行情况')).toHaveClass('platform-card-description');
    expect(screen.getByText('业务内容')).toBeInTheDocument();
  });

  it('没有标题信息时不渲染标题区域', () => {
    const { container } = render(<PlatformCard><span>纯内容</span></PlatformCard>);

    expect(container.querySelector('.platform-card-heading')).not.toBeInTheDocument();
    expect(screen.getByText('纯内容')).toBeInTheDocument();
  });

  it('合并默认类名和业务自定义类名', () => {
    const { container } = render(<PlatformCard className="business-card">内容</PlatformCard>);
    expect(container.querySelector('.ant-card')).toHaveClass('platform-card', 'business-card');
  });
});
