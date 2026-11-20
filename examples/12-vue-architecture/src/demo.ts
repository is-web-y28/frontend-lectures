import type { InjectionKey } from 'vue'

const modes = ['legacy', 'routes', 'page-state', 'store', 'api', 'dependency', 'contract', 'locale', 'fallback', 'full'] as const
export type DemoMode = typeof modes[number]

export function readDemo(search: string): DemoMode {
  const requested = new URLSearchParams(search).get('demo')
  return modes.find(mode => mode === requested) ?? 'full'
}

export const demoKey: InjectionKey<DemoMode> = Symbol('lecture-12-demo')
