import { eventLoopCases, getCaseSource } from './event-loop-cases.js'
import { parseRegistrations, createDemoSource, wait } from './registration-client.js'
import { createRegistrationState, createRegistrationSearch, describeRegistrationState } from './registration-model.js'

const $ = (id) => document.getElementById(id)
const mode = new URLSearchParams(location.search).get('demo') || 'http'
const descriptions = {
  waiting: 'Сравните один список из памяти и по HTTP. Задержка добавлена для наблюдения; во время чтения проверьте отклик.',
  'event-loop': 'Предскажите порядок строк и выполните код. Журнал измеряет порядок вывода; стек и очереди по нему разбираем вручную.',
  state: 'Чистый JavaScript: объект state хранит результат операции, commit меняет его и вызывает render. Снимок ниже показывает настоящие значения.',
  http: 'fetch читает локальные файлы по HTTP. Только 503 создаётся через new Response: это имитация статуса, не сервер.',
  race: 'Учебный транспорт на Promise и таймерах, без сети. Анна отвечает через 1,5 с, Борис — через 0,2 с.',
  full: 'Чтение локального JSON через fetch, проверка, поиск и кеш в памяти. Задержки, изменение мест и 503 имитируются; серверной записи нет.',
  cache: 'Кеш приложения в памяти: свежесть 5 с. JSON читается через fetch; изменение версии и сбой имитируются. HTTP-кеш не измеряется.',
}
$(Object.hasOwn(descriptions, mode) ? mode : 'http').hidden = false
$('description').textContent = descriptions[mode] || descriptions.http
document.body.dataset.demo = Object.hasOwn(descriptions, mode) ? mode : 'http'
if (mode === 'event-loop') {
  $('data').hidden = true
}
function log(message) {
  const li = document.createElement('li')
  li.textContent = message
  $('log').append(li)
  li.scrollIntoView({ block: 'nearest' })
}
function status(message, busy = false) {
  $('status').textContent = message
  $('data').setAttribute('aria-busy', String(busy))
}
function render(rows) {
  $('list').replaceChildren(...rows.map((row) => {
    const li = document.createElement('li')
    li.textContent = `${row.name} · мест: ${row.count}`
    return li
  }))
}
const selectedCase = new URLSearchParams(location.search).get('case') || 'basic'
for (const [id, example] of Object.entries(eventLoopCases)) {
  // await is introduced later in the lecture.
  if (['await', 'pending'].includes(id) && !['await', 'pending'].includes(selectedCase)) continue
  const option = document.createElement('option')
  option.value = id
  option.textContent = example.title
  $('event-case').append(option)
}
$('event-case').value = Object.hasOwn(eventLoopCases, selectedCase) ? selectedCase : 'basic'
function showEventSource() {
  $('event-source').textContent = getCaseSource(eventLoopCases[$('event-case').value])
  $('event-respond').hidden = $('event-case').value !== 'pending'
}
$('event-case').onchange = showEventSource
showEventSource()
$('run').onclick = async () => {
  $('run').disabled = true
  $('event-case').disabled = true
  $('log').replaceChildren()
  const completion = eventLoopCases[$('event-case').value].run(log)
  $('event-respond').disabled = $('event-case').value !== 'pending'
  try {
    await completion
    await wait(50)
  } finally {
    $('run').disabled = false
    $('event-case').disabled = false
    $('event-respond').disabled = true
  }
}
$('event-respond').onclick = () => log('U')
let clicks = 0
$('respond').onclick = () => {
  $('click-count').textContent = `Нажатий во время работы: ${++clicks}`
}
const initialRows = [
  { id: 'a', name: 'Анна', count: 1 },
  { id: 'b', name: 'Борис', count: 2 },
  { id: 'c', name: 'Вера', count: 1 },
]
$('waiting-source').onchange = () => {
  render([])
  status('Ещё не загружено')
  $('log').replaceChildren()
}
$('load-waiting').onclick = () => {
  if ($('waiting-source').value === 'memory') {
    render(initialRows)
    status(`Получено заявок: ${initialRows.length}`)
    log('Готовый массив передан отображению в том же обработчике')
  } else $('load').click()
}
$('load').onclick = async () => {
  $('load').disabled = true
  $('load-waiting').disabled = true
  $('waiting-source').disabled = true
  render([])
  status('Загрузка…', true)
  try {
    if (mode === 'waiting') {
      log('Чтение началось; готового массива пока нет')
      await wait(1500)
    }
    const file = $('response').value
    const response = file === '503'
      ? new Response('Недоступно', { status: 503 })
      : await fetch(new URL(file, import.meta.url))
    if (mode !== 'waiting') log(`Response: ${response.status}, ok=${response.ok}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const value = await response.json()
    if (mode !== 'waiting') log('JSON разобран; проверяем поля')
    const rows = parseRegistrations(value)
    if (mode === 'waiting') log('Массив получен; обновляем список')
    render(rows)
    status(rows.length ? `Получено заявок: ${rows.length}` : 'Заявок пока нет')
  } catch (error) {
    status(`Ошибка: ${error.message}. Можно повторить загрузку.`)
    log(`${error.name}: ${error.message}`)
  } finally {
    $('data').setAttribute('aria-busy', 'false')
    $('load').disabled = false
    $('load-waiting').disabled = false
    $('waiting-source').disabled = false
  }
}
let latest = 0
let controller
async function search(name, delay) {
  const protection = $('protection').value
  const id = ++latest
  if (protection === 'abort') controller?.abort()
  const ownController = new AbortController()
  controller = ownController
  status(`Ищем: ${name}`, true)
  log(`#${id}: начало — ${name}`)
  try {
    await wait(delay, ownController.signal)
    log(`#${id}: ответ — ${name}`)
    if (protection !== 'none' && id !== latest) { log(`#${id}: устарел, пропускаем`); return }
    render([{ id: name, name, count: name === 'Анна' ? 1 : 2 }])
    status(`Результат: ${name}`)
  } catch (error) {
    log(`#${id}: ${error.name}`)
    if (id === latest) status('Отменено')
  } finally {
    if (protection === 'none' || id === latest) $('data').setAttribute('aria-busy', 'false')
  }
}
$('anna').onclick = () => search('Анна', 1500)
$('boris').onclick = () => search('Борис', 200)
let cached
let sourceVersion = 1
let refreshing = false
async function read(force = false) {
  if (refreshing) return
  if (!force && cached && Date.now() - cached.savedAt < 5000) {
    render(cached.rows); status('Свежий кеш приложения'); log('Без обращения к источнику'); return
  }
  refreshing = true
  status(cached ? 'Показываем прежние данные; обновляем…' : 'Загрузка…', true)
  if (cached) render(cached.rows)
  const version = sourceVersion
  const fail = $('fail').checked
  log(`Начали чтение источника v${version}`)
  try {
    await wait(600)
    if (fail) throw new Error('Источник временно недоступен')
    const response = await fetch(new URL('registrations.json', import.meta.url))
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const sourceRows = parseRegistrations(await response.json())
    const rows = sourceRows.map(row => ({ ...row, count: Math.min(5, row.count + version - 1) }))
    cached = { rows, savedAt: Date.now() }
    render(rows); status(`Версия ${version}; обновлено ${new Date(cached.savedAt).toLocaleTimeString()}`)
  } catch (error) {
    status(cached ? 'Ошибка обновления; показаны прежние данные' : 'Ошибка первой загрузки')
  } finally {
    refreshing = false
    $('data').setAttribute('aria-busy', 'false')
  }
}
$('read').onclick = () => read()
$('refresh').onclick = () => read(true)
$('change').onclick = () => { sourceVersion = sourceVersion % 5 + 1; log(`Источник изменён: v${sourceVersion}; кеш ещё прежний`) }

// A first load, before adding overlapping requests or a cache.
if (mode === 'state') {
  // #region basic-state
  const state = {
    rows: [], phase: 'idle', errorText: '',
  }
  function commit(patch) {
    Object.assign(state, patch)
    renderState()
  }
  // #endregion basic-state
  const loadRegistrations = createDemoSource(new URL('./', import.meta.url), () => ({
    file: $('state-response').value,
  }))
  // #region basic-reload
  async function reload() {
    commit({
      phase: 'loading', rows: [], errorText: '',
    })
    try {
      const rows = await loadRegistrations()
      commit({ rows, phase: 'success' })
    } catch (error) {
      commit({
        errorText: 'Ошибка загрузки', phase: 'error',
      })
      log(`${error.name}: ${error.message}`)
    }
  }
  // #endregion basic-reload
  const loadButton = $('state-load')
  const statusElement = $('status')
  // #region basic-render
  function renderState() {
    const busy = state.phase === 'loading'
    loadButton.disabled = busy
    const texts = {
      idle: 'Ещё не загружено', loading: 'Загрузка…',
      error: state.errorText,
      success: state.rows.length
        ? 'Заявки получены' : 'Заявок пока нет',
    }
    statusElement.textContent = texts[state.phase]
    render(state.rows)
    updateDiagnostics()
  }
  // #endregion basic-render
  function updateDiagnostics() {
    const busy = state.phase === 'loading'
    $('data').setAttribute('aria-busy', String(busy))
    $('state-response').disabled = busy
    $('state-snapshot').textContent = JSON.stringify({
      phase: state.phase, rowCount: state.rows.length, errorText: state.errorText,
    }, null, 2)
  }
  loadButton.onclick = reload
  renderState()
}

// The completed JavaScript application: the same module is later used by Vue.
if (mode === 'full') {
  let sourceVersion = 1
  let renderedEvents = 0
  const state = createRegistrationState()
  const load = createDemoSource(new URL('./', import.meta.url), () => ({
    file: $('full-response').value, version: sourceVersion,
  }), message => actions.report(message))
  // #region native-binding
  const actions = createRegistrationSearch(
    state, load, renderState,
  )
  $('full-open').onclick = () => {
    actions.search($('full-query').value)
  }
  // #endregion native-binding
  $('full-query').onchange = () => actions.search($('full-query').value)
  $('full-refresh').onclick = () => actions.search($('full-query').value, true)
  function renderState() {
    render(state.rows)
    status(describeRegistrationState(state), state.phase === 'loading')
    for (const message of state.events.slice(renderedEvents)) log(message)
    renderedEvents = state.events.length
  }
  $('full-change').onclick = () => {
    sourceVersion = sourceVersion % 5 + 1
    actions.report(`Источник изменён: v${sourceVersion}; снимки в кеше прежние`)
  }
  renderState()
}
