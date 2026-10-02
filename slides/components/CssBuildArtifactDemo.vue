<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import HighlightedCode from './HighlightedCode.vue'
import sassSource from '../public/examples/05-css-organization/source/token-demo.scss?raw'
import sassArtifact from '../public/examples/05-css-organization/generated/token-demo.css?raw'
import postcssSource from '../public/examples/05-css-organization/source/prefixes.css?raw'
import postcssArtifact from '../public/examples/05-css-organization/generated/prefixes.css?raw'

type Pipeline = 'sass' | 'postcss'

type PipelineExample = {
  id: Pipeline
  label: string
  source: string
  artifact: string
  preview: string
  explanation: string
}

const props = withDefaults(defineProps<{
  initialMode?: Pipeline
}>(), {
  initialMode: 'sass',
})

const selectedPipeline = ref<Pipeline>(props.initialMode)
const artifactEnabled = ref(true)
const measuredStyle = ref('Загрузка iframe…')
let isMounted = true

const examples: PipelineExample[] = [
  {
    id: 'sass',
    label: 'Sass',
    source: sassSource,
    artifact: sassArtifact,
    preview: `<article id="sass-card" class="sass-card" data-preview-target="sass-card">
  <span>Frontend Meetup</span>
  <strong>Переменная Sass стала CSS</strong>
</article>`,
    explanation: 'Sass подставляет значение $accent в готовый CSS: браузер получает уже обычное правило.',
  },
  {
    id: 'postcss',
    label: 'PostCSS',
    source: postcssSource,
    artifact: postcssArtifact,
    preview: `<div id="prefix-lab" class="prefix-lab" data-preview-target="prefix-lab">
  <span>18:00</span><span>Слои</span><span>зал «Код»</span>
</div>`,
    explanation: 'Autoprefixer добавляет записи для целевого Safari 8. Современный браузер принимает и неприставочное правило.',
  },
]

const activeExample = computed(() => examples.find((example) => example.id === selectedPipeline.value) ?? examples[0])

