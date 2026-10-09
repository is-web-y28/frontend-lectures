<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import HighlightedCode from './HighlightedCode.vue'

type DemoMode = 'selectors' | 'cascade' | 'box-sizing' | 'descendant'
type SelectorChoice = 'nav' | 'headings' | 'action'
type BoxSizing = 'content-box' | 'border-box'

const props = defineProps<{
  mode: DemoMode
}>()

const selectorChoice = ref<SelectorChoice>('nav')
const cascadeStep = ref<1 | 2 | 3>(1)
const boxSizing = ref<BoxSizing>('content-box')
const descendantSpace = ref(false)
const iframe = ref<HTMLIFrameElement | null>(null)
const readback = ref<Record<string, string> | null>(null)

const selectorDetails: Record<SelectorChoice, { label: string; selector: string; rule: string }> = {
  nav: {
    label: 'Навигация',
    selector: '.site-nav a',
    rule: '.site-nav a {\n  background: #dbeafe;\n  color: #075985;\n  outline: 2px solid #38bdf8;\n}',
  },
  headings: {
    label: 'Заголовки',
    selector: '.event-card h2',
    rule: '.event-card h2 {\n  background: #dbeafe;\n  color: #075985;\n  outline: 2px solid #38bdf8;\n}',
  },
  action: {
    label: 'Кнопка регистрации',
    selector: 'form .primary-action',
    rule: 'form .primary-action {\n  background: #075985;\n  color: white;\n  outline: 2px solid #38bdf8;\n}',
  },
}

const selectorHtml = `<nav class="site-nav" aria-label="Навигация">
  <a href="#program">Программа</a>
  <a href="#speakers">Докладчики</a>
  <a href="#registration">Регистрация</a>
</nav>
<article class="event-card">
  <h2>Программа</h2><h2>Докладчики</h2><h2>Регистрация</h2>
  <form><button class="primary-action">Зарегистрироваться</button></form>
</article>`

const cascadeCss = computed(() => {
  const rules = ['a { color: #0369a1; }']
  if (cascadeStep.value >= 2) rules.push('.site-nav a { color: #b45309; }')
  if (cascadeStep.value === 3) rules.push('#main-menu a { color: #15803d; }')
  return rules.join('\n')
})

const cascadeHtml = computed(() => `<nav${cascadeStep.value === 3 ? ' id="main-menu"' : ''} class="site-nav">
  <a href="#program">Программа</a>
</nav>`)

const boxCss = computed(() => `.frame-parent {
  box-sizing: content-box;
  outline: 2px dashed #94a3b8;
  overflow: visible;
  width: 300px;
}
.event-card {
  box-sizing: ${boxSizing.value};
  width: 100%; padding: 20px; border: 1px solid #075985;
}`)

const descendantSelector = computed(() => descendantSpace.value ? '.event-card .action' : '.event-card.action')
const descendantCss = computed(() => `${descendantSelector.value} { color: #15803d; }
.action { color: #b91c1c; }`)
const descendantHtml = `<article class="event-card">
  <a class="action" href="#program">Открыть программу</a>
</article>`

const code = computed(() => {
  if (props.mode === 'selectors') return selectorDetails[selectorChoice.value].rule
  if (props.mode === 'cascade') return cascadeCss.value
  if (props.mode === 'box-sizing') return boxCss.value
  return descendantCss.value
})

const html = computed(() => {
  if (props.mode === 'selectors') return selectorHtml
  if (props.mode === 'cascade') return cascadeHtml.value
  if (props.mode === 'box-sizing') return `<div class="frame-parent">
  <article class="event-card">Frontend Meetup</article>
</div>`
  return descendantHtml
})

