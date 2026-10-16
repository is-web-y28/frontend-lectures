import { RegistrationStore } from './state.js'

function createCounter() {
  let count = 0
  return {
    increment: () => ++count,
    getCount: () => count,
  }
}

export function mountClosureDemo(root) {
  root.classList.add('demo-page', 'mechanisms-page')
  root.innerHTML = `
    <header class="page-header">
      <h1>Одна фабрика — два независимых окружения</h1>
      <p class="hint">Предскажите значения после двух нажатий в A и одного в B.</p>
    </header>
    <div class="split">
    <section class="panel" aria-labelledby="closures-title">
      <h2 id="closures-title">Два независимых счётчика</h2>
      <div class="button-row">
        <button id="increment-a" type="button">Добавить в A</button>
        <button id="increment-b" type="button">Добавить в B</button>
        <button id="closure-reset" class="secondary" type="button">Сбросить счётчики</button>
      </div>
      <pre id="closure-state" class="readout" aria-live="polite"><code></code></pre>
      <p class="hint">У каждого вызова <code>createCounter()</code> — своя переменная <code>count</code>.</p>
    </section>
    <section class="panel" aria-label="Код фабрики">
      <pre class="readout"><code>function createCounter() {
  let count = 0
  return {
    increment: () => ++count,
    getCount: () => count,
  }
}
const a = createCounter()
const b = createCounter()</code></pre>
    </section>
    </div>
  `

  let a = createCounter()
  let b = createCounter()
  const output = root.querySelector('#closure-state code')
  function show() {
    output.textContent = `A = ${a.getCount()}\nB = ${b.getCount()}`
  }
  root.querySelector('#increment-a').addEventListener('click', () => {
    a.increment()
    show()
  })
  root.querySelector('#increment-b').addEventListener('click', () => {
    b.increment()
    show()
  })
  root.querySelector('#closure-reset').addEventListener('click', () => {
    a = createCounter()
    b = createCounter()
    show()
  })
  show()
}

export function mountReceiverDemo(root) {
  root.classList.add('demo-page', 'mechanisms-page', 'receiver-page')
  root.innerHTML = `
    <header class="page-header">
      <h1>Метод один — почему результаты разные?</h1>
      <p class="hint">Предскажите равенство функций и имена в результатах двух вызовов.</p>
    </header>
    <div class="split">
      <section class="panel" aria-labelledby="receiver-results-title">
        <h2 id="receiver-results-title">Сначала прогноз, затем проверка</h2>
        <div class="button-row">
          <button id="compare-receivers" type="button">Сравнить функции</button>
          <button id="call-first" type="button"><code>first.getAll()</code></button>
          <button id="call-second" type="button"><code>second.getAll()</code></button>
        </div>
        <pre id="receiver-output" class="readout" aria-live="polite"><code></code></pre>
        <p id="receiver-explanation" class="hint" hidden>В <code>first.getAll()</code> получатель <code>this</code> — <code>first</code>, в <code>second.getAll()</code> — <code>second</code>. Метод читает его <code>registrations</code>.</p>
      </section>
      <section class="panel" aria-labelledby="receiver-code-title">
        <h2 id="receiver-code-title">Общий метод и два экземпляра</h2>
        <pre class="readout"><code>getAll() {
  return this.registrations.map(copyRecord);
}

const first = new RegistrationStore([
  { name: 'Анна' }]);
const second = new RegistrationStore([
  { name: 'Борис' }]);</code></pre>
      </section>
    </div>
  `

  const first = new RegistrationStore([{ name: 'Анна' }])
  const second = new RegistrationStore([{ name: 'Борис' }])
  const results = { same: null, first: null, second: null }
  const output = root.querySelector('#receiver-output code')
  const explanation = root.querySelector('#receiver-explanation')

  function show() {
    output.textContent = [
      `first.getAll === second.getAll // ${results.same ?? '?'}`,
      `first.getAll()[0].name // ${results.first === null ? '?' : JSON.stringify(results.first)}`,
      `second.getAll()[0].name // ${results.second === null ? '?' : JSON.stringify(results.second)}`,
    ].join('\n')
    explanation.hidden = Object.values(results).some((value) => value === null)
  }
  root.querySelector('#compare-receivers').addEventListener('click', () => {
    results.same = first.getAll === second.getAll
    show()
  })
  root.querySelector('#call-first').addEventListener('click', () => {
    results.first = first.getAll()[0].name
    show()
  })
  root.querySelector('#call-second').addEventListener('click', () => {
    results.second = second.getAll()[0].name
    show()
  })
  show()
}

