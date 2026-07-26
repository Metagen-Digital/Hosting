// Ambient (no top-level import/export) so FbqFn is usable without importing.

// Meta Pixel's global fbq() — a callable with a command queue hung off it.
interface FbqFn {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push: FbqFn
  loaded: boolean
  version: string
}

interface Window {
  fbq?: FbqFn
  _fbq?: FbqFn
}
