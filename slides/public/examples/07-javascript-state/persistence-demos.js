const MIGRATION_KEY = 'frontend-meetup:lecture07:appendix:versioned'
const CONFLICT_KEY = 'frontend-meetup:lecture07:appendix:conflict'

const migrationV1Fixture = {
  version: 1,
  registrations: [
    { id: 'a', name: 'Анна', email: 'anna@example.test', count: 2 },
    { id: 'b', name: 'Борис', email: 'boris@example.test', count: 1 },
  ],
}

const unknownVersionFixture = {
  version: 99,
  registrations: migrationV1Fixture.registrations,
}

const invalidV1Fixture = {
  version: 1,
  registrations: [
    { id: 'a', name: 'Анна', email: 'anna@example.test', count: 0 },
  ],
}

const conflictSeed = [
  { id: 'a', name: 'Анна' },
  { id: 'b', name: 'Борис' },
  { id: 'c', name: 'Вера' },
]

export function mountMigrationDemo(root) {
  root.classList.add('demo-page', 'mechanisms-page', 'appendix-page')
  root.innerHTML = `
    <header class="page-header">
      <h1>Версионированное сохранение: миграция без потери данных</h1>
      <p class="hint">v1 хранит <code>count</code>, v2 — <code>participants</code>. Запись происходит только после проверки результата миграции.</p>
    </header>
    <div class="split">
      <section class="panel" aria-labelledby="migration-actions-title">
        <h2 id="migration-actions-title">Управление отдельным ключом</h2>
        <div class="button-row">
          <button id="migration-fixture-v1" type="button">Образец v1</button>
          <button id="migration-fixture-unknown" class="secondary" type="button">Неизвестная версия</button>
          <button id="migration-fixture-invalid" class="secondary" type="button">Неверная заявка</button>
          <button id="migration-read" type="button">Прочитать и мигрировать</button>
          <button id="migration-clear" class="secondary" type="button">Очистить пример</button>
        </div>
        <p id="migration-status" class="status" role="status" aria-live="polite"></p>
        <p class="hint">Ключ: <code>frontend-meetup:lecture07:appendix:versioned</code>. Отсутствие ключа не означает сохранённый пустой массив.</p>
      </section>
      <section class="panel" aria-labelledby="migration-raw-title">
        <h2 id="migration-raw-title">Фактически сохранённые байты</h2>
        <pre class="readout"><code id="migration-raw"></code></pre>
        <h2>Результат чтения</h2>
        <pre class="readout" aria-live="polite"><code id="migration-result"></code></pre>
      </section>
    </div>
  `

  const status = root.querySelector('#migration-status')
  const rawOutput = root.querySelector('#migration-raw')
  const resultOutput = root.querySelector('#migration-result')

  function showStorage() {
    const read = readStorage(MIGRATION_KEY)
    if (!read.ok) {
      rawOutput.textContent = `Ошибка чтения localStorage: ${describeError(read.error)}`
      return read
    }
    rawOutput.textContent = read.value === null
      ? 'Ключ отсутствует — это не сохранённый пустой массив.'
      : read.value
    return read
  }

  function setFixture(value, label) {
    const written = writeStorage(MIGRATION_KEY, JSON.stringify(value))
    if (!written.ok) {
      status.textContent = `Не удалось записать «${label}»: ${describeError(written.error)}`
      showStorage()
      return
    }
    status.textContent = `Записан явный образец: ${label}.`
    resultOutput.textContent = 'Образец записан. Теперь выполните чтение и миграцию.'
    showStorage()
  }

  root.querySelector('#migration-fixture-v1').addEventListener('click', () => {
    setFixture(migrationV1Fixture, 'v1')
  })
  root.querySelector('#migration-fixture-unknown').addEventListener('click', () => {
    setFixture(unknownVersionFixture, 'неизвестная версия 99')
  })
  root.querySelector('#migration-fixture-invalid').addEventListener('click', () => {
    setFixture(invalidV1Fixture, 'v1 с недопустимым count')
  })
  root.querySelector('#migration-clear').addEventListener('click', () => {
    const removed = removeStorage(MIGRATION_KEY)
    if (!removed.ok) {
      status.textContent = `Не удалось очистить пример: ${describeError(removed.error)}`
      showStorage()
      return
    }
    status.textContent = 'Удалён только ключ этого примера.'
    resultOutput.textContent = 'Ключ отсутствует. Это не сохранённая пустая коллекция.'
    showStorage()
  })
  root.querySelector('#migration-read').addEventListener('click', () => {
    const read = showStorage()
    if (!read.ok) {
      status.textContent = `Чтение не удалось: ${describeError(read.error)}. Ничего не записано.`
      resultOutput.textContent = 'Миграция не выполнена: localStorage недоступен для чтения.'
      return
    }
    if (read.value === null) {
      status.textContent = 'Мигрировать нечего: ключ отсутствует. Ничего не записано.'
      resultOutput.textContent = 'Нет сохранённого конверта.'
      return
    }

    const parsed = parseJson(read.value)
    if (!parsed.ok) {
      status.textContent = `Миграция остановлена: JSON повреждён (${describeError(parsed.error)}). Ничего не записано.`
      resultOutput.textContent = 'Ошибка разбора JSON. Исходные байты сохранены без изменений.'
      return
    }

    const source = validateMigrationEnvelope(parsed.value)
    if (!source.ok) {
      status.textContent = `Миграция остановлена: ${source.error}. Ничего не записано.`
      resultOutput.textContent = 'Конверт не изменён: версия или заявки не прошли проверку.'
      return
    }

    if (source.version === 2) {
      status.textContent = 'Прочитана корректная v2. Повторная запись не нужна.'
      resultOutput.textContent = JSON.stringify(source.envelope)
      return
    }

    const migrated = {
      version: 2,
      registrations: source.envelope.registrations.map((registration) => ({
        id: registration.id,
        name: registration.name,
        email: registration.email,
        participants: registration.count,
      })),
    }
    const target = validateMigrationEnvelope(migrated)
    if (!target.ok || target.version !== 2) {
      status.textContent = `Миграция остановлена: результат v2 не прошёл проверку${target.ok ? '' : ` (${target.error})`}. Ничего не записано.`
      resultOutput.textContent = 'Исходный конверт не изменён.'
      return
    }

    const encoded = JSON.stringify(target.envelope)
    const written = writeStorage(MIGRATION_KEY, encoded)
    if (!written.ok) {
      status.textContent = `v2 проверена, но запись не удалась: ${describeError(written.error)}`
      resultOutput.textContent = 'Исходный конверт оставлен без намеренной замены.'
      showStorage()
      return
    }
    status.textContent = 'v1 успешно проверена, преобразована в v2 и записана.'
    resultOutput.textContent = JSON.stringify(target.envelope)
    showStorage()
  })

  status.textContent = 'Ничего не записывалось при открытии примера.'
  resultOutput.textContent = 'Выберите явный образец или прочитайте уже сохранённый конверт.'
  showStorage()
}

