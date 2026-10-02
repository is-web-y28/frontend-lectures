<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import HighlightedCode from './HighlightedCode.vue'

type DecisionMode = 'relevance' | 'specificity' | 'order' | 'files'
type Challenger = 'plain' | 'featured'

const props = withDefaults(defineProps<{
  mode?: DecisionMode
}>(), {
  mode: 'relevance',
})

const viewportWidth = ref<480 | 960>(480)
const challenger = ref<Challenger>('plain')
const removeId = ref(false)
const reverseOrder = ref(false)
const reverseFiles = ref(false)
const useLayers = ref(false)
const previewStage = ref<HTMLElement | null>(null)
const iframe = ref<HTMLIFrameElement | null>(null)
const stageWidth = ref(0)
const readback = ref<{
  background: string
  borderColor: string
  color: string
} | null>(null)

const modeCopy: Record<DecisionMode, { eyebrow: string, title: string, codeLabel: string }> = {
  relevance: {
    eyebrow: 'Шаг 1 · relevance',
    title: 'Условие @media сначала допускает правило к выбору',
    codeLabel: 'Участвующий CSS в iframe',
  },
  specificity: {
    eyebrow: 'Шаг 3 · specificity',
    title: 'ID не перекрывают количеством классов',
    codeLabel: 'Сравниваемые селекторы в iframe',
  },
  order: {
    eyebrow: 'Шаг 5 · order',
    title: 'При полном равенстве решает последняя декларация',
    codeLabel: 'Реальный порядок правил в iframe',
  },
  files: {
    eyebrow: 'Файлы и слои',
    title: 'Слой фиксирует приоритет, а не имя файла',
    codeLabel: 'Склеенные блоки файлов в iframe',
  },
}

const activeCopy = computed(() => modeCopy[props.mode])

const specificityFirstSelector = computed(() => removeId.value ? '.card' : '#event-card.card')
const specificityChallengerSelector = computed(() => challenger.value === 'plain' ? '.event-card' : '.event-card.featured')

const activeCss = computed(() => {
  if (props.mode === 'relevance') {
    return `.event-card {
  background: #fff7ed;
  border: 3px solid #c2410c;
  color: #9a3412;
}

@media (min-width: 60rem) {
  .event-card {
    background: #ccfbf1;
    border: 3px solid #0f766e;
    color: #115e59;
  }
}`
  }

  if (props.mode === 'specificity') {
    const firstWeight = removeId.value ? '0-1-0' : '1-1-0'
    const challengerWeight = challenger.value === 'plain' ? '0-1-0' : '0-2-0'

    return `${specificityFirstSelector.value} { /* ${firstWeight} */
  background: #fff7ed;
  border: 3px solid #c2410c;
  color: #9a3412;
}

${specificityChallengerSelector.value} { /* ${challengerWeight} */
  background: #ccfbf1;
  border: 3px solid #0f766e;
  color: #115e59;
}`
  }

  if (props.mode === 'order') {
    const tealRule = `.event-card {
  background: #ccfbf1;
  border: 3px solid #0f766e;
  color: #115e59;
}`
    const coralRule = `.event-card {
  background: #fff1f2;
  border: 3px solid #e11d48;
  color: #9f1239;
}`

    return reverseOrder.value ? `${coralRule}

${tealRule}` : `${tealRule}

${coralRule}`
  }

  const componentBlock = useLayers.value
    ? `/* component.css */
@layer components {
  .event-card {
    background: #ccfbf1;
    border: 3px solid #0f766e;
    color: #115e59;
  }
}`
    : `/* component.css */
.event-card {
  background: #ccfbf1;
  border: 3px solid #0f766e;
  color: #115e59;
}`
  const utilityBlock = useLayers.value
    ? `/* utilities.css */
@layer utilities {
  .event-card {
    background: #f3e8ff;
    border: 3px solid #7e22ce;
    color: #581c87;
  }
}`
    : `/* utilities.css */
.event-card {
  background: #f3e8ff;
  border: 3px solid #7e22ce;
  color: #581c87;
}`
  const fileBlocks = reverseFiles.value
    ? `${utilityBlock}

${componentBlock}`
    : `${componentBlock}

${utilityBlock}`

  return useLayers.value ? `@layer components, utilities;

${fileBlocks}` : fileBlocks
})

