<script setup lang="ts">
import { computed, nextTick, onUnmounted, reactive, ref, watch } from 'vue'
import { createMachine, sourceLines, step, timerReady } from './event-loop-model'
import { onSlideLeave } from '@slidev/client'
import type { Scenario } from './event-loop-model'

const props = withDefaults(defineProps<{ initial?: Scenario; allowAwait?: boolean }>(), { initial: 'basic', allowAwait: false })
const selected = ref<Scenario>(props.initial)
const machine = ref(reactive(createMachine(selected.value)))
const sourceBox = ref<HTMLElement | null>(null)
const root = ref(machine.value.tasks[0].ops)
const lines = computed(() => sourceLines(root.value))
const history = ref<{ action: 'step' | 'ready'; angle: number }[]>([])
const playing = ref(false)
const pace = ref(1000)
let playback: ReturnType<typeof setTimeout> | undefined
function pause() {
  playing.value = false
  clearTimeout(playback)
}
function tick() {
  if (!playing.value) return
  advance()
  if (done.value) pause()
  else playback = setTimeout(tick, pace.value)
}
function play() {
  if (playing.value) { pause(); return }
  if (done.value) reset()
  playing.value = true
  playback = setTimeout(tick, pace.value)
}
onSlideLeave(pause)
onUnmounted(pause)
const done = computed(() => !machine.value.stack.length && !machine.value.tasks.length && !machine.value.micros.length && !machine.value.timers.length && !machine.value.checkpoint)
function reset() {
  pause()
  machine.value = reactive(createMachine(selected.value))
  root.value = machine.value.tasks[0].ops
  history.value = []
  angle.value = 0
}
function next() {
  pause()
  advance()
}
function advance() {
  step(machine.value)
  record('step')
}
function ready() {
  pause()
  timerReady(machine.value)
  record('ready')
}
function back() {
  const actions = history.value.slice(0, -1)
  reset()
  for (const { action } of actions) {
    if (action === 'step') step(machine.value)
    else timerReady(machine.value)
  }
  history.value = actions
  angle.value = actions.at(-1)?.angle ?? 0
}
watch(() => machine.value.steps, async () => {
  await nextTick()
  const box = sourceBox.value
  const active = box?.querySelector<HTMLElement>('[aria-current="step"]')
  if (!box) return
  if (!machine.value.steps) box.scrollTop = 0
  else if (active && (active.offsetTop < box.scrollTop || active.offsetTop + active.offsetHeight > box.scrollTop + box.clientHeight)) {
    box.scrollTop = Math.max(0, active.offsetTop - box.clientHeight / 2)
  }
})
// The cursor follows execution, not an independent decorative animation.
const cycleStage = computed(() => {
  const m = machine.value
  if (m.checkpoint) return 'micro'
  if (m.stack.length) return 'run'
  if (m.tasks.length) return 'pick'
  return 'idle'
})
const angle = ref(0)
function record(action: 'step' | 'ready') {
  const stage = cycleStage.value
  if (stage !== 'idle') {
    const target = { pick: 0, run: 120, micro: 240 }[stage]
    angle.value += (target - angle.value % 360 + 360) % 360
  }
  // Restore the unwrapped angle on Back instead of taking another forward lap.
  history.value.push({ action, angle: angle.value })
}
const cycleCaption = computed(() => ({
  pick: 'Есть готовая задача',
  run: 'Стек занят: другая задача ждёт',
  micro: 'Микрозадачи — до пустой очереди',
  idle: done.value ? 'Ожидание нового события' : 'Ожидание готовности таймера',
}[cycleStage.value]))

</script>

