// A small teaching machine, not a debugger of the browser running Slidev.
// Instructions both render the source and drive stack/queue transitions.
export type Scenario = 'basic' | 'nested' | 'await' | 'pending'
type Op = { text: string; kind: 'log' | 'timer' | 'micro' | 'call' | 'await' | 'promise' | 'resolve'; label: string; body?: Op[]; pending?: boolean }
type Frame = { label: string; ops: Op[]; pc: number }
type Job = { label: string; ops: Op[] }
const log = (label: string): Op => ({ kind: 'log', label, text: `log('${label}')` })
const schedule = (kind: 'timer' | 'micro', label: string, body: Op[], text: string): Op => ({ kind, label, body, text })
export function program(scenario: Scenario): Op[] {
  if (scenario === 'pending') return [
    log('A'),
    { kind: 'promise', label: 'executor', text: 'const result = new Promise(resolve => {', body: [
      schedule('timer', 'T', [log('T'), { kind: 'resolve', label: 'result', text: 'resolve(3)' }], 'setTimeout(T, 1000)'),
    ] },
    { kind: 'call', label: 'load()', text: 'load()', body: [log('B'), { kind: 'await', label: 'после await', text: 'await result', pending: true }, log('C')] },
    log('D'),
  ]
  if (scenario === 'nested') return [
    log('A'),
    schedule('micro', 'M1', [log('M1'), schedule('micro', 'M3', [log('M3')], "queueMicrotask(M3)")], 'queueMicrotask(M1)'),
    schedule('micro', 'M2', [log('M2')], 'Promise.resolve().then(M2)'),
    schedule('timer', 'T', [log('T'), schedule('micro', 'MT', [log('MT')], 'queueMicrotask(MT)')], 'setTimeout(T, 0)'),
    log('B'),
  ]
  if (scenario === 'await') return [
    log('A'),
    { kind: 'call', label: 'load()', text: 'load()', body: [log('B'), { kind: 'await', label: 'после await', text: 'await Promise.resolve()' }, log('C')] },
    schedule('micro', 'M', [log('M')], 'queueMicrotask(M)'),
    schedule('timer', 'T', [log('T')], 'setTimeout(T, 0)'),
    log('D'),
  ]
  return [log('A'), schedule('timer', 'T', [log('T')], 'setTimeout(T, 0)'), schedule('micro', 'P', [log('P')], 'Promise.resolve().then(P)'), log('B')]
}
export function createMachine(scenario: Scenario) {
  return {
    stack: [] as Frame[], tasks: [{ label: 'обработчик клика', ops: program(scenario) }] as Job[],
    micros: [] as Job[], timers: [] as Job[], output: [] as string[],
    promise: null as null | 'pending' | 'fulfilled', awaiting: [] as Job[],
    active: null as Op | null, route: 'task', phase: 'Готова исходная задача',
    explanation: 'Нажмите «Следующий шаг»: цикл выберет исходную задачу.', steps: 0, checkpoint: false,
  }
}
export type Machine = ReturnType<typeof createMachine>
export function timerReady(m: Machine) {
  const timer = m.timers.shift()
  if (!timer) return
  m.tasks.push(timer)
  m.steps++
  m.route = 'ready'
  m.phase = 'Таймер стал готов'
  m.explanation = `${timer.label} переходит из браузерного ожидания в очередь задач. Текущий стек и микрозадачи он не прерывает.`
}
export function step(m: Machine) {
  m.steps++
  const frame = m.stack.at(-1)
  if (frame) {
    const op = frame.ops[frame.pc++]
    if (!op) {
      m.stack.pop()
      m.active = null
      m.route = 'stack'
      m.phase = `Возврат из ${frame.label}`
      m.explanation = m.stack.length ? 'Продолжается вызывающая функция.' : 'Стек пуст. Перед следующей задачей нужна контрольная точка микрозадач.'
      if (!m.stack.length) m.checkpoint = true
      return
    }
    m.active = op
    m.route = 'stack'
    if (op.kind === 'log') {
      m.output.push(op.label)
      m.phase = `Вывод ${op.label}`
      m.explanation = 'Синхронная строка выполняется в верхнем кадре стека.'
    } else if (op.kind === 'timer') {
      m.timers.push({ label: op.label, ops: op.body! })
      m.route = 'timer'
      m.phase = `Регистрация таймера ${op.label}`
      m.explanation = 'Браузер начинает ожидание; callback не вызывается. Готовность можно показать отдельной кнопкой даже при занятом стеке.'
    } else if (op.kind === 'micro') {
      m.micros.push({ label: op.label, ops: op.body! })
      m.route = 'micro'
      m.phase = `Поставлена микрозадача ${op.label}`
      m.explanation = 'Добавляем в хвост очереди. Текущий синхронный вызов продолжает работу.'
    } else if (op.kind === 'call') {
      m.stack.push({ label: op.label, ops: op.body!, pc: 0 })
      m.phase = `Синхронный вызов ${op.label}`
      m.explanation = 'Новый кадр помещён поверх вызывающего. Нижний кадр ждёт возврата управления.'
    } else if (op.kind === 'promise') {
      m.promise = 'pending'
      m.stack.push({ label: 'executor Promise', ops: op.body!, pc: 0 })
      m.phase = 'Создание Promise'
      m.explanation = 'Executor вызывается синхронно. Пока результат pending; следующим шагом он зарегистрирует таймер.'
    } else if (op.kind === 'resolve') {
      m.promise = 'fulfilled'
      m.micros.push(...m.awaiting)
      m.awaiting = []
      m.route = 'micro'
      m.phase = 'Promise получил значение 3'
      m.explanation = 'Теперь ожидающее продолжение ставится в очередь микрозадач. Callback таймера ещё должен завершиться.'
    } else {
      const rest = frame.ops.slice(frame.pc)
      m.stack.pop()
      const continuation = { label: op.label, ops: rest }
      m.phase = 'Приостановка на await'
      if (op.pending && m.promise === 'pending') {
        m.awaiting.push(continuation)
        m.route = 'waiting'
        m.explanation = 'Promise ещё pending. Сохраняем продолжение, но в очереди микрозадач его пока нет. Вызывающий код продолжает работу.'
      } else {
        m.micros.push(continuation)
        m.route = 'micro'
        m.explanation = 'Здесь ожидается уже успешный встроенный Promise. Продолжение готово к постановке в микрозадачи; вызывающий код продолжает выполняться.'
      }
    }
    return
  }
  m.active = null
  if (m.micros.length) {
    const job = m.micros.shift()!
    m.stack.push({ label: job.label, ops: job.ops, pc: 0 })
    m.route = 'drain'
    m.phase = `Checkpoint: выбираем ${job.label}`
    m.explanation = 'Берём голову очереди микрозадач. Обычные задачи пока не выбираются; новые микрозадачи добавятся в хвост.'
  } else if (m.checkpoint) {
    m.checkpoint = false
    m.route = 'stack'
    const finished = !m.tasks.length && !m.timers.length
    m.phase = finished ? 'Сценарий завершён' : 'Checkpoint завершён'
    m.explanation = finished
      ? 'Стек и очереди пусты. В настоящем браузере цикл продолжит ждать новые события. Кадр не гарантирован после каждого checkpoint.'
      : 'Очередь микрозадач пуста. Теперь можно выбирать следующую задачу. Кадр не гарантирован: рендеринг планирует браузер.'
  } else if (m.tasks.length) {
    const job = m.tasks.shift()!
    m.stack.push({ label: job.label, ops: job.ops, pc: 0 })
    m.route = 'task'
    m.phase = `Выбрана задача ${job.label}`
    m.explanation = 'Задача начинает выполнение. Другой callback не вытеснит её текущий синхронный код.'
  } else if (m.timers.length) {
    m.steps--
    timerReady(m)
  } else {
    m.phase = 'Сценарий завершён'
    m.explanation = 'В этой учебной программе больше нет работы. Настоящий event loop продолжает ждать ввод, сеть и другие события.'
  }
}
export function sourceLines(ops: Op[]) {
  const lines: { text: string; op: Op | null; indent: number }[] = []
  function visit(list: Op[], indent: number) {
    for (const op of list) {
      if (op.kind === 'promise') {
        lines.push({ text: op.text, op, indent })
        visit(op.body!, indent + 1)
        lines.push({ text: '})', op: null, indent })
        continue
      }
      if (op.body) {
        const header = op.kind === 'call' ? 'async function load() {' : `function ${op.label}() {`
        lines.push({ text: header, op: null, indent })
        visit(op.body, indent + 1)
        lines.push({ text: '}', op: null, indent })
      }
      lines.push({ text: op.text, op, indent })
    }
  }
  visit(ops, 0)
  return lines
}