const explanation = computed(() => {
  if (props.mode === 'relevance') {
    return viewportWidth.value === 480
      ? '480 px меньше 60rem (960 px): зелёное правило внутри @media не участвует в каскаде.'
      : '960 px достигает 60rem: оба правила релевантны, и более позднее зелёное правило меняет карточку.'
  }

  if (props.mode === 'specificity') {
    if (!removeId.value) {
      return `${specificityFirstSelector.value} имеет ID в первой группе веса. Даже ${specificityChallengerSelector.value} не может его перекрыть.`
    }
    return challenger.value === 'featured'
      ? `${specificityChallengerSelector.value} теперь имеет 0-2-0 и побеждает .card с 0-1-0.`
      : 'Оба селектора имеют 0-1-0, поэтому при равенстве побеждает более поздняя .event-card.'
  }

  if (props.mode === 'order') {
    return reverseOrder.value
      ? 'Селекторы и вес равны; последней стала бирюзовая декларация, поэтому она задаёт все три свойства.'
      : 'Селекторы и вес равны; последней стала коралловая декларация, поэтому она задаёт все три свойства.'
  }

  if (useLayers.value) {
    return 'Порядок layers объявлен как components, utilities: utilities выше components независимо от перестановки склеенных файлов. Внутри одного @layer при равной специфичности всё ещё важна последняя строка.'
  }
  return reverseFiles.value
    ? 'Без @layer побеждает правило из component.css, потому что этот блок оказался последним после склейки.'
    : 'Без @layer побеждает правило из utilities.css, потому что этот блок оказался последним после склейки.'
})

const frameBaseCss = `
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    align-items: center;
    background: #f8fafc;
    display: grid;
    font: 700 16px/1.25 system-ui, sans-serif;
    margin: 0;
    padding: 24px;
  }
  .event-card {
    border-radius: 18px;
    box-shadow: 0 12px 28px rgb(15 23 42 / 14%);
    max-width: 42rem;
    padding: 24px;
    width: 100%;
  }
  .event-card small {
    display: block;
    font-size: 0.72em;
    font-weight: 600;
    margin-top: 0.55em;
    opacity: 0.78;
  }
`

const iframeDocument = computed(() => `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<style>${frameBaseCss}
${activeCss.value}</style>
</head>
<body>
  <article id="event-card" class="card event-card featured">
    Frontend Meetup
    <small>18:00 · зал «Код»</small>
  </article>
</body>
</html>`)

const frameKey = computed(() => [
  props.mode,
  viewportWidth.value,
  challenger.value,
  removeId.value,
  reverseOrder.value,
  reverseFiles.value,
  useLayers.value,
].join(':'))

const isScaledViewport = computed(() => props.mode === 'relevance')
const viewportScale = computed(() => {
  if (!isScaledViewport.value || !stageWidth.value) return 1
  return Math.min(1, stageWidth.value / viewportWidth.value)
})
const frameBoxStyle = computed(() => isScaledViewport.value
  ? {
      height: '180px',
      transform: `translate(-50%, -50%) scale(${viewportScale.value})`,
      width: `${viewportWidth.value}px`,
    }
  : {
      height: '100%',
      width: '100%',
    })