<template>
  <section class="event-visualizer" aria-label="Пошаговая учебная модель event loop">
    <header class="controls">
      <label>Пример
        <select v-model="selected" @change="reset">
          <option value="basic">Таймер и Promise</option>
          <option value="nested">Вложенные микрозадачи</option>
          <option v-if="allowAwait" value="await">Продолжение await</option>
          <option v-if="allowAwait" value="pending">Ожидание pending Promise</option>
        </select>
      </label>
      <button type="button" :aria-pressed="playing" @click="play">{{ playing ? 'Ⅱ Пауза' : done ? '↻ Повторить' : '▶ Запустить' }}</button>
      <label>Темп <select v-model="pace"><option :value="600">Быстро</option><option :value="1000">Обычно</option><option :value="1600">Медленно</option></select></label>
      <button type="button" :disabled="!history.length" @click="reset">Сбросить</button>
      <button type="button" :disabled="!machine.timers.length" @click="ready">Таймер готов</button>
      <button type="button" :disabled="!history.length" @click="back">← Назад</button>
      <button type="button" :disabled="done" @click="next">Следующий шаг →</button>
      <span class="step-number">Шаг {{ machine.steps }}</span>
    </header>
    <div class="visualizer-body">
      <div ref="sourceBox" class="source" aria-label="Исходный код">
        <div class="panel-title">Код <span>выделена выполняемая строка</span></div>
        <ol>
          <li v-for="(line, index) in lines" :key="index" :class="{ active: line.op && line.op === machine.active }" :aria-current="line.op && line.op === machine.active ? 'step' : undefined">
            <code :style="{ paddingLeft: `${line.indent * 0.8}rem` }">{{ line.text }}</code>
          </li>
        </ol>
      </div>
      <div class="machine">
        <p v-if="machine.promise" class="promise-state" aria-live="polite">
          Promise result: <strong>{{ machine.promise }}</strong>
          <span v-if="machine.awaiting.length"> · продолжение сохранено, в микрозадачах его ещё нет</span>
        </p>
        <div class="arena">
          <div class="cycle-view" :data-stage="cycleStage" aria-label="Цикл выбора и выполнения задач">
            <div class="cycle-ring"></div>
            <span v-for="direction in [60, 180, 300]" :key="direction" class="cycle-direction" :style="{ '--direction': `${direction}deg`, left: `${50 + 32 * Math.sin(direction * Math.PI / 180)}%`, top: `${50 - 32 * Math.cos(direction * Math.PI / 180)}%` }" aria-hidden="true">›</span>
            <div class="cycle-orbit" :class="{ resting: cycleStage === 'idle' }" :style="{ transform: `rotate(${angle}deg)` }" aria-hidden="true"><span></span></div>
            <div class="cycle-node node-pick" :class="{ selected: cycleStage === 'pick' }"><b>1</b><span>Выбрать задачу</span></div>
            <div class="cycle-node node-run" :class="{ selected: cycleStage === 'run' }"><b>2</b><span>Выполнить код</span></div>
            <div class="cycle-node node-micro" :class="{ selected: cycleStage === 'micro' }"><b>3</b><span>Checkpoint</span></div>
            <div class="cycle-center"><strong>Event loop</strong><span>{{ cycleCaption }}</span></div>
          </div>
        <div class="lanes">
          <section class="lane stack" :class="{ highlighted: ['stack', 'task', 'drain'].includes(machine.route) }" aria-label="Стек вызовов">
            <h3>Стек вызовов <small>вершина сверху ↓</small></h3>
            <ol v-if="machine.stack.length">
              <li v-for="(frame, index) in [...machine.stack].reverse()" :key="index">{{ frame.label }} <span v-if="index === 0">выполняется</span></li>
            </ol>
            <p v-else class="empty">Стек пуст</p>
          </section>
          <section class="lane browser" :class="{ highlighted: machine.route === 'timer' }" aria-label="Браузерные операции">
            <h3>Браузер <small>ожидание вне стека</small></h3>
            <ol v-if="machine.timers.length"><li v-for="job in machine.timers" :key="job.label">Таймер {{ job.label }} <span>ещё не задача</span></li></ol>
            <p v-else class="empty">Нет ожидающих таймеров</p>
          </section>
          <div class="handoffs" aria-label="Передача работы между блоками">
            <span :class="{ current: machine.route === 'task' }">↑ задача в стек</span>
            <span :class="{ current: machine.route === 'ready' }">↙ готовый таймер</span>
            <span :class="{ current: machine.route === 'drain' }">↖ микрозадача в стек</span>
          </div>
          <section class="lane tasks" :class="{ highlighted: machine.route === 'ready' }" aria-label="Готовые задачи">
            <h3>Готовые задачи <small>голова слева →</small></h3>
            <ol v-if="machine.tasks.length" class="queue"><li v-for="job in machine.tasks" :key="job.label">{{ job.label }}</li></ol>
            <p v-else class="empty">Очередь пуста</p>
          </section>
          <section class="lane micros" :class="{ highlighted: ['micro', 'drain'].includes(machine.route) }" aria-label="Очередь микрозадач">
            <h3>Микрозадачи <small>голова слева →</small></h3>
            <ol v-if="machine.micros.length" class="queue"><li v-for="job in machine.micros" :key="job.label">{{ job.label }}</li></ol>
            <p v-else class="empty">Очередь пуста</p>
          </section>
        </div>
        </div>
        <p class="explanation" role="status"><strong>{{ machine.phase }}</strong> {{ machine.explanation }}</p>
        <div class="output" aria-label="Вывод программы"><strong>Вывод</strong><span v-for="(entry, index) in machine.output" :key="index">{{ entry }}</span><span v-if="!machine.output.length" class="empty">пока пусто</span></div>
      </div>
    </div>
    <p class="model-note">Учебная модель, не отладчик браузера. Время таймера условное; показана только работа выбранного примера. Между разными источниками задач общего FIFO нет.</p>
  </section>
