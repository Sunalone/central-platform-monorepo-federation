import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QueryBar } from './index';

describe('查询栏组件', () => {
  it('展示查询字段和默认中文操作按钮', () => {
    render(
      <QueryBar onSearch={() => undefined} onReset={() => undefined}>
        <input aria-label="产品名称" />
      </QueryBar>,
    );

    expect(screen.getByRole('textbox', { name: '产品名称' })).toBeInTheDocument();
    expect(screen.getByText('查询').closest('button')).toBeInTheDocument();
    expect(screen.getByText('重置').closest('button')).toBeInTheDocument();
  });

  it('支持自定义按钮文字并触发查询和重置事件', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    const onReset = vi.fn();
    render(
      <QueryBar onSearch={onSearch} onReset={onReset} searchText="立即查询" resetText="清空条件">
        <span>查询条件</span>
      </QueryBar>,
    );

    // 图标会进入按钮的可访问名称，按可见文字定位可避免与图标实现耦合。
    await user.click(screen.getByText('立即查询').closest('button') as HTMLButtonElement);
    await user.click(screen.getByText('清空条件').closest('button') as HTMLButtonElement);
    expect(onSearch).toHaveBeenCalledOnce();
    expect(onReset).toHaveBeenCalledOnce();
  });

  it('未提供回调时不渲染对应操作按钮', () => {
    render(<QueryBar><span>查询条件</span></QueryBar>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
