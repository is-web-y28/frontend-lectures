<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import HighlightedCode from './HighlightedCode.vue'

const positionedCard = ref(false)
const preview = ref<HTMLIFrameElement | null>(null)
const measurement = ref<{ badgeTop: number, cardTop: number, badgeRight: number, cardRight: number } | null>(null)

const html = `<article class="card">
  <span class="badge">Новое</span>
  <h2>Frontend Meetup</h2>
  <p>Карточка остаётся в normal flow.</p>
</article>`

const css = computed(() => `.card {
  position: ${positionedCard.value ? 'relative' : 'static'};
}
.badge {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
}`)

const documentSource = computed(() => `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; padding: 52px 24px 24px; color: #172033; background: #fff; font: 16px/1.4 system-ui, sans-serif; }
    .card { width: 220px; padding: 16px; border: 2px solid #075985; border-radius: 8px; background: #e0f2fe; }
    h2 { margin: 0 0 12px; font-size: 20px; }
    p { margin: 0; }
    .badge { padding: 4px 8px; color: #fff; background: #075985; font-size: 14px; }
    ${css.value}
  </style>
</head>
<body>${html}</body>
</html>`)

function setPosition(enabled: boolean) {
  if (positionedCard.value === enabled) return
  positionedCard.value = enabled
  measurement.value = null
}

function measure() {
  const document = preview.value?.contentDocument
  const card = document?.querySelector<HTMLElement>('.card')
  const badge = document?.querySelector<HTMLElement>('.badge')
  if (!document || !card || !badge) return
  if (getComputedStyle(card).position !== (positionedCard.value ? 'relative' : 'static')) return

  const cardBox = card.getBoundingClientRect()
  const badgeBox = badge.getBoundingClientRect()
  measurement.value = {
    badgeTop: Math.round(badgeBox.top),
    cardTop: Math.round(cardBox.top),
    badgeRight: Math.round(badgeBox.right),
    cardRight: Math.round(cardBox.right),
  }
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  if (!preview.value) return
  resizeObserver = new ResizeObserver(measure)
  resizeObserver.observe(preview.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <section class="containing-block-demo" aria-label="Готовая демонстрация containing block для badge">
    <div class="controls" role="group" aria-label="Позиционирование карточки">
      <button type="button" :aria-pressed="!positionedCard" @click="setPosition(false)">Без позиционирования</button>
      <button type="button" :aria-pressed="positionedCard" @click="setPosition(true)">.card: position: relative</button>
    </div>

    <div class="demo-body">
      <div class="source">
        <HighlightedCode :code="html" lang="html" />
        <HighlightedCode :code="css" lang="css" />
      </div>
      <div class="preview-column">
        <p class="preview-label">Настоящий документ в iframe</p>
        <div class="preview-stage">
          <iframe ref="preview" :srcdoc="documentSource" title="Карточка Frontend Meetup и абсолютный badge" @load="measure"></iframe>
        </div>
      </div>
    </div>

    <output class="measurement" aria-live="polite">
      <template v-if="measurement">
        Измерение браузера: верх badge — {{ measurement.badgeTop }}px, карточки — {{ measurement.cardTop }}px;
        правый край badge — {{ measurement.badgeRight }}px, карточки — {{ measurement.cardRight }}px.
      </template>
      <template v-else>Ожидаем отрисовку документа.</template>
    </output>
  </section>
</template>

<style scoped>
.containing-block-demo {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: 0.7rem;
  color: var(--fg);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

button {
  border: var(--surface-border);
  border-radius: 0.4rem;
  background: var(--surface-bg);
  color: var(--fg);
  padding: 0.4rem 0.65rem;
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
}

button[aria-pressed='true'] {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--on-accent, white);
}

button:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
}

.demo-body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: start;
  gap: 1rem;
  min-height: 0;
}

.source {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.65rem;
}

.source :deep(.highlighted-code) {
  font-size: 0.7rem;
}

.preview-label,
.measurement {
  margin: 0;
  color: var(--fg-dim);
  font-size: 0.74rem;
  line-height: 1.4;
}

.preview-label {
  margin-bottom: 0.5rem;
}

.preview-stage {
  position: relative;
  height: 17rem;
}

iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: var(--surface-border);
  border-radius: 0.5rem;
  background: var(--surface-bg);
}

</style>