watch(frameKey, () => {
  readback.value = null
})

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  if (!previewStage.value) return

  resizeObserver = new ResizeObserver(([entry]) => {
    stageWidth.value = entry.contentRect.width
  })
  resizeObserver.observe(previewStage.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

function readComputedStyle(event: Event) {
  const target = event.currentTarget as HTMLIFrameElement
  if (target !== iframe.value) return

  const card = target.contentDocument?.getElementById('event-card')
  const styles = card && getComputedStyle(card)
  if (!styles) return

  readback.value = {
    background: styles.backgroundColor,
    borderColor: styles.borderTopColor,
    color: styles.color,
  }
}
</script>

<template>
  <section class="cascade-decision-demo" :aria-label="`Демонстрация CSS-каскада: ${activeCopy.eyebrow}`">
    <header class="demo-header">
      <div>
        <p class="eyebrow">{{ activeCopy.eyebrow }}</p>
        <h3>{{ activeCopy.title }}</h3>
      </div>

      <div v-if="mode === 'relevance'" class="controls" aria-label="Ширина viewport в демонстрации relevance">
        <button
          type="button"
          :class="{ selected: viewportWidth === 480 }"
          :aria-pressed="viewportWidth === 480"
          @click="viewportWidth = 480"
        >
          480 px · @media выключен
        </button>
        <button
          type="button"
          :class="{ selected: viewportWidth === 960 }"
          :aria-pressed="viewportWidth === 960"
          @click="viewportWidth = 960"
        >
          960 px · @media включён
        </button>
      </div>

      <div v-else-if="mode === 'specificity'" class="controls" aria-label="Сравнение специфичности">
        <button
          type="button"
          :class="{ selected: challenger === 'plain' }"
          :aria-pressed="challenger === 'plain'"
          @click="challenger = 'plain'"
        >
          Ответ: .event-card
        </button>
        <button
          type="button"
          :class="{ selected: challenger === 'featured' }"
          :aria-pressed="challenger === 'featured'"
          @click="challenger = 'featured'"
        >
          Ответ: .event-card.featured
        </button>
        <button
          type="button"
          :class="{ selected: removeId }"
          :aria-pressed="removeId"
          @click="removeId = !removeId"
        >
          {{ removeId ? 'Вернуть ID в первое правило' : 'Убрать ID из первого правила' }}
        </button>
      </div>

      <div v-else-if="mode === 'order'" class="controls" aria-label="Порядок одинаковых правил">
        <button
          type="button"
          :class="{ selected: reverseOrder }"
          :aria-pressed="reverseOrder"
          @click="reverseOrder = !reverseOrder"
        >
          {{ reverseOrder ? 'Вернуть порядок: teal → coral' : 'Поменять порядок: coral → teal' }}
        </button>
      </div>

      <div v-else class="controls" aria-label="Порядок файлов и каскадные слои">
        <button
          type="button"
          :class="{ selected: reverseFiles }"
          :aria-pressed="reverseFiles"
          @click="reverseFiles = !reverseFiles"
        >
          {{ reverseFiles ? 'Вернуть порядок: component → utilities' : 'Поменять порядок: utilities → component' }}
        </button>
        <button
          type="button"
          :class="{ selected: useLayers }"
          :aria-pressed="useLayers"
          @click="useLayers = !useLayers"
        >
          {{ useLayers ? 'Убрать @layer components, utilities' : 'Включить @layer components, utilities' }}
        </button>
      </div>
    </header>

    <div class="demo-grid">
      <div class="preview-panel">
        <p class="panel-label">Карточка, которую рисует браузер</p>
        <div ref="previewStage" class="iframe-stage">
          <p v-if="isScaledViewport" class="viewport-label">Логический viewport iframe: {{ viewportWidth }} px</p>
          <div class="iframe-viewport" :class="{ 'scaled-viewport': isScaledViewport }" :style="frameBoxStyle">
            <iframe
              ref="iframe"
              :key="frameKey"
              :srcdoc="iframeDocument"
              sandbox="allow-same-origin"
              :title="`Изолированная карточка: ${activeCopy.eyebrow}`"
              @load="readComputedStyle"
            />
          </div>
        </div>
        <p class="readback" aria-live="polite">
          <template v-if="readback">
            Вычислено: <code>background {{ readback.background }}</code> · <code>border {{ readback.borderColor }}</code> · <code>color {{ readback.color }}</code>
          </template>
          <template v-else>Вычисляем стили карточки…</template>
        </p>
      </div>

      <div class="code-panel">
        <p class="panel-label">{{ activeCopy.codeLabel }}</p>
        <HighlightedCode :code="activeCss" lang="css" />
        <p class="explanation" aria-live="polite">{{ explanation }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cascade-decision-demo {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.7rem;
  min-height: 0;
  width: 100%;
}

.demo-header {
  align-items: end;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.eyebrow,
.panel-label {
  color: var(--fg-dim);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  margin: 0;
  text-transform: uppercase;
}

h3 {
  color: var(--fg);
  font-size: 1.05rem;
  margin: 0.15rem 0 0;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: flex-end;
  max-width: 33rem;
}

button {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 999px;
  color: var(--fg);
  cursor: pointer;
  font: inherit;
  font-size: 0.64rem;
  padding: 0.3rem 0.5rem;
}

button.selected {
  background: color-mix(in oklab, var(--accent) 15%, var(--surface-bg));
  border-color: var(--accent);
  color: var(--accent-deep, var(--accent));
  font-weight: 800;
}

button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.demo-grid {
  display: grid;
  flex: 1;
  gap: 0.7rem;
  grid-template-columns: minmax(18rem, 0.95fr) minmax(20rem, 1.05fr);
  min-height: 0;
}

.preview-panel,
.code-panel {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 0.65rem;
  min-height: 0;
  padding: 0.65rem;
}

.preview-panel {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.iframe-stage {
  background: #e2e8f0;
  border: 1px solid var(--border);
  border-radius: 0.46rem;
  flex: 1;
  min-height: 9.5rem;
  overflow: hidden;
  position: relative;
}

.viewport-label {
  background: rgb(15 23 42 / 78%);
  border-radius: 999px;
  color: white;
  font-size: 0.56rem;
  font-weight: 800;
  left: 0.42rem;
  margin: 0;
  padding: 0.18rem 0.35rem;
  position: absolute;
  top: 0.42rem;
  z-index: 1;
}

.iframe-viewport {
  height: 100%;
  width: 100%;
}

.iframe-viewport:not(.scaled-viewport) {
  inset: 0;
  position: absolute;
}

.iframe-viewport.scaled-viewport {
  left: 50%;
  position: absolute;
  top: 50%;
  transform-origin: center;
}

iframe {
  border: 0;
  display: block;
  height: 100%;
  width: 100%;
}

.readback,
.explanation {
  color: var(--fg-dim);
  font-size: 0.68rem;
  line-height: 1.35;
  margin: 0;
}

.readback code {
  color: var(--accent-deep, var(--accent));
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.92em;
}

.code-panel {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  overflow: hidden;
}

.code-panel :deep(pre) {
  font-size: 0.57rem;
  line-height: 1.3;
  margin: 0;
  max-height: 11.7rem;
  overflow: auto;
}

.explanation {
  border-inline-start: 0.2rem solid var(--accent);
  margin-top: auto;
  padding-inline-start: 0.45rem;
}

@media (max-width: 720px) {
  .demo-header {
    align-items: start;
    flex-direction: column;
  }

  .controls {
    justify-content: start;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