export function mountConflictDemo(root) {
  const parameters = new URLSearchParams(window.location.search)
  const side = parameters.get('side') === 'B' ? 'B' : 'A'
  const otherSide = side === 'A' ? 'B' : 'A'
  const otherTabTarget = `lecture07-conflict-${otherSide}`
  document.title = `Конфликт localStorage — вкладка ${side}`

  root.classList.add('demo-page', 'mechanisms-page', 'appendix-page')
  root.innerHTML = `
    <header class="page-header">
      <h1>Потерянное обновление в двух вкладках — вкладка ${side}</h1>
      <p class="hint">Откройте вкладку ${otherSide}, явно сбросьте общие данные, затем в обеих вкладках прочитайте снимок. Событие <code>storage</code> не обновляет уже прочитанную память.</p>
    </header>
    <div class="split">
      <section class="panel" aria-labelledby="conflict-actions-title">
        <h2 id="conflict-actions-title">Снимок этой вкладки</h2>
        <p><a id="conflict-other-tab" href="?demo=conflict&amp;side=${otherSide}" target="${otherTabTarget}">Открыть вкладку ${otherSide}</a></p>
        <div class="button-row">
          <button id="conflict-reset" type="button">Исходные три заявки</button>
          <button id="conflict-read-snapshot" type="button">Прочитать снимок</button>
          <button id="conflict-mutate" type="button" disabled>${side === 'A' ? 'Добавить Глеба и сохранить' : 'Удалить Бориса и сохранить'}</button>
        </div>
        <p id="conflict-status" class="status" role="status" aria-live="polite"></p>
        <p id="conflict-event" class="hint" aria-live="polite">Событие storage из другой вкладки пока не наблюдалось.</p>
        <p class="hint">Сброс меняет только общее хранилище и не меняет снимок другой вкладки. После сброса обе вкладки должны заново прочитать снимок.</p>
      </section>
      <section class="panel" aria-labelledby="conflict-memory-title">
        <h2 id="conflict-memory-title">Память вкладки ${side}</h2>
        <pre class="readout" aria-live="polite"><code id="conflict-memory"></code></pre>
        <h2>Текущее значение общего ключа</h2>
        <pre class="readout"><code id="conflict-stored"></code></pre>
      </section>
    </div>
  `

  const status = root.querySelector('#conflict-status')
  const eventOutput = root.querySelector('#conflict-event')
  const memoryOutput = root.querySelector('#conflict-memory')
  const storedOutput = root.querySelector('#conflict-stored')
  const mutateButton = root.querySelector('#conflict-mutate')
  let snapshot = null

  function render() {
    memoryOutput.textContent = snapshot === null
      ? 'Снимок ещё не прочитан. Локальное изменение недоступно.'
      : JSON.stringify(snapshot)
    mutateButton.disabled = snapshot === null

    const read = readStorage(CONFLICT_KEY)
    if (!read.ok) {
      storedOutput.textContent = `Ошибка чтения localStorage: ${describeError(read.error)}`
      return read
    }
    if (read.value === null) {
      storedOutput.textContent = 'Ключ отсутствует. Это не снимок и не пустой список.'
      return read
    }
    storedOutput.textContent = read.value
    return read
  }

  function readSnapshot() {
    const read = render()
    if (!read.ok) {
      status.textContent = `Снимок не прочитан: ${describeError(read.error)}`
      return
    }
    if (read.value === null) {
      status.textContent = 'Снимок не прочитан: общий ключ отсутствует.'
      return
    }
    const parsed = parseJson(read.value)
    if (!parsed.ok) {
      status.textContent = `Снимок не прочитан: JSON повреждён (${describeError(parsed.error)}).`
      return
    }
    const validated = validateConflictSnapshot(parsed.value)
    if (!validated.ok) {
      status.textContent = `Снимок не прочитан: ${validated.error}`
      return
    }
    snapshot = validated.records
    status.textContent = `Вкладка ${side} сохранила в памяти отдельный снимок из ${snapshot.length} заявок.`
    render()
  }

  root.querySelector('#conflict-reset').addEventListener('click', () => {
    const written = writeStorage(CONFLICT_KEY, JSON.stringify(conflictSeed))
    if (!written.ok) {
      status.textContent = `Исходные заявки не записаны: ${describeError(written.error)}`
      render()
      return
    }
    status.textContent = 'В общий ключ явно записаны исходные три заявки. Локальный снимок не менялся.'
    render()
  })
  root.querySelector('#conflict-read-snapshot').addEventListener('click', readSnapshot)
  mutateButton.addEventListener('click', () => {
    if (snapshot === null) {
      return
    }
    if (side === 'A') {
      if (!snapshot.some((registration) => registration.id === 'g')) {
        snapshot = [...snapshot, { id: 'g', name: 'Глеб' }]
      }
    } else {
      snapshot = snapshot.filter((registration) => registration.id !== 'b')
    }

    const written = writeStorage(CONFLICT_KEY, JSON.stringify(snapshot))
    if (!written.ok) {
      status.textContent = `Локальный снимок изменён, но запись не удалась: ${describeError(written.error)}`
      render()
      return
    }
    status.textContent = side === 'A'
      ? 'Вкладка A записала свой снимок с Глебом.'
      : 'Вкладка B записала свой снимок без Бориса. Сравните общий ключ со снимком вкладки A.'
    render()
  })

  function onStorage(event) {
    if (event.key !== CONFLICT_KEY) {
      return
    }
    eventOutput.textContent = `Получено настоящее событие storage из другой вкладки: новое значение ${event.newValue === null ? 'удалено' : 'изменено'}. Снимок этой вкладки не обновлялся.`
    render()
  }

  window.addEventListener('storage', onStorage)
  window.addEventListener('pagehide', () => {
    window.removeEventListener('storage', onStorage)
  }, { once: true })

  status.textContent = `Вкладка ${side} ещё не читала снимок. Сначала подготовьте общий ключ, затем прочитайте его явно.`
  render()
}

