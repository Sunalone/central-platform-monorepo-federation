import { describe, expect, it, vi } from 'vitest';
import { emitPdfCMapAssets } from './vite';

describe('emitPdfCMapAssets', () => {
  it('emits every packed CMap into the application assets directory', async () => {
    const plugin = emitPdfCMapAssets();
    const emitFile = vi.fn();
    const buildStart = plugin.buildStart;

    expect(typeof buildStart).toBe('function');
    if (typeof buildStart !== 'function') throw new Error('buildStart hook is unavailable.');

    // Invoke the Vite hook with only the plugin context API used by this implementation.
    // 仅提供当前实现需要的插件上下文 API，直接调用 Vite 构建钩子。
    await buildStart.call({ emitFile } as never, {} as never);

    expect(emitFile).toHaveBeenCalled();
    const emittedAssets = emitFile.mock.calls.map(([asset]) => asset);
    // Check one required Chinese CMap and then validate the destination of every asset.
    // 先检查一个必要的中文 CMap，再验证全部资源的输出路径。
    expect(emittedAssets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'asset',
          fileName: 'assets/cmaps/UniGB-UCS2-H.bcmap',
          source: expect.any(Uint8Array),
        }),
      ]),
    );
    expect(emittedAssets.every(({ fileName }) => /^assets\/cmaps\/.+\.bcmap$/.test(fileName))).toBe(true);
  });
});
