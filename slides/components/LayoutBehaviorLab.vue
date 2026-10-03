<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
})

const status = ref('Пока без действия')
const overflowMode = ref('auto')
const overflowStage = ref(null)

const overflowStyle = computed(() => ({
  overflow: overflowMode.value,
}))

function report(message) {
  status.value = message
}

function scrollOverflowStage() {
  const stage = overflowStage.value
  if (!stage) return
  const nextOffset = stage.scrollTop > 0 ? 0 : 88
  stage.scrollTo({ top: nextOffset, behavior: 'auto' })
  const actualOffset = Math.round(stage.scrollTop)
  report(actualOffset === 0 && nextOffset > 0
    ? 'Эта область не получила локальной прокрутки.'
    : `scrollTop: ${actualOffset}px`)
}
</script>

<template>
  <section v-if="props.mode === 'visibility'" class="layout-behavior-lab" aria-label="Проверка способов скрыть элемент">
    <div class="lab-heading">
      <strong>Проверьте клавиатурой</strong>
      <span>Нажимайте Tab: прозрачная кнопка проявляет фокус и принимает Enter.</span>
    </div>

    <div class="visibility-row" aria-label="Сравнение геометрии элементов">
      <span class="slot">До</span>
      <button class="state-control display-none" type="button" @click="report('display: none: этот обработчик недостижим, потому что кнопки в дереве рендеринга нет.')">display: none</button>
      <button class="state-control visibility-hidden" type="button" @click="report('visibility: hidden: этот обработчик недостижим.')">visibility: hidden</button>
      <button class="state-control transparent-control" type="button" @click="report('opacity: 0: кнопка получила активацию, хотя была прозрачной.')">Прозрачная кнопка</button>
      <button hidden type="button" @click="report('hidden: этот обработчик недостижим, пока атрибут hidden не удалён.')">hidden</button>
      <span class="slot">После</span>
    </div>

    <div class="visibility-facts">
      <span><code>display: none</code> — места нет</span>
      <span><code>visibility: hidden</code> — место осталось</span>
      <span><code>opacity: 0</code> — место, фокус и действие остались</span>
      <span><code>hidden</code> — семантически скрыто, не переопределяем CSS</span>
    </div>

    <button class="icon-action" type="button" @click="report('Кнопка с визуально скрытым текстом активирована.')">
      <span aria-hidden="true">☰</span><span class="visually-hidden">Открыть расписание</span>
    </button>
    <output class="lab-status" aria-live="polite">{{ status }}</output>
  </section>

  <section v-else class="layout-behavior-lab" aria-label="Проверка переполнения и sticky">
    <div class="overflow-controls" role="group" aria-label="Режим overflow">
      <button v-for="value in ['visible', 'hidden', 'auto']" :key="value" type="button" :aria-pressed="overflowMode === value" @click="overflowMode = value; report(`overflow: ${value}`)">
        overflow: {{ value }}
      </button>
      <button type="button" @click="scrollOverflowStage">Прокрутить область</button>
    </div>

    <div ref="overflowStage" class="overflow-stage" :style="overflowStyle" @scroll="report(`scrollTop: ${Math.round($event.currentTarget.scrollTop)}px`)">
      <div class="sticky-strip">sticky: ближайший предок с overflow становится его границей</div>
      <p>Расписание начинается здесь. Длинное содержимое специально не сокращено: сначала меняем правило переполнения, затем наблюдаем геометрию.</p>
      <p>В <code>visible</code> текст рисуется за границей. В <code>hidden</code> он обрезается. В <code>auto</code> браузер показывает прокрутку, когда она нужна.</p>
      <p>Последняя строка даёт области реальную высоту для прокрутки и показывает, что <code>sticky</code> зависит не от самого <code>z-index</code>, а от ближайшего scroll container.</p>
    </div>
    <output class="lab-status" aria-live="polite">{{ status }}</output>
  </section>
</template>

<style scoped>
.layout-behavior-lab {
  display: grid;
  gap: 0.7rem;
  width: 100%;
  color: var(--fg);
  font-size: 0.78rem;
}

.lab-heading,
.visibility-facts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 1rem;
  align-items: baseline;
}

.lab-heading span,
.visibility-facts,
.lab-status {
  color: var(--fg-dim);
}

.visibility-row {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  min-height: 3rem;
  padding: 0.55rem;
  overflow: visible;
  border: var(--surface-border);
  border-radius: 0.65rem;
  background: var(--surface-bg);
}

.slot {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.68rem;
}

.state-control,
.overflow-controls button,
.icon-action {
  border: 1px solid color-mix(in oklab, var(--accent) 45%, var(--border));
  border-radius: 0.4rem;
  background: color-mix(in oklab, var(--surface-bg) 92%, var(--accent));
  color: var(--fg);
  font: inherit;
  padding: 0.36rem 0.52rem;
}

.display-none { display: none; }
.visibility-hidden { visibility: hidden; }
.transparent-control { opacity: 0; }
.transparent-control:focus-visible { opacity: 1; outline: 3px solid var(--accent); outline-offset: 2px; }

.icon-action {
  justify-self: start;
  font-size: 1.1rem;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.overflow-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.overflow-controls [aria-pressed='true'] {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--surface-bg);
}

.overflow-stage {
  block-size: 9rem;
  border: 2px dashed color-mix(in oklab, var(--accent) 52%, var(--border));
  border-radius: 0.65rem;
  background: var(--surface-bg);
  padding: 0 0.7rem;
}

.overflow-stage p {
  margin: 0.75rem 0;
  line-height: 1.4;
}

.sticky-strip {
  position: sticky;
  inset-block-start: 0;
  margin-inline: -0.7rem;
  padding: 0.42rem 0.7rem;
  background: color-mix(in oklab, var(--accent) 20%, var(--surface-bg));
  border-block-end: 1px solid color-mix(in oklab, var(--accent) 38%, var(--border));
  font-weight: 700;
}

.lab-status {
  min-block-size: 1.2rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
}

button:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  * { scroll-behavior: auto; }
}
</style>