</template>

<style scoped>
.event-visualizer { display: flex; flex: 1; flex-direction: column; min-height: 0; gap: .45rem; color: var(--fg); font-size: .62rem; }
.controls { display: flex; flex-wrap: wrap; align-items: center; gap: .4rem; }
.controls label { display: flex; align-items: center; gap: .3rem; }
button, select { border: 1px solid var(--surface-border); border-radius: .35rem; padding: .32rem .45rem; background: var(--surface-bg); color: var(--fg); font: inherit; }
button { cursor: pointer; } button:disabled { opacity: .45; cursor: default; }
button:last-of-type { background: var(--accent); color: #fff; border-color: var(--accent); }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.step-number { margin-left: auto; font-variant-numeric: tabular-nums; }
.visualizer-body { display: grid; grid-template-columns: minmax(0, .75fr) minmax(0, 1.8fr); flex: 1; min-height: 0; gap: .55rem; }
.source { position: relative; background: var(--surface-bg); border: 1px solid var(--surface-border); border-radius: .5rem; min-width: 0; overflow: auto; }
.panel-title { padding: .45rem; border-bottom: 1px solid var(--surface-border); font-weight: 700; }
.panel-title span { display: block; color: var(--fg-dim); font-size: .5rem; font-weight: 400; }
.source ol { padding: .35rem .2rem .35rem 1.5rem; margin: 0; }
.source li { padding: .12rem .1rem; color: var(--fg-dim); border-radius: .2rem; }
.source li.active { background: color-mix(in srgb, var(--accent) 18%, transparent); color: var(--fg); box-shadow: inset 3px 0 var(--accent); }
.source code { display: block; white-space: pre; font-size: .6rem; color: inherit; background: transparent; }
.machine { display: flex; flex-direction: column; min-width: 0; min-height: 0; overflow: auto; gap: .4rem; }
.routes { display: flex; flex-wrap: wrap; gap: .2rem; font-size: .48rem; }
.routes span { padding: .2rem .3rem; border: 1px solid var(--surface-border); border-radius: 1rem; color: var(--fg-dim); }
.routes .current { background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--fg); border-color: var(--accent); }
.promise-state { margin: 0; font-size: .52rem; }
.promise-state strong { color: var(--accent); }
.lanes { display: grid; grid-template-columns: 1fr 1fr; gap: .4rem; }
.lane { border: 1px solid var(--surface-border); border-top: 3px solid var(--fg-dim); border-radius: .45rem; padding: .4rem; min-width: 0; min-height: 4.5rem; background: var(--surface-bg); }
.lane.highlighted { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
.handoffs { grid-column: 1 / -1; display: flex; justify-content: space-between; gap: .25rem; font-size: .52rem; color: var(--fg-dim); }
.handoffs span { padding: .15rem .25rem; border-radius: .2rem; }
.handoffs .current { background: color-mix(in srgb, var(--accent) 16%, transparent); color: var(--fg); font-weight: 700; }
h3 { font: inherit; font-weight: 750; margin: 0 0 .35rem; }
h3 small { display: block; color: var(--fg-dim); font-size: .48rem; font-weight: 400; }
.lane ol { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: .2rem; }
.lane li { border: 1px solid var(--surface-border); padding: .2rem .3rem; border-radius: .2rem; font-family: monospace; }
.lane li span { display: block; font-family: var(--font-body); font-size: .45rem; color: var(--fg-dim); }
.lane .queue { flex-direction: row; flex-wrap: wrap; }
.empty { color: var(--fg-dim); margin: .2rem 0; font-size: .52rem; }
.explanation { min-height: 3rem; margin: 0; font-size: .57rem; line-height: 1.45; }
.explanation strong { display: block; margin-bottom: .15rem; color: var(--accent); }
.output { display: flex; flex-wrap: wrap; align-items: center; gap: .3rem; padding: .4rem; border: 1px solid var(--surface-border); border-radius: .4rem; }
.output span:not(.empty) { min-width: 1.1rem; text-align: center; background: color-mix(in srgb, var(--accent) 12%, transparent); border-radius: .2rem; padding: .1rem; }
.model-note { margin: 0; color: var(--fg-dim); font-size: .46rem; line-height: 1.4; }
@media (max-width: 650px) { .visualizer-body { grid-template-columns: 1fr; overflow: auto; } .source { max-height: 13rem; flex-shrink: 0; } }
</style>

<style scoped>
.arena { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); gap: .6rem; flex: 0 0 auto; min-height: 0; align-items: center; }
.cycle-view { position: relative; aspect-ratio: 1; width: 100%; max-width: 12rem; margin-inline: auto; min-width: 0; }
.cycle-ring { position: absolute; inset: 18%; border: .24rem solid color-mix(in srgb, var(--accent) 35%, var(--surface-bg)); border-radius: 50%; }
.cycle-orbit { position: absolute; inset: 18%; transition: transform .55s ease-in-out; }
.cycle-orbit span { position: absolute; width: .65rem; height: .65rem; background: var(--accent); border: 2px solid var(--surface-bg); border-radius: 50%; left: 50%; top: 0; transform: translate(-50%, -50%); box-shadow: 0 0 0 .2rem color-mix(in srgb, var(--accent) 20%, transparent); }
.cycle-orbit.resting { opacity: .25; }
.cycle-direction { position: absolute; left: 50%; top: 50%; font: 700 1.4rem monospace; line-height: 1; color: var(--fg-dim); transform: translate(-50%, -50%) rotate(var(--direction)); }
.cycle-node { position: absolute; transform: translate(-50%, -50%); display: flex; align-items: center; flex-direction: column; gap: .25rem; width: 5.5rem; text-align: center; font-size: .54rem; }
.cycle-node b { display: grid; place-items: center; width: 1.3rem; height: 1.3rem; border-radius: 50%; color: var(--fg-dim); background: var(--surface-bg); border: 1px solid var(--surface-border); }
.cycle-node.selected b { background: var(--accent); color: white; border-color: var(--accent); }
.cycle-node.selected span { color: var(--accent); font-weight: 750; }
.node-pick { left: 50%; top: 23%; }
.node-run { left: 78%; top: 71%; }
.node-micro { left: 22%; top: 71%; }
.cycle-center { position: absolute; inset: 35% 23%; display: flex; flex-direction: column; justify-content: center; text-align: center; gap: .3rem; }
.cycle-center strong { font-size: .8rem; }
.cycle-center span { font-size: .5rem; line-height: 1.3; color: var(--fg-dim); }
.cycle-note { position: absolute; top: 94%; width: 100%; margin: 0; text-align: center; font-size: .45rem; line-height: 1.4; color: var(--fg-dim); }
.lanes { gap: .3rem; }
.lane { padding: .35rem; min-height: 4.1rem; }
.handoffs { display: none; }
@media (prefers-reduced-motion: reduce) { .cycle-orbit { transition: none; } }
@media (max-width: 650px) { .arena { grid-template-columns: 1fr; } .cycle-view { max-width: 15rem; margin: auto auto 1.4rem; } .machine { overflow: visible; } }
</style>
