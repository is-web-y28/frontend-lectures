// Browser-native module shared by the JavaScript page and the Vue example.
/** @typedef {{ id: string, name: string, count: number }} Registration */
/** @param {unknown} value @returns {Registration[]} */
export function parseRegistrations(value) {
  if (!Array.isArray(value)) throw new Error('Ожидался массив заявок')
  const ids = new Set()
  for (const item of value) {
    if (item === null || typeof item !== 'object' || typeof item.id !== 'string' || !item.id ||
      typeof item.name !== 'string' || !item.name.trim() || !Number.isInteger(item.count) ||
      item.count < 1 || item.count > 5 || ids.has(item.id)) throw new Error('Неверные поля заявки или повтор id')
    ids.add(item.id)
  }
  return value
}

/** @param {string | URL} url @param {AbortSignal} [signal] */
export async function loadRegistrations(url, signal) {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return parseRegistrations(await response.json())
}

export function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(signal.reason) }
    const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); resolve() }, ms)
    if (signal?.aborted) abort()
    else signal?.addEventListener('abort', abort, { once: true })
  })
}

// Only the transport conditions below are simulated. fetch and validation are real.
/**
 * @param {string | URL} base
 * @param {() => { file?: string, version?: number }} conditions
 * @param {(message: string) => void} [report]
 */
export function createDemoSource(base, conditions, report = () => {}) {
  return async function load(query = '', signal) {
    const { file = 'registrations.json', version = 1 } = conditions()
    report(`Чтение «${query || 'все'}»: источник v${version}`)
    await wait(query === 'Анна' ? 1500 : query === 'Борис' ? 200 : 600, signal)
    if (file === '503') {
      const response = new Response('Недоступно', { status: 503 })
      throw new Error(`HTTP ${response.status}`)
    }
    const records = await loadRegistrations(new URL(file, base), signal)
    return records.filter(row => !query || row.name === query)
      .map(row => ({ ...row, count: Math.min(5, row.count + version - 1) }))
  }
}
