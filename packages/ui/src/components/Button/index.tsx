import { Button as AntdButton } from 'antd';
import type { ButtonProps as AntdButtonProps } from 'antd';
import type { ReactNode } from 'react';
import './index.css';

export type ButtonColor = 'red' | 'blue' | 'green' | 'yellow' | 'grey';

export interface ButtonProps extends Omit<AntdButtonProps, 'color'> {
  /** Button label or custom content. */
  children?: ReactNode;
  /** Semantic color preset. Defaults to blue. */
  color?: ButtonColor;
}

export const Button = ({ children, color = 'blue', className, ...props }: ButtonProps) => (
  <AntdButton
    {...props}
    className={['platform-button', `platform-button-${color}`, className].filter(Boolean).join(' ')}
  >
    {children}
  </AntdButton>
);
