// vitest.setup.ts v1.7.7
/**
 * 测试环境存储 polyfill：
 * Node 26+ 自带实验性 localStorage（依赖 --localstorage-file 启动参数），与
 * happy-dom/jsdom 的环境注入互相冲突，导致 window.localStorage 为 undefined。
 * 判读引擎与 storage 封装只依赖标准 Storage API，因此用内存实现统一替代，
 * 全部用例跑在纯 node 环境，不再引入 DOM 模拟依赖。
 */
class MemoryStorage implements Storage {
  private map = new Map<string, string>();

  get length(): number {
    return this.map.size;
  }

  key(i: number): string | null {
    return Array.from(this.map.keys())[i] ?? null;
  }

  getItem(k: string): string | null {
    const key = String(k);
    return this.map.has(key) ? (this.map.get(key) as string) : null;
  }

  setItem(k: string, v: string): void {
    this.map.set(String(k), String(v));
  }

  removeItem(k: string): void {
    this.map.delete(String(k));
  }

  clear(): void {
    this.map.clear();
  }
}

// Node 的实验性 localStorage 挂在 globalThis 上（getter），须用 defineProperty 强制覆盖
Object.defineProperty(globalThis, 'localStorage', {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
});

// storage.ts 以 window 为浏览器判据：node 环境下将其指向 globalThis 即可走通全部逻辑
if (typeof (globalThis as { window?: unknown }).window === 'undefined') {
  (globalThis as { window?: unknown }).window = globalThis;
}