const iframeDocument = computed(() => {
  const baseline = selectedPipeline.value === 'sass'
    ? `.sass-card {
  background: #f8fafc;
  border: 4px solid #94a3b8;
  border-radius: 12px;
  color: #172554;
  align-items: center;
  display: flex;
  gap: 12px;
  padding: 12px;
}
.sass-card span { color: #475569; display: block; flex-shrink: 0; font: 700 12px/1.2 system-ui, sans-serif; letter-spacing: .06em; text-transform: uppercase; }
.sass-card strong { display: block; font: 800 19px/1.2 system-ui, sans-serif; }
`
    : `.prefix-lab {
  background: #f8fafc;
  border: 2px solid #94a3b8;
  border-radius: 12px;
  display: block;
  min-width: 0;
  padding: 15px;
  user-select: text;
}
.prefix-lab span { background: #e2e8f0; border-radius: 999px; color: #172554; display: block; font: 700 13px/1 system-ui, sans-serif; margin: 4px; min-width: 0; padding: 8px 10px; }
`

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body { align-items: center; background: #ffffff; display: grid; margin: 0; min-height: 100vh; padding: 8px; }
  ${baseline}
  ${artifactEnabled.value ? activeExample.value.artifact : ''}
</style>
</head>
<body>
${activeExample.value.preview}
</body>
</html>`
})

function selectPipeline(pipeline: Pipeline) {
  if (selectedPipeline.value === pipeline) return
  selectedPipeline.value = pipeline
  measuredStyle.value = 'Загрузка iframe…'
}

function toggleArtifact() {
  artifactEnabled.value = !artifactEnabled.value
  measuredStyle.value = 'Загрузка iframe…'
}

function updateMeasuredStyle(event: Event) {
  if (!isMounted)
    return

  const frame = event.currentTarget as HTMLIFrameElement
  const document = frame.contentDocument
  if (!document)
    return

  const target = selectedPipeline.value === 'sass'
    ? document.querySelector<HTMLElement>('#sass-card')
    : document.querySelector<HTMLElement>('#prefix-lab')
  if (!target)
    return

  const style = getComputedStyle(target)
  measuredStyle.value = selectedPipeline.value === 'sass'
    ? `border-color: ${style.borderTopColor}`
    : `display: ${style.display}; user-select: ${style.userSelect}`
}

onUnmounted(() => {
  isMounted = false
})
</script>

<template>
  <section class="build-artifact-demo" aria-label="Исходный CSS и артефакт сборки">
    <header class="demo-header">
      <p class="eyebrow">Исходник → артефакт → браузер</p>
      <div class="controls" aria-label="Управление демонстрацией сборки CSS">
        <button
          v-for="example in examples"
          :key="example.id"
          type="button"
          :class="{ selected: example.id === selectedPipeline }"
          :aria-pressed="example.id === selectedPipeline"
          @click="selectPipeline(example.id)"
        >
          {{ example.label }}
        </button>
        <button
          type="button"
          :class="{ selected: artifactEnabled }"
          :aria-pressed="artifactEnabled"
          @click="toggleArtifact"
        >
          {{ artifactEnabled ? 'Отключить артефакт' : 'Подключить артефакт' }}
        </button>
      </div>
    </header>

    <div class="demo-grid">
      <section class="code-panel" aria-label="Авторский исходный код">
        <p class="panel-label">Авторский исходник</p>
        <div class="code-scroll">
          <HighlightedCode :code="activeExample.source" lang="css" />
        </div>
      </section>

      <section class="code-panel" aria-label="Артефакт компилятора">
        <p class="panel-label">Готовый CSS из generated</p>
        <div class="code-scroll">
          <HighlightedCode :code="activeExample.artifact" lang="css" />
        </div>
      </section>

      <section class="preview-panel" aria-label="Реальный результат в iframe">
        <div class="iframe-stage" :class="{ 'stacked-preview': selectedPipeline === 'postcss' && !artifactEnabled }">
          <iframe
            :key="`${selectedPipeline}-${artifactEnabled}`"
            data-build-artifact-preview
            :srcdoc="iframeDocument"
            sandbox="allow-same-origin"
            :title="`${activeExample.label}: предпросмотр готового CSS`"
            @load="updateMeasuredStyle"
          />
        </div>
        <div class="preview-details">
          <p class="panel-label">Реальный результат</p>
          <p class="measured" aria-live="polite">
            Вычислено в iframe: <code>{{ measuredStyle }}</code>
          </p>
          <p class="explanation">{{ activeExample.explanation }}</p>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.build-artifact-demo {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.7rem;
  min-height: 0;
  width: 100%;
}

.demo-header {
  align-items: center;
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


.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: flex-end;
  max-width: 27rem;
}

button {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 999px;
  color: var(--fg);
  cursor: pointer;
  font: inherit;
  font-size: 0.65rem;
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
  gap: 0.65rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: minmax(0, 1fr) auto;
  min-height: 0;
}

.code-panel,
.preview-panel {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 0.65rem;
  min-height: 0;
  min-width: 0;
  padding: 0.6rem;
}

.code-panel {
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
  overflow: hidden;
}

.code-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.code-scroll :deep(pre) {
  font-size: 0.64rem;
  line-height: 1.34;
  margin: 0;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.preview-panel {
  align-items: center;
  display: grid;
  gap: 0.8rem;
  grid-column: 1 / -1;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
}

.iframe-stage {
  height: 6.5rem;
  min-width: 0;
  position: relative;
}

.iframe-stage.stacked-preview {
  height: 10.5rem;
}

.preview-details {
  display: flex;
  flex-direction: column;
  gap: 0.42rem;
  min-width: 0;
}

iframe {
  border: 1px solid var(--border);
  border-radius: 0.45rem;
  height: 100%;
  inset: 0;
  position: absolute;
  min-width: 0;
  width: 100%;
}

.measured,
.explanation {
  color: var(--fg-dim);
  font-size: 0.64rem;
  line-height: 1.3;
  margin: 0;
}

.measured code {
  color: var(--accent-deep, var(--accent));
  font-family: var(--font-mono, ui-monospace, monospace);
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
    grid-template-rows: repeat(2, minmax(0, 1fr)) auto;
  }

  .preview-panel {
    grid-template-columns: 1fr;
  }
}
</style>