function validateMigrationEnvelope(value) {
  if (!isPlainObject(value)) {
    return { ok: false, error: 'конверт должен быть объектом' }
  }
  if (!Number.isInteger(value.version)) {
    return { ok: false, error: 'в конверте нет целочисленной версии' }
  }
  if (value.version !== 1 && value.version !== 2) {
    return { ok: false, error: `версия ${value.version} неизвестна` }
  }
  if (!Array.isArray(value.registrations)) {
    return { ok: false, error: 'поле registrations должно быть массивом' }
  }

  const ids = new Set()
  const registrations = []
  for (const [index, record] of value.registrations.entries()) {
    const validated = validateMigrationRecord(record, value.version, index, ids)
    if (!validated.ok) {
      return validated
    }
    registrations.push(validated.record)
  }
  return {
    ok: true,
    version: value.version,
    envelope: { version: value.version, registrations },
  }
}

function validateMigrationRecord(record, version, index, ids) {
  if (!isPlainObject(record)) {
    return { ok: false, error: `заявка ${index + 1} должна быть объектом` }
  }
  if (!isNonBlankString(record.id)) {
    return { ok: false, error: `у заявки ${index + 1} пустой id` }
  }
  if (ids.has(record.id)) {
    return { ok: false, error: `id «${record.id}» повторяется` }
  }
  if (!isNonBlankString(record.name) || !isNonBlankString(record.email)) {
    return { ok: false, error: `у заявки ${index + 1} должно быть непустое имя и email` }
  }
  const quantityName = version === 1 ? 'count' : 'participants'
  if (!Number.isInteger(record[quantityName]) || record[quantityName] < 1 || record[quantityName] > 5) {
    return { ok: false, error: `у заявки ${index + 1} ${quantityName} должен быть целым числом от 1 до 5` }
  }
  ids.add(record.id)
  return {
    ok: true,
    record: version === 1
      ? { id: record.id, name: record.name, email: record.email, count: record.count }
      : { id: record.id, name: record.name, email: record.email, participants: record.participants },
  }
}

