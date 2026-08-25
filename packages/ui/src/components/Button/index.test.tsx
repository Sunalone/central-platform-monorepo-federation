import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './index';

describe('按钮组件', () => {
  it('默认使用蓝色样式并展示子内容', () => {
    render(<Button>保存配置</Button>);

    const button = screen.getByRole('button', { name: '保存配置' });
    expect(button).toHaveClass('platform-button', 'platform-button-blue');
  });

  it.each(['red', 'blue', 'green', 'yellow', 'grey'] as const)(
    '颜色为 %s 时添加对应的语义类名',
    (color) => {
      render(<Button color={color}>{color}</Button>);
      expect(screen.getByRole('button', { name: color })).toHaveClass(`platform-button-${color}`);
    },
  );

  it('保留自定义类名并响应用户点击', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button className="business-action" onClick={onClick}>提交</Button>);

    // Ant Design 会为两个中文字符添加视觉间距，正则同时兼容“提交”和“提 交”。
    const button = screen.getByRole('button', { name: /提\s*交/ });
    expect(button).toHaveClass('business-action');
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('禁用后不触发点击事件', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>不可操作</Button>);

    const button = screen.getByRole('button', { name: '不可操作' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
