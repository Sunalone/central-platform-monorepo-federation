import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// 每个用例结束后卸载 React 树，避免 Portal 或 DOM 状态影响后续测试。
afterEach(() => cleanup());

// Ant Design 会查询媒体特性，jsdom 默认没有实现 matchMedia。
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 卡片、弹窗等组件可能通过 ResizeObserver 监听容器尺寸。
class ResizeObserverMock implements ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// jsdom 不支持伪元素样式查询，忽略第二个参数即可满足 Ant Design 的滚动条测量逻辑。
const getComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = (element: Element) => getComputedStyle(element);