function validateConflictSnapshot(value) {
  if (!Array.isArray(value)) {
    return { ok: false, error: 'общий ключ должен содержать JSON-массив заявок' }
  }
  const ids = new Set()
  const records = []
  for (const [index, record] of value.entries()) {
    if (!isPlainObject(record) || !isNonBlankString(record.id) || !isNonBlankString(record.name)) {
      return { ok: false, error: `заявка ${index + 1} должна иметь непустые id и name` }
    }
    if (ids.has(record.id)) {
      return { ok: false, error: `id «${record.id}» повторяется` }
    }
    ids.add(record.id)
    records.push({ id: record.id, name: record.name })
  }
  return { ok: true, records }
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonBlankString(value) {
  return typeof value === 'string' && value.trim() !== ''
}

function parseJson(value) {
  try {
    return { ok: true, value: JSON.parse(value) }
  } catch (error) {
    return { ok: false, error }
  }
}

function readStorage(key) {
  try {
    return { ok: true, value: window.localStorage.getItem(key) }
  } catch (error) {
    return { ok: false, error }
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value)
    return { ok: true }
  } catch (error) {
    return { ok: false, error }
  }
}

function removeStorage(key) {
  try {
    window.localStorage.removeItem(key)
    return { ok: true }
  } catch (error) {
    return { ok: false, error }
  }
}

function describeError(error) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`
  }
  return String(error)
}
