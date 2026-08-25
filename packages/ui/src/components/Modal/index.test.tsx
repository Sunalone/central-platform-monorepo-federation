import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './index';

describe('弹窗组件', () => {
  it.each([
    ['small', '512px'],
    ['middle', '768px'],
    ['large', '1024px'],
  ] as const)('%s 尺寸使用宽度 %s', (size, width) => {
    render(<Modal open size={size} title="尺寸测试">弹窗内容</Modal>);

    const modal = document.querySelector(`.platform-modal-${size}`);
    expect(modal).toHaveStyle({ width });
  });

  it('未传尺寸时默认使用中号弹窗和中文按钮', () => {
    render(<Modal open title="默认弹窗">弹窗内容</Modal>);

    expect(document.querySelector('.platform-modal-middle')).toHaveStyle({ width: '768px' });
    expect(screen.getByRole('button', { name: '确 定' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '取 消' })).toBeInTheDocument();
  });

  it('点击遮罩层不关闭弹窗但点击右上角可以关闭', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<Modal open title="关闭测试" onCancel={onCancel}>弹窗内容</Modal>);

    // Ant Design 将遮罩和关闭按钮挂载到 body 下的 Portal 中。
    const mask = document.querySelector('.ant-modal-mask');
    const closeButton = document.querySelector('.ant-modal-close');
    expect(mask).not.toBeNull();
    expect(closeButton).not.toBeNull();

    // 遮罩层不可交互，使用原生事件确认即使收到点击也不会调用关闭回调。
    fireEvent.click(mask as HTMLElement);
    expect(onCancel).not.toHaveBeenCalled();

    await user.click(closeButton as HTMLElement);
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('关闭后销毁内部内容', async () => {
    const { rerender } = render(<Modal open title="销毁测试"><span>临时表单内容</span></Modal>);
    expect(screen.getByText('临时表单内容')).toBeInTheDocument();

    rerender(<Modal open={false} title="销毁测试"><span>临时表单内容</span></Modal>);

    // 弹窗关闭动画结束后，destroyOnHidden 会移除内部 React 内容。
    await waitFor(() => expect(screen.queryByText('临时表单内容')).not.toBeInTheDocument());
  });
});
