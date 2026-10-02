<script setup lang="ts">
import { computed, ref } from 'vue'
import HighlightedCode from './HighlightedCode.vue'

type LayerCase = 'normal' | 'unlayered' | 'important'

const selectedCase = ref<LayerCase>('normal')

const cases: Array<{
  id: LayerCase
  label: string
  winner: string
  color: string
  explanation: string
  code: string
}> = [
  {
    id: 'normal',
    label: 'Обычные правила',
    winner: 'components',
    color: '#0f766e',
    explanation: 'Слой components объявлен позже base, поэтому его .card побеждает #event-card.card из base — специфичность сравнивается только внутри слоя.',
    code: `@layer base, components;

@layer base {
  #event-card.card { background: #b45309; }
}
@layer components {
  .card { background: #0f766e; }
}`,
  },
  {
    id: 'unlayered',
    label: 'Обычное вне слоя',
    winner: 'не в слое',
    color: '#7c3aed',
    explanation: 'Для обычных деклараций правило вне @layer стоит выше всех слоёв. Оно побеждает и base, и components.',
    code: `@layer base, components;

@layer base {
  #event-card.card { background: #b45309; }
}
@layer components {
  .card { background: #0f766e; }
}
.card { background: #7c3aed; }`,
  },
  {
    id: 'important',
    label: '!important',
    winner: 'base',
    color: '#be123c',
    explanation: 'Для !important порядок слоёв обратный: первый base выше components. Любая !important-декларация в слое также выше !important вне слоёв.',
    code: `@layer base, components;

@layer base {
  #event-card.card { background: #be123c !important; }
}
@layer components {
  .card { background: #0f766e !important; }
}
.card { background: #7c3aed !important; }`,
  },
]

const activeCase = computed(() => cases.find((item) => item.id === selectedCase.value) ?? cases[0])

const iframeDocument = computed(() => `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<style>
  @layer base, components;
  * { box-sizing: border-box; }
  body { align-items: center; background: #f8fafc; display: grid; font: 700 16px/1.3 system-ui, sans-serif; margin: 0; min-height: 100vh; padding: 18px; }
  .card { border-radius: 12px; box-shadow: 0 10px 22px rgb(15 23 42 / 16%); color: white; padding: 22px; text-align: center; }
  .card span { display: block; font-size: 12px; font-weight: 500; margin-top: 5px; opacity: .82; }
  ${activeCase.value.code}
</style>
</head>
<body>
  <article id="event-card" class="card">Итоговый цвет: ${activeCase.value.winner}<span>Браузер вычислил background</span></article>
</body>
</html>`)
</script>

<template>
  <section class="cascade-layers-demo" aria-label="Интерактивная демонстрация каскадных слоёв CSS">
    <div class="demo-header">
      <div>
        <p class="eyebrow">Настоящий каскад в iframe</p>
        <h3>Слой выбирается раньше специфичности</h3>
      </div>
      <div class="case-controls" aria-label="Сценарий каскадных слоёв">
        <button
          v-for="item in cases"
          :key="item.id"
          type="button"
          :class="{ selected: item.id === selectedCase }"
          :aria-pressed="item.id === selectedCase"
          @click="selectedCase = item.id"
        >
          {{ item.label }}
        </button>
      </div>
    </div>

    <div class="demo-grid">
      <div class="preview-panel">
        <p class="panel-label">Результат, который рисует браузер</p>
        <div class="iframe-stage">
          <iframe
            :key="selectedCase"
            :srcdoc="iframeDocument"
            sandbox
            :title="`Каскад CSS: победитель — ${activeCase.winner}`"
          />
        </div>
        <p class="winner" aria-live="polite">
          Победитель: <strong :style="{ color: activeCase.color }">{{ activeCase.winner }}</strong>
        </p>
      </div>

      <div class="code-panel">
        <p class="panel-label">CSS выбранного сценария</p>
        <HighlightedCode :code="activeCase.code" lang="css" />
        <p class="explanation">{{ activeCase.explanation }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cascade-layers-demo {
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

.case-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: flex-end;
}

button {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 999px;
  color: var(--fg);
  cursor: pointer;
  font: inherit;
  font-size: 0.67rem;
  padding: 0.32rem 0.52rem;
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
  grid-template-columns: minmax(12rem, 0.8fr) minmax(19rem, 1.2fr);
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
  flex: 1;
  min-height: 9.5rem;
  position: relative;
}

iframe {
  border: 1px solid var(--border);
  border-radius: 0.42rem;
  height: 100%;
  inset: 0;
  position: absolute;
  width: 100%;
}

.winner {
  color: var(--fg-dim);
  font-size: 0.72rem;
  margin: 0;
}

.code-panel {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  overflow: hidden;
}

.code-panel :deep(pre) {
  font-size: 0.59rem;
  line-height: 1.35;
  max-height: 11.6rem;
  overflow: auto;
}

.explanation {
  color: var(--fg-dim);
  font-size: 0.7rem;
  line-height: 1.35;
  margin: auto 0 0;
}

@media (max-width: 720px) {
  .demo-header {
    align-items: start;
    flex-direction: column;
  }

  .case-controls {
    justify-content: start;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
