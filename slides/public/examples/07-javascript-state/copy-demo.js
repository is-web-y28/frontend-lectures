export function mountCopyDemo(root) {
  root.classList.add('demo-page', 'mechanisms-page', 'appendix-page')
  root.innerHTML = `
    <header class="page-header">
      <h1>Новая запись — не всегда новый вложенный объект</h1>
      <p class="hint">Каждая проверка начинает с отдельной записи Анны. Данные приложения не меняются.</p>
    </header>
    <div class="split">
      <section class="panel" aria-labelledby="copy-actions-title">
        <h2 id="copy-actions-title">Предскажите исходную почту</h2>
        <div class="button-row">
          <button id="copy-spread" type="button">Spread: изменить почту</button>
          <button id="copy-structured" type="button">structuredClone: изменить почту</button>
          <button id="copy-function" type="button">Скопировать функцию</button>
          <button id="copy-reset" class="secondary" type="button">Сбросить</button>
        </div>
        <p id="copy-status" class="status" aria-live="polite"></p>
        <pre id="copy-result" class="readout"><code></code></pre>
      </section>
      <section class="panel" aria-labelledby="copy-values-title">
        <h2 id="copy-values-title">Исходная запись и копия</h2>
        <pre id="copy-values" class="readout"><code></code></pre>
      </section>
    </div>
  `
  const status = root.querySelector('#copy-status')
  const result = root.querySelector('#copy-result code')
  const values = root.querySelector('#copy-values code')
  const makeRecord = () => ({ name: 'Анна', contact: { email: 'anna@example.com' } })

  function reset() {
    status.textContent = 'Сначала прогноз: изменится ли почта исходной записи?'
    result.textContent = 'Выберите способ копирования. Результат ещё не вычислен.'
    values.textContent = JSON.stringify({ original: makeRecord() }, null, 2)
  }
  function compare(useStructuredClone) {
    const original = makeRecord()
    const copy = useStructuredClone ? structuredClone(original) : { ...original }
    copy.contact.email = 'copy@example.com'
    result.textContent = [
      `copy === original: ${copy === original}`,
      `copy.contact === original.contact: ${copy.contact === original.contact}`,
      `original.contact.email: ${original.contact.email}`,
    ].join('\n')
    values.textContent = JSON.stringify({ original, copy })
    status.textContent = useStructuredClone
      ? 'structuredClone создал отдельный вложенный contact.'
      : 'Spread сохранил общую ссылку на contact.'
  }
  root.querySelector('#copy-spread').addEventListener('click', () => compare(false))
  root.querySelector('#copy-structured').addEventListener('click', () => {
    try {
      compare(true)
    } catch (error) {
      status.textContent = `Копирование не выполнено: ${error.name}: ${error.message}`
    }
  })
  root.querySelector('#copy-function').addEventListener('click', () => {
    const original = { name: 'Анна', getName() { return this.name } }
    values.textContent = 'Исходный объект содержит метод getName() — функцию.'
    try {
      const copy = structuredClone(original)
      result.textContent = JSON.stringify(copy, null, 2)
      status.textContent = 'Копирование завершено.'
    } catch (error) {
      result.textContent = `${error.name}: ${error.message}`
      status.textContent = 'Функцию нельзя скопировать алгоритмом structured clone.'
    }
  })
  root.querySelector('#copy-reset').addEventListener('click', reset)
  reset()
}
