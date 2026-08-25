import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusTag } from './index';

describe('状态标签组件', () => {
  it.each(['success', 'processing', 'warning', 'error'] as const)(
    '%s 状态使用对应的 Ant Design 状态类名',
    (tone) => {
      render(<StatusTag tone={tone}>{tone}</StatusTag>);
      expect(screen.getByText(tone)).toHaveClass(`ant-tag-${tone}`);
    },
  );

  it('默认状态不添加语义颜色类名', () => {
    render(<StatusTag>草稿</StatusTag>);

    const tag = screen.getByText('草稿');
    expect(tag).toHaveClass('ant-tag');
    expect(tag.className).not.toMatch(/ant-tag-(success|processing|warning|error)/);
  });

  it('向底层标签透传自定义属性', () => {
    render(<StatusTag data-testid="status-tag" className="business-status">正常</StatusTag>);
    expect(screen.getByTestId('status-tag')).toHaveClass('business-status');
  });
});