const frameBaseCss = `
  * { box-sizing: border-box; }
  body { background: #f8fafc; color: #172033; font: 600 16px/1.35 system-ui, sans-serif; margin: 0; padding: 20px; }
  a { color: #0369a1; }
  .site-nav { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
  .site-nav a { border-radius: 6px; padding: 5px 8px; text-decoration-thickness: 0.12em; text-underline-offset: 0.15em; }
  .event-card { background: white; border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; }
  .event-card h2 { display: inline-block; font-size: 1rem; margin: 0 10px 12px 0; padding: 2px 4px; }
  form { margin-top: 6px; }
  button { border: 0; border-radius: 7px; cursor: pointer; font: inherit; padding: 8px 10px; }
  .primary-action { background: #e2e8f0; color: #172033; }
  a:focus-visible, button:focus-visible { outline: 3px solid #7dd3fc; outline-offset: 3px; }
`

const iframeDocument = computed(() => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><style>${frameBaseCss}\n${code.value}</style></head>
<body>${html.value}</body></html>`)

const readbackSummary = computed(() => {
  if (!readback.value) return 'Читаем реальный DOM в iframe…'
  if (props.mode === 'selectors') return `Совпадений: ${readback.value.matches}; ${readback.value.elements}`
  if (props.mode === 'cascade') return `getComputedStyle(link).color → ${readback.value.color}`
  if (props.mode === 'box-sizing') return `border-box ${readback.value.borderBox}; content ${readback.value.contentBox}`
  return `Совпадений: ${readback.value.matches}; getComputedStyle(link).color → ${readback.value.color}`
})

watch([selectorChoice, cascadeStep, boxSizing, descendantSpace, () => props.mode], () => {
  readback.value = null
})

function readIframe(event: Event) {
  const target = event.currentTarget as HTMLIFrameElement
  if (target !== iframe.value) return
  const document = target.contentDocument
  if (!document) return

  if (props.mode === 'selectors') {
    const selector = selectorDetails[selectorChoice.value].selector
    const elements = [...document.querySelectorAll(selector)]
    readback.value = {
      matches: String(elements.length),
      elements: elements.map((element) => element.textContent?.trim()).filter(Boolean).join(' · '),
    }
    return
  }

  if (props.mode === 'cascade') {
    const link = document.querySelector<HTMLAnchorElement>('.site-nav a')
    if (link) readback.value = { color: getComputedStyle(link).color }
    return
  }

  if (props.mode === 'box-sizing') {
    const card = document.querySelector<HTMLElement>('.event-card')
    if (!card) return
    const styles = getComputedStyle(card)
    readback.value = {
      borderBox: `${card.getBoundingClientRect().width}px`,
      contentBox: `${card.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight)}px`,
    }
    return
  }

  const selector = descendantSelector.value
  const link = document.querySelector<HTMLAnchorElement>('.action')
  if (link) {
    readback.value = {
      matches: String(document.querySelectorAll(selector).length),
      color: getComputedStyle(link).color,
    }
  }
}
</script>

<template>
  <section class="css-basics-walkthrough" :aria-label="`Демонстрация CSS: ${mode}`">
    <header class="demo-header">
      <div>
        <p class="eyebrow">Готовый пример · iframe</p>
        <h3 v-if="mode === 'selectors'">Селектор выбирает реальные элементы</h3>
        <h3 v-else-if="mode === 'cascade'">Специфичность меняет итоговый цвет</h3>
        <h3 v-else-if="mode === 'box-sizing'">Размер считывается из браузера</h3>
        <h3 v-else>Пробел меняет условие селектора</h3>
      </div>

      <div v-if="mode === 'selectors'" class="controls" aria-label="Правило селектора">
        <button v-for="choice in (Object.keys(selectorDetails) as SelectorChoice[])" :key="choice" type="button" :aria-pressed="selectorChoice === choice" @click="selectorChoice = choice">
          {{ selectorDetails[choice].label }}
        </button>
      </div>
      <div v-else-if="mode === 'cascade'" class="controls" aria-label="Шаги каскада">
        <button v-for="step in [1, 2, 3] as const" :key="step" type="button" :aria-pressed="cascadeStep === step" @click="cascadeStep = step">
          {{ step === 1 ? 'Только a' : step === 2 ? '+ класс' : '+ id' }}
        </button>
      </div>
      <div v-else-if="mode === 'box-sizing'" class="controls" aria-label="Способ расчёта размера">
        <button v-for="value in ['content-box', 'border-box'] as const" :key="value" type="button" :aria-pressed="boxSizing === value" @click="boxSizing = value">
          {{ value }}
        </button>
      </div>
      <div v-else class="controls" aria-label="Связь в селекторе">
        <button type="button" :aria-pressed="!descendantSpace" @click="descendantSpace = false">Без пробела</button>
        <button type="button" :aria-pressed="descendantSpace" @click="descendantSpace = true">С пробелом</button>
      </div>
    </header>

    <div class="demo-grid">
      <div class="code-column">
        <p class="panel-label">Применяемый CSS</p>
        <HighlightedCode :code="code" lang="css" />
        <p class="panel-label html-label">HTML</p>
        <HighlightedCode :code="html" lang="html" />
      </div>

      <div class="preview-column">
        <p class="panel-label">Браузер применяет этот CSS</p>
        <div class="iframe-stage">
          <iframe ref="iframe" :key="iframeDocument" :srcdoc="iframeDocument" :title="`Живой пример CSS: ${mode}`" @load="readIframe" />
        </div>
        <output class="readback" aria-live="polite">{{ readbackSummary }}</output>
      </div>
    </div>
  </section>
</template>

<style scoped>
.css-basics-walkthrough {
  --ink: #172033;
  --line: #cbd5e1;
  --paper: #ffffff;
  --soft: #f1f5f9;
  color: var(--ink);
  display: grid;
  flex: 1;
  grid-template-rows: auto minmax(0, 1fr);
  gap: var(--sp-3, 0.75rem);
  min-height: 0;
}

.demo-header { align-items: start; display: flex; gap: var(--sp-4, 1rem); justify-content: space-between; }
.eyebrow, .panel-label { color: #475569; font-size: 0.7rem; font-weight: 750; letter-spacing: 0.08em; margin: 0; text-transform: uppercase; }
h3 { font-size: 1rem; line-height: 1.2; margin: 0.2rem 0 0; }
.controls { display: flex; flex-wrap: wrap; gap: 0.4rem; justify-content: end; }
button { background: var(--paper); border: 1px solid #94a3b8; border-radius: 999px; color: var(--ink); cursor: pointer; font: inherit; font-size: 0.72rem; font-weight: 700; padding: 0.36rem 0.64rem; }
button[aria-pressed="true"] { background: #075985; border-color: #075985; color: white; }
button:focus-visible { outline: 3px solid #38bdf8; outline-offset: 2px; }
/* Slidev scales a fixed-width canvas; keep both panels in the same grid row. */
.demo-grid { display: grid; gap: var(--sp-4, 1rem); grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr); grid-template-rows: minmax(0, 1fr); min-height: 0; }
.code-column, .preview-column { background: color-mix(in srgb, var(--paper) 84%, var(--soft)); border: 1px solid var(--line); border-radius: 12px; min-width: 0; min-height: 0; padding: 0.7rem; }
.code-column { display: grid; align-content: start; gap: 0.35rem; overflow: auto; }
.html-label { margin-top: 0.35rem; }
.code-column :deep(pre) { --slidev-code-font-size: 0.66rem; --slidev-code-line-height: 1.25; --slidev-code-padding: 8px; max-height: 8.2rem; overflow: auto; }
.preview-column { display: grid; gap: 0.45rem; grid-template-rows: auto minmax(0, 1fr) auto; }
.iframe-stage { border: 1px solid #94a3b8; border-radius: 8px; min-height: 0; overflow: hidden; position: relative; }
iframe { border: 0; display: block; position: absolute; inset: 0; height: 100%; width: 100%; }
.readback { background: #ecfeff; border: 1px solid #67e8f9; border-radius: 7px; color: #0f172a; font-size: 0.72rem; font-weight: 700; min-height: 1.9rem; padding: 0.38rem 0.5rem; }

</style>
