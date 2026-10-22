const DATABASE_NAME = 'frontend-meetup-07-appendix'
const DATABASE_VERSION = 1
const STORE_NAME = 'registrations'

const seedRegistrations = [
  { id: 'a', name: 'Анна', email: 'anna@example.com', count: 1 },
  { id: 'b', name: 'Борис', email: 'boris@example.com', count: 2 },
  { id: 'c', name: 'Вера', email: 'vera@example.com', count: 3 },
]

export function mountIndexeddbDemo(root, view = 'rollback') {
  const showRollback = view !== 'indexes'
  const showIndexes = !showRollback
  const rollbackPanel = showRollback
    ? `
      <section class="panel" aria-labelledby="indexeddb-data-title">
        <h2 id="indexeddb-data-title">Записи и атомарность</h2>
        <div class="button-row">
          <button id="indexeddb-seed" type="button" disabled>Исходные три заявки</button>
          <button id="indexeddb-duplicate" type="button" disabled>Две записи с одним ключом</button>
        </div>
        <p class="hint">Вторая кнопка помещает два <code>add()</code> с ключом <code>rollback</code> в одну транзакцию.</p>
        <pre id="indexeddb-records" class="readout" aria-live="polite"><code>Ожидание открытия базы…</code></pre>
      </section>
    `
    : ''
  const indexesPanel = showIndexes
    ? `
      <section class="panel" aria-labelledby="indexeddb-index-title">
        <h2 id="indexeddb-index-title">Индекс — не подстрочный поиск</h2>
          <div class="button-row">
            <button id="indexeddb-seed" type="button" disabled>Исходные три заявки</button>
          </div>
        <label for="indexeddb-query">Email для запроса</label>
        <input id="indexeddb-query" type="text" value="anna@example.com" disabled />
        <div class="button-row">
          <button id="indexeddb-exact" type="button" disabled>Точное совпадение</button>
          <button id="indexeddb-range" type="button" disabled>Диапазон count ≥ 2</button>
          <button id="indexeddb-substring" type="button" disabled>Подстрока через includes</button>
        </div>
      </section>
    `
    : ''

  root.classList.add('demo-page', 'mechanisms-page', 'appendix-page')
  root.classList.toggle('index-query-page', showIndexes)
  root.innerHTML = `
    <header class="page-header">
      <p class="eyebrow">IndexedDB</p>
      <h1>${showRollback ? 'Транзакция и откат' : 'Индексы IndexedDB'}</h1>
      <p class="hint">Демонстрация работает в отдельной базе <code>frontend-meetup-07-appendix</code>.</p>
    </header>
    <div class="split">
      ${rollbackPanel}
      ${indexesPanel}
    <section class="panel" aria-labelledby="indexeddb-events-title">
      <h2 id="indexeddb-events-title">Состояние и события API</h2>
      <p id="indexeddb-status" class="status" aria-live="polite">Открываем базу…</p>
      ${showIndexes ? `
        <pre id="indexeddb-query-results" class="readout" aria-live="polite"><code>Результат запроса появится здесь.</code></pre>
        <details>
          <summary>Все записи базы</summary>
          <pre id="indexeddb-records" class="readout"><code>Ожидание открытия базы…</code></pre>
        </details>
      ` : ''}
      <pre id="indexeddb-events" class="readout" aria-live="polite"><code></code></pre>
    </section>
    </div>
  `

  const seedButton = root.querySelector('#indexeddb-seed')
  const duplicateButton = root.querySelector('#indexeddb-duplicate')
  const exactButton = root.querySelector('#indexeddb-exact')
  const rangeButton = root.querySelector('#indexeddb-range')
  const substringButton = root.querySelector('#indexeddb-substring')
  const queryInput = root.querySelector('#indexeddb-query')
  const recordsOutput = root.querySelector('#indexeddb-records code')
  const queryOutput = root.querySelector('#indexeddb-query-results code')
  const statusOutput = root.querySelector('#indexeddb-status')
  const eventsOutput = root.querySelector('#indexeddb-events code')
  const controls = [
    seedButton,
    duplicateButton,
    exactButton,
    rangeButton,
    substringButton,
    queryInput,
  ].filter(Boolean)

  let database = null
  let ready = false
  const eventLines = []

  function setStatus(message) {
    statusOutput.textContent = message
  }

  function log(message) {
    eventLines.push(message)
    eventsOutput.textContent = eventLines.join('\n')
  }

  function setControlsEnabled(enabled) {
    controls.forEach((control) => {
      control.disabled = !enabled
    })
  }

  function describeError(error) {
    if (error instanceof DOMException || error instanceof Error) {
      return `${error.name}: ${error.message}`
    }
    return String(error)
  }

  function showRows(rows) {
    recordsOutput.textContent = JSON.stringify(rows)
  }

  function showQuery(label, rows) {
    queryOutput.textContent = `${label}\n${JSON.stringify(rows)}`
  }

  function waitForTransaction(transaction, label) {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        log(`${label}: transaction complete`)
        resolve()
      }
      transaction.onabort = () => {
        log(`${label}: transaction abort ${transaction.error?.name || 'AbortError'}`)
        reject(transaction.error || new DOMException('Transaction aborted', 'AbortError'))
      }
    })
  }

  function waitForRequest(request, label) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const value = Array.isArray(request.result) ? `[${request.result.length} записей]` : JSON.stringify(request.result)
        log(`${label}: request success ${value}`)
        resolve(request.result)
      }
      request.onerror = () => {
        log(`${label}: request error ${request.error.name}`)
        reject(request.error)
      }
    })
  }

  async function readAllRecords(label) {
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const complete = waitForTransaction(transaction, label)
    const request = transaction.objectStore(STORE_NAME).getAll()
    const rows = await Promise.all([waitForRequest(request, `${label} getAll`), complete])
    return rows[0]
  }

  async function refreshRows(label) {
    const rows = await readAllRecords(label)
    showRows(rows)
    return rows
  }

  async function seed() {
    const label = 'seed'
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const complete = waitForTransaction(transaction, label)
    const store = transaction.objectStore(STORE_NAME)
    const clearRequest = store.clear()
    waitForRequest(clearRequest, `${label} clear`).catch(() => {})
    seedRegistrations.forEach((registration) => {
      const request = store.add(registration)
      waitForRequest(request, `${label} add ${registration.id}`).catch(() => {})
    })
    await complete
    await refreshRows('seed readback')
    setStatus('Исходные три заявки записаны в IndexedDB.')
  }

  async function duplicateAdd() {
    const label = 'add'
    const transaction = database.transaction(STORE_NAME, 'readwrite')
    const complete = waitForTransaction(transaction, label)
    const store = transaction.objectStore(STORE_NAME)
    const rollbackRegistration = {
      id: 'rollback',
      name: 'Откат',
      email: 'rollback@example.com',
      count: 4,
    }
    const first = store.add(rollbackRegistration)
    const second = store.add(rollbackRegistration)
    waitForRequest(first, `${label} first add`).catch(() => {})
    waitForRequest(second, `${label} second add`).catch(() => {})

    try {
      await complete
    } catch (error) {
      log(`${label}: observed ${describeError(error)}`)
    }

    const rows = await refreshRows('duplicate readback')
    const rollbackRows = rows.filter((registration) => registration.id === 'rollback')
    log(`duplicate readback: rollback rows ${JSON.stringify(rollbackRows)}`)
    setStatus('Транзакция завершилась; итоговые записи прочитаны новой readonly-транзакцией.')
  }

  async function exactEmail() {
    const value = queryInput.value
    const label = `email index getAll ${JSON.stringify(value)}`
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const complete = waitForTransaction(transaction, label)
    const index = transaction.objectStore(STORE_NAME).index('email')
    const request = index.getAll(value)
    const results = await Promise.all([waitForRequest(request, label), complete])
    showQuery(`email.getAll(${JSON.stringify(value)})`, results[0])
    setStatus('Выполнен точный запрос по индексу email.')
  }

  async function countRange() {
    const label = 'count index getAll lowerBound(2)'
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const complete = waitForTransaction(transaction, label)
    const index = transaction.objectStore(STORE_NAME).index('count')
    const request = index.getAll(IDBKeyRange.lowerBound(2))
    const results = await Promise.all([waitForRequest(request, label), complete])
    showQuery('count.getAll(IDBKeyRange.lowerBound(2))', results[0])
    setStatus('Выполнен диапазонный запрос по индексу count.')
  }

  async function substringEmail() {
    const value = queryInput.value
    const label = 'email index getAll for includes'
    const transaction = database.transaction(STORE_NAME, 'readonly')
    const complete = waitForTransaction(transaction, label)
    const index = transaction.objectStore(STORE_NAME).index('email')
    const request = index.getAll()
    const results = await Promise.all([waitForRequest(request, label), complete])
    const matching = results[0].filter((registration) => registration.email.includes(value))
    log(`email includes ${JSON.stringify(value)}: ${JSON.stringify(matching)}`)
    showQuery(`email.getAll().filter(email.includes(${JSON.stringify(value)}))`, matching)
    setStatus('Все записи прочитаны через email.getAll(), затем отфильтрованы JavaScript.')
  }

  async function runAction(name, action) {
    if (!ready || !database) {
      return
    }
    ready = false
    setControlsEnabled(false)
    eventLines.length = 0
    eventsOutput.textContent = ''
    setStatus(`Выполняется: ${name}`)
    try {
      await action()
    } catch (error) {
      log(`${name}: error ${describeError(error)}`)
      setStatus(`Ошибка ${name}: ${describeError(error)}`)
    } finally {
      if (database) {
        ready = true
        setControlsEnabled(true)
      }
    }
  }

  function closeDatabase(reason) {
    if (!database) {
      return
    }
    database.close()
    database = null
    ready = false
    setControlsEnabled(false)
    setStatus(`Соединение с IndexedDB закрыто: ${reason}.`)
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      let request
      try {
        request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
      } catch (error) {
        log(`indexedDB.open: synchronous error ${describeError(error)}`)
        reject(error)
        return
      }

      request.onupgradeneeded = (event) => {
        log(`indexedDB.open: upgradeneeded ${event.oldVersion} → ${event.newVersion}`)
        try {
          const upgradeDatabase = request.result
          const store = upgradeDatabase.objectStoreNames.contains(STORE_NAME)
            ? request.transaction.objectStore(STORE_NAME)
            : upgradeDatabase.createObjectStore(STORE_NAME, { keyPath: 'id' })
          if (!store.indexNames.contains('email')) {
            store.createIndex('email', 'email', { unique: false })
          }
          if (!store.indexNames.contains('count')) {
            store.createIndex('count', 'count', { unique: false })
          }
        } catch (error) {
          log(`indexedDB.open: upgrade error ${describeError(error)}`)
          request.transaction.abort()
        }
      }
      request.onblocked = () => {
        log('indexedDB.open: blocked')
        setStatus('Открытие базы заблокировано другим соединением.')
      }
      request.onerror = () => {
        log(`indexedDB.open: request error ${describeError(request.error)}`)
        reject(request.error)
      }
      request.onsuccess = () => {
        log('indexedDB.open: request success')
        resolve(request.result)
      }
    })
  }

  if (seedButton) {
    seedButton.addEventListener('click', () => runAction('исходные заявки', seed))
  }
  if (duplicateButton) {
    duplicateButton.addEventListener('click', () => runAction('две записи с одним ключом', duplicateAdd))
  }
  if (exactButton) {
    exactButton.addEventListener('click', () => runAction('точное совпадение', exactEmail))
  }
  if (rangeButton) {
    rangeButton.addEventListener('click', () => runAction('диапазон count', countRange))
  }
  if (substringButton) {
    substringButton.addEventListener('click', () => runAction('подстрока через includes', substringEmail))
  }

  window.addEventListener('pagehide', () => {
    log('pagehide: connection close')
    closeDatabase('pagehide')
  }, { once: true })

  void (async () => {
    try {
      database = await openDatabase()
      database.onversionchange = (event) => {
        log(`database versionchange: ${event.oldVersion} → ${event.newVersion}`)
        closeDatabase('изменение версии')
      }
      await refreshRows('initial read')
      ready = true
      setControlsEnabled(true)
      setStatus('База открыта. «Исходные три заявки» очистит и заполнит только хранилище этой демонстрации.')
    } catch (error) {
      log(`open/read: error ${describeError(error)}`)
      setStatus(`Не удалось открыть базу или прочитать записи: ${describeError(error)}`)
      setControlsEnabled(false)
    }
  })()

}
