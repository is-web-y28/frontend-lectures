<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Ref } from 'vue'

// Diagnostics stay outside reactive application data and the pure derivation.
let activeReads: string[] | null = null
let lastReads: string[] = []
let getterRuns = 0
function traceReads<T>(name: string, source: Ref<T>): Ref<T> {
  return new Proxy(source, {
    get(target, key) {
      if (key === 'value' && activeReads) activeReads.push(`${name}.value`)
      return Reflect.get(target, key, target)
    },
    set: (target, key, value) => Reflect.set(target, key, value, target),
  })
}
const format = traceReads('format', ref<'onsite' | 'online'>('onsite'))
const onsite = traceReads('onsite', ref(2))
const online = traceReads('online', ref(5))
const derive = () => format.value === 'onsite' ? onsite.value : online.value
function createMeasuredSeats() {
  return computed(() => {
    const reads: string[] = []
    activeReads = reads
    getterRuns++
    try { return derive() }
    finally {
      lastReads = reads
      activeReads = null
    }
  })
}
let seats = createMeasuredSeats()
const observation = ref({ result: 0, runs: 0, reads: [] as string[] })
const source = `const format = ref('onsite')\nconst onsite = ref(2)\nconst online = ref(5)\n\nconst seats = computed(() =>\n  format.value === 'onsite'\n    ? onsite.value\n    : online.value\n)`

function observe() {
  const result = seats.value
  observation.value = { result, runs: getterRuns, reads: [...new Set(lastReads)] }
}
function increase(field: 'onsite' | 'online') {
  if (field === 'onsite') onsite.value++
  else online.value++
  observe()
}
function changeFormat(event: Event) {
  const select = event.target
  if (!(select instanceof HTMLSelectElement)) return
  if (select.value !== 'onsite' && select.value !== 'online') return
  format.value = select.value
  observe()
}
function reset() {
  format.value = 'onsite'
  onsite.value = 2
  online.value = 5
  getterRuns = 0
  lastReads = []
  seats = createMeasuredSeats()
  observe()
}
observe()
</script>

<template>
  <section class="dependency-demo" aria-label="Динамические зависимости computed">
    <header><span>Зависимости определяются чтениями при выполнении</span><button type="button" @click="reset">Начать заново</button></header>
    <div class="dependency-stage">
      <pre><code>{{ source }}</code></pre>
      <div class="observations">
        <label>Показываемый формат
          <select :value="format" @change="changeFormat"><option value="onsite">Зал</option><option value="online">Онлайн</option></select>
        </label>
        <div class="values">
          <p><code>onsite</code>: <strong data-testid="onsite">{{ onsite }}</strong></p>
          <p><code>online</code>: <strong data-testid="online">{{ online }}</strong></p>
        </div>
        <button type="button" @click="increase('onsite')">Место в зале +1</button>
        <button type="button" @click="increase('online')">Место онлайн +1</button>
        <button type="button" @click="observe">Прочитать ещё раз</button>
        <dl>
          <dt><code>seats.value</code></dt><dd data-testid="selected-seats">{{ observation.result }}</dd>
          <dt>Запусков геттера</dt><dd data-testid="getter-runs">{{ observation.runs }}</dd>
          <dt>Чтения последнего запуска</dt><dd data-testid="reads"><code>{{ observation.reads.join(' → ') }}</code></dd>
        </dl>
        <p class="hint">После каждого действия читаем <code>seats.value</code>. Счётчик и список чтений измеряются диагностической обёрткой.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dependency-demo { display: flex; flex: 1; flex-direction: column; min-height: 0; gap: .7rem; font-size: .75rem; color: var(--fg); }
header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; color: var(--fg-dim); }
.dependency-stage { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); flex: 1; min-height: 0; gap: 1rem; }
pre, .observations { margin: 0; padding: .8rem; overflow: auto; background: var(--surface-bg); border: var(--surface-border); border-radius: .5rem; }
pre { display: flex; align-items: center; white-space: pre-wrap; font-size: .65rem; line-height: 1.6; }
button, select { color: var(--fg); background: var(--surface-bg); border: var(--surface-border); border-radius: .3rem; padding: .3rem .45rem; font: inherit; }
button { cursor: pointer; margin: .2rem .4rem .2rem 0; }
select { margin-left: .4rem; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
.values { display: flex; flex-wrap: wrap; gap: 1rem; }
.values p { margin: .5rem 0; }
dl { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: .55rem; margin: .7rem 0; }
dd { margin: 0; font-weight: 700; overflow-wrap: anywhere; }
.hint { font-size: .65rem; color: var(--fg-dim); line-height: 1.5; margin: .6rem 0 0; }
@media (max-width: 600px) { .dependency-stage { grid-template-columns: 1fr; overflow: auto; } pre { overflow: visible; } }
</style>
