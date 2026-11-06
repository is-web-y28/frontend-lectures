// The displayed source comes from the same functions that actually run.
export const eventLoopCases = {
  basic: {
    title: 'Задача и микрозадача',
    run(log) {
      log('A')
      setTimeout(() => log('T'), 0)
      Promise.resolve().then(() => log('P'))
      log('B')
    },
  },
  nested: {
    title: 'Микрозадача внутри микрозадачи',
    run(log) {
      log('A')
      queueMicrotask(() => {
        log('M1')
        queueMicrotask(() => log('M3'))
      })
      Promise.resolve().then(() => log('M2'))
      setTimeout(() => {
        log('T')
        queueMicrotask(() => log('MT'))
      }, 0)
      log('B')
    },
  },
  chain: {
    title: 'Два звена then',
    run(log) {
      log('A')
      Promise.resolve()
        .then(() => log('P1'))
        .then(() => log('P2'))
      queueMicrotask(() => log('M'))
      log('B')
    },
  },
  timer: {
    title: 'Promise завершается внутри таймера',
    run(log) {
      log('A')
      const p = new Promise(resolve => {
        setTimeout(() => {
          log('T1')
          resolve()
        }, 0)
      })
      p.then(() => log('P'))
      setTimeout(() => log('T2'), 0)
      log('B')
    },
  },
  await: {
    title: 'Продолжение await',
    run(log) {
      log('A')
      async function load() {
        log('B')
        await Promise.resolve()
        log('C')
      }
      load()
      queueMicrotask(() => log('M'))
      setTimeout(() => log('T'), 0)
      log('D')
    },
  },
  pending: {
    title: 'Ожидание pending Promise',
    run(log) {
      log('A')
      const result = new Promise(resolve => {
        setTimeout(() => { log('T'); resolve(3) }, 1000)
      })
      async function load() {
        log('B')
        await result
        log('C')
      }
      const operation = load()
      log('D')
      return operation
    },
  },
}

export function getCaseSource(example) {
  const source = example.run.toString()
  return source.slice(source.indexOf('{') + 1, source.lastIndexOf('}'))
    .replace(/^      /gm, '').trim()
}
