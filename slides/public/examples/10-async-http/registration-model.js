// No Vue or DOM imports: each demonstration owns its own state and requests.
// #region initial-state
export function createRegistrationState() {
  return {
    query: '', rows: [], phase: 'idle',
    errorText: '', hasData: false,
    fromCache: false, savedAt: 0, events: [],
  }
}
// #endregion initial-state

// #region factory-state
export function createRegistrationSearch(
  state, load, render = () => {},
) {
  let latest = 0
  let controller
  let disposed = false
  const cache = new Map()
  function commit(patch) {
    Object.assign(state, patch)
    render()
  }
  // #endregion factory-state
  function report(message) {
    if (disposed) return
    state.events.push(message)
    render()
  }
  async function search(query = '', force = false) {
    if (disposed) return
    const id = ++latest
    controller?.abort()
    controller = new AbortController()
    const signal = controller.signal
    const entry = cache.get(query)
    if (!force && entry && Date.now() - entry.savedAt < 5000) {
      commit({ query, rows: entry.rows, phase: 'success', errorText: '',
        hasData: true, fromCache: true, savedAt: entry.savedAt })
      report(`#${id}: свежий кеш для «${query || 'все'}», без чтения`)
      return
    }
    commit({ query, rows: entry ? entry.rows : [], phase: 'loading', errorText: '',
      hasData: !!entry, fromCache: false, savedAt: entry ? entry.savedAt : 0 })
    report(`#${id}: начало загрузки «${query || 'все'}»`)
    try {
      const rows = await load(query, signal)
      if (disposed) return
      if (id !== latest) { report(`#${id}: устарел, пропускаем`); return }
      const savedAt = Date.now()
      cache.set(query, { rows, savedAt })
      commit({ rows, phase: 'success', hasData: true, savedAt })
      report(`#${id}: проверенный результат применён и записан в кеш`)
    } catch (error) {
      if (disposed) return
      // Stale operations may be observed in the log, but cannot change the result.
      if (id !== latest) { report(`#${id}: ${error.name}, устаревший исход пропущен`); return }
      commit({ phase: 'error', errorText: error.message })
      report(`#${id}: ${error.name}: ${error.message}`)
    }
  }
  function dispose() {
    disposed = true
    latest++
    controller?.abort()
  }
  // #region factory-return
  return { search, dispose, report }
}
// #endregion factory-return

export function describeRegistrationState(state) {
  if (state.phase === 'idle') return 'Ещё не загружено'
  if (state.phase === 'loading') return state.hasData ? 'Показаны прежние данные; обновляем…' : 'Загрузка…'
  if (state.phase === 'error') return state.hasData
    ? 'Ошибка обновления; показаны прежние данные'
    : 'Ошибка загрузки; можно повторить'
  if (state.fromCache) return 'Свежий кеш приложения'
  return state.rows.length ? `Получено заявок: ${state.rows.length}` : 'Заявок пока нет'
}