export function mountObjectDemo(root) {
  root.classList.add('demo-page', 'mechanisms-page')
  root.innerHTML = `
    <header class="page-header">
      <h1>Данные экземпляра, метод прототипа и способ вызова</h1>
      <p class="hint">Сначала сравните два экземпляра. Затем передайте метод отдельно и сохраните данные в JSON.</p>
    </header>
    <div class="split">
    <section class="panel" aria-labelledby="objects-title">
      <h2 id="objects-title">Один метод, разные получатели</h2>
      <div class="button-row">
        <button id="object-reset" class="secondary" type="button">Новые экземпляры</button>
        <button id="prototype-check" type="button">Сравнить методы</button>
        <button id="call-method" type="button"><code>store.getAll()</code></button>
        <button id="call-detached" type="button">Отдельная функция</button>
        <button id="call-wrapper" type="button">Обёртка</button>
        <button id="call-bound" type="button"><code>bind(store)</code></button>
        <button id="class-json" type="button">JSON туда и обратно</button>
        <button id="copy-nested" type="button">Поверхностная копия</button>
      </div>
      <pre id="object-output" class="readout" aria-live="polite"><code></code></pre>
    </section>
    <section class="panel" aria-labelledby="object-data-title">
      <h2 id="object-data-title">Снимки данных двух экземпляров</h2>
      <pre id="object-state" class="readout"><code></code></pre>
    </section>
    </div>
  `

  let first
  let second
  const output = root.querySelector('#object-output code')
  const state = root.querySelector('#object-state code')

  function showState() {
    state.textContent = JSON.stringify({ first: first.getAll(), second: second.getAll() }, null, 2)
  }
  function observe(expression, operation) {
    try {
      const value = operation()
      output.textContent = `${expression}\n\n${JSON.stringify(value, null, 2)}`
    } catch (error) {
      output.textContent = `${expression}\n\n${error.name}: ${error.message}`
    }
    showState()
  }
  function reset() {
    first = new RegistrationStore([{ id: 'a', name: 'Анна', email: 'anna@example.org', count: 2 }])
    second = new RegistrationStore([{ id: 'b', name: 'Борис', email: 'boris@example.org', count: 1 }])
    output.textContent = 'Предскажите: совпадают ли first.getAll и second.getAll? Где хранится метод?'
    showState()
  }
  root.querySelector('#object-reset').addEventListener('click', reset)
  root.querySelector('#prototype-check').addEventListener('click', () => {
    observe('Свойства и цепочка прототипов', () => ({
      'first.getAll === second.getAll': first.getAll === second.getAll,
      'Object.hasOwn(first, "registrations")': Object.hasOwn(first, 'registrations'),
      'Object.hasOwn(first, "getAll")': Object.hasOwn(first, 'getAll'),
      'Object.getPrototypeOf(first) === RegistrationStore.prototype': Object.getPrototypeOf(first) === RegistrationStore.prototype,
      'Object.hasOwn(RegistrationStore.prototype, "getAll")': Object.hasOwn(RegistrationStore.prototype, 'getAll'),
      'Object.getPrototypeOf(RegistrationStore.prototype) === Object.prototype': Object.getPrototypeOf(RegistrationStore.prototype) === Object.prototype,
      'Object.getPrototypeOf(Object.prototype)': Object.getPrototypeOf(Object.prototype),
    }))
  })
  root.querySelector('#call-method').addEventListener('click', () => {
    observe('store.getAll()', () => first.getAll())
  })
  root.querySelector('#call-detached').addEventListener('click', () => {
    observe('const getAll = store.getAll; getAll()', () => {
      const getAll = first.getAll
      return getAll()
    })
  })
  root.querySelector('#call-wrapper').addEventListener('click', () => {
    observe('const callback = () => store.getAll(); callback()', () => {
      const callback = () => first.getAll()
      return callback()
    })
  })
  root.querySelector('#call-bound').addEventListener('click', () => {
    observe('const callback = store.getAll.bind(store); callback()', () => {
      const callback = first.getAll.bind(first)
      return callback()
    })
  })
  root.querySelector('#class-json').addEventListener('click', () => {
    observe('const restored = JSON.parse(JSON.stringify(store))', () => {
      const restored = JSON.parse(JSON.stringify(first))
      return {
        'store instanceof RegistrationStore': first instanceof RegistrationStore,
        'restored instanceof RegistrationStore': restored instanceof RegistrationStore,
        'typeof restored.getAll': typeof restored.getAll,
        'Object.getPrototypeOf(restored) === Object.prototype': Object.getPrototypeOf(restored) === Object.prototype,
        restored,
      }
    })
  })
  root.querySelector('#copy-nested').addEventListener('click', () => {
    observe('Отдельный пример: копия массива, записи и общий contact', () => {
      const records = [{ name: 'Анна', contact: { email: 'anna@example.com' } }]
      const arrayCopy = [...records]
      arrayCopy[0].name = 'Аня'
      const recordCopy = { ...records[0] }
      recordCopy.name = 'Аннушка'
      const mappedCopy = records.map((record) => ({ ...record }))
      recordCopy.contact.email = 'shared@example.com'
      return {
        'arrayCopy === records': arrayCopy === records,
        'arrayCopy[0] === records[0]': arrayCopy[0] === records[0],
        'recordCopy === records[0]': recordCopy === records[0],
        'recordCopy.contact === records[0].contact': recordCopy.contact === records[0].contact,
        'mappedCopy[0] === records[0]': mappedCopy[0] === records[0],
        'mappedCopy[0].contact === records[0].contact': mappedCopy[0].contact === records[0].contact,
        records,
        arrayCopy,
        recordCopy,
        mappedCopy,
        scope: 'Пример копирования не изменяет заявки двух хранилищ выше.',
      }
    })
  })
  reset()
}
