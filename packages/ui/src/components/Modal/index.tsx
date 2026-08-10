import { Modal as AntdModal } from 'antd';
import type { ModalProps as AntdModalProps } from 'antd';

export type ModalSize = 'small' | 'middle' | 'large';

export interface ModalProps extends Omit<AntdModalProps, 'width' | 'maskClosable' | 'destroyOnHidden' | 'closable'> {
  /** Modal width preset. Defaults to middle. */
  size?: ModalSize;
}

const MODAL_WIDTH: Record<ModalSize, number> = {
  small: 512,
  middle: 768,
  large: 1024,
};

export const Modal = ({
  size = 'middle',
  className,
  okText = '确定',
  cancelText = '取消',
  ...props
}: ModalProps) => (
  <AntdModal
    {...props}
    className={['platform-modal', `platform-modal-${size}`, className].filter(Boolean).join(' ')}
    width={MODAL_WIDTH[size]}
    maskClosable={false}
    destroyOnHidden
    closable
    okText={okText}
    cancelText={cancelText}
  />
);
