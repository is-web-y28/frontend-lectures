<script setup lang="ts">
import { computed, ref } from 'vue'
import HighlightedCode from './HighlightedCode.vue'
import tokenSass from '../public/examples/05-css-organization/source/token-demo.scss?raw'
import tokenCss from '../public/examples/05-css-organization/generated/token-demo.css?raw'

type Theme = 'teal' | 'purple'

const theme = ref<Theme>('teal')
const localOverride = ref(false)
const previewFrame = ref<HTMLIFrameElement>()
const computedBorders = ref({
  state: '',
  sass: 'Вычисляется…',
  theme: 'Вычисляется…',
})

const themes: Array<{ id: Theme; label: string }> = [
  { id: 'teal', label: 'Тема: teal' },
  { id: 'purple', label: 'Тема: purple' },
]

const frameState = computed(() => `${theme.value}-${localOverride.value ? 'local' : 'root'}`)

const eventCardContents = `
  <p class="card-kind">event-card</p>
  <h4>CSS для Frontend Meetup</h4>
  <p>18:00 · зал «Код»</p>`

const iframeDocument = computed(() => `<!doctype html>
<html lang="ru" data-theme="${theme.value}">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body {
    align-items: stretch;
    background: #f8fafc;
    color: #102a43;
    display: grid;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    margin: 0;
    min-height: 100vh;
    padding: 12px;
  }
  .cards { display: grid; gap: 10px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .runtime-scope { display: grid; min-width: 0; ${localOverride.value ? '--event-card-border-color: #b45309;' : ''} }
  .event-card {
    background: white;
    border: 4px solid #cbd5e1;
    border-radius: 10px;
    box-shadow: 0 5px 12px rgb(15 23 42 / 10%);
    min-width: 0;
    padding: 12px;
  }
  .card-kind { color: #52667a; font: 700 10px/1 ui-monospace, monospace; letter-spacing: .06em; margin: 0 0 7px; text-transform: uppercase; }
  h4 { font-size: 14px; line-height: 1.15; margin: 0; }
  .event-card > p:last-child { color: #52667a; font-size: 11px; margin: 7px 0 0; }
  @media (max-width: 300px) { .cards { grid-template-columns: 1fr; } }
  ${tokenCss}
</style>
</head>
<body data-demo-state="${frameState.value}">
  <main class="cards" aria-label="Две карточки события">
    <article class="event-card sass-card">${eventCardContents}</article>
    <div class="runtime-scope"><article class="event-card theme-card">${eventCardContents}</article></div>
  </main>
</body>
</html>`)

const currentBorders = computed(() => {
  if (computedBorders.value.state !== frameState.value) {
    return { sass: 'Вычисляется…', theme: 'Вычисляется…' }
  }

  return computedBorders.value
})

const readComputedBorders = () => {
  const document = previewFrame.value?.contentDocument

  if (!document || document.body?.dataset.demoState !== frameState.value) return

  const sassCard = document.querySelector<HTMLElement>('.sass-card')
  const themeCard = document.querySelector<HTMLElement>('.theme-card')

  if (!sassCard || !themeCard) return

  computedBorders.value = {
    state: frameState.value,
    sass: getComputedStyle(sassCard).borderColor,
    theme: getComputedStyle(themeCard).borderColor,
  }
}
</script>

<template>
  <section class="token-theme-demo" aria-label="Демонстрация Sass и CSS-переменных">
    <header class="demo-header">
      <div>
        <p class="eyebrow">Sass собирается, CSS-переменные вычисляет браузер</p>
        <h3>Одна рамка — literal, другая — значение контекста</h3>
      </div>
      <div class="controls" aria-label="Управление темой и локальным токеном">
        <button
          v-for="item in themes"
          :key="item.id"
          type="button"
          :class="{ selected: item.id === theme }"
          :aria-pressed="item.id === theme"
          @click="theme = item.id"
        >
          {{ item.label }}
        </button>
        <button
          type="button"
          :class="{ selected: localOverride }"
          :aria-pressed="localOverride"
          @click="localOverride = !localOverride"
        >
          {{ localOverride ? 'Убрать локальный border' : 'Локальный border: #b45309' }}
        </button>
      </div>
    </header>

    <div class="demo-grid">
      <div class="preview-panel">
        <p class="panel-label">iframe: реальная вычисленная рамка</p>
        <div class="iframe-stage">
          <iframe
            :key="frameState"
            ref="previewFrame"
            :srcdoc="iframeDocument"
            sandbox="allow-same-origin"
            title="Сравнение Sass-литерала и CSS-переменной на карточках события"
            @load="readComputedBorders"
          />
        </div>
        <dl class="computed-values" aria-live="polite">
          <div>
            <dt>.sass-card</dt>
            <dd>{{ currentBorders.sass }}</dd>
          </div>
          <div>
            <dt>.theme-card</dt>
            <dd>{{ currentBorders.theme }}</dd>
          </div>
        </dl>
      </div>

      <div class="code-panel">
        <p class="panel-label">Исходник Sass → собранный CSS</p>
        <HighlightedCode :code="tokenSass" lang="css" />
        <p class="explanation">
          <code>$accent</code> уже превращён в <code>#0f766e</code>. <code>var()</code> остаётся в CSS и берёт
          <code>--color-action</code> у <code>:root</code> или локальный токен у предка.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.token-theme-demo {
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
  max-width: 29rem;
}

button {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 999px;
  color: var(--fg);
  cursor: pointer;
  font: inherit;
  font-size: 0.64rem;
  padding: 0.3rem 0.48rem;
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
  grid-template-columns: minmax(18rem, 1fr) minmax(20rem, 1fr);
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

.computed-values {
  display: grid;
  gap: 0.3rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
}

.computed-values div {
  background: color-mix(in oklab, var(--fg) 4%, var(--surface-bg));
  border-radius: 0.35rem;
  min-width: 0;
  padding: 0.3rem 0.4rem;
}

.computed-values dt {
  color: var(--fg-dim);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.56rem;
}

.computed-values dd {
  color: var(--fg);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.62rem;
  font-weight: 700;
  margin: 0.1rem 0 0;
  overflow-wrap: anywhere;
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
  overflow: auto;
}

.explanation {
  color: var(--fg-dim);
  font-size: 0.68rem;
  line-height: 1.35;
  margin: auto 0 0;
}

.explanation code {
  color: var(--accent-deep, var(--accent));
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
