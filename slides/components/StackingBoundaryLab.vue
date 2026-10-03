<script setup>
import { computed, ref } from 'vue'

const contexts = ref(true)
const clipped = ref(false)
const status = ref('Измените границы и наблюдайте реальную отрисовку.')

const leftStyle = computed(() => contexts.value ? { position: 'relative', zIndex: 1, transform: 'translateZ(0)' } : { position: 'relative' })
const rightStyle = computed(() => contexts.value ? { position: 'relative', zIndex: 2, opacity: 0.96 } : { position: 'relative' })
const cropStyle = computed(() => ({ overflow: clipped.value ? 'hidden' : 'visible' }))

function toggleContexts() {
  contexts.value = !contexts.value
  status.value = contexts.value
    ? 'У обоих предков есть stacking context: 999 остаётся внутри левого контекста.'
    : 'Контексты предков сняты: порядок потомков снова сравнивается в общем контексте.'
}

function toggleClipping() {
  clipped.value = !clipped.value
  status.value = clipped.value
    ? 'overflow: hidden обрезает нарисованное за границей; это не изменение z-index.'
    : 'Граница больше не обрезает потомка.'
}
</script>

<template>
  <section class="stacking-boundary-lab" aria-label="Наблюдение stacking context и clipping">
    <div class="stacking-controls">
      <button type="button" :aria-pressed="contexts" @click="toggleContexts">Контексты предков: {{ contexts ? 'вкл.' : 'выкл.' }}</button>
      <button type="button" :aria-pressed="clipped" @click="toggleClipping">Обрезать левую карточку: {{ clipped ? 'да' : 'нет' }}</button>
    </div>

    <div class="stacking-stage">
      <article class="stack-card left" :style="[leftStyle, cropStyle]">
        <strong>Левый предок</strong>
        <code>z-index: {{ contexts ? 1 : 'auto' }}</code>
        <span class="high-child">потомок<br><code>z-index: 999</code></span>
      </article>
      <article class="stack-card right" :style="rightStyle">
        <strong>Правый предок</strong>
        <code>z-index: {{ contexts ? 2 : 'auto' }}</code>
        <span class="cover-layer">соседний слой</span>
      </article>
    </div>
    <output class="stack-status" aria-live="polite">{{ status }}</output>
  </section>
</template>

<style scoped>
.stacking-boundary-lab {
  display: grid;
  gap: 0.75rem;
  width: 100%;
  color: var(--fg);
}

.stacking-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

button {
  border: 1px solid color-mix(in oklab, var(--accent) 45%, var(--border));
  border-radius: 0.4rem;
  background: color-mix(in oklab, var(--surface-bg) 92%, var(--accent));
  color: var(--fg);
  font: inherit;
  font-size: 0.76rem;
  padding: 0.36rem 0.52rem;
}

button[aria-pressed='true'] {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--surface-bg);
}

button:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

.stacking-stage {
  position: relative;
  display: flex;
  align-items: center;
  min-block-size: 11rem;
  padding: 1.25rem 1.75rem;
  overflow: visible;
  border: var(--surface-border);
  border-radius: 0.65rem;
  background: color-mix(in oklab, var(--surface-bg) 94%, var(--accent));
}

.stack-card {
  display: grid;
  gap: 0.3rem;
  inline-size: 45%;
  min-block-size: 6.5rem;
  padding: 0.8rem;
  border: 2px solid var(--border);
  border-radius: 0.55rem;
  background: var(--surface-bg);
}

.stack-card code,
.high-child code {
  color: var(--fg-dim);
  font-family: var(--font-mono);
  font-size: 0.67rem;
}

.right {
  margin-inline-start: -2.4rem;
  background: color-mix(in oklab, var(--surface-bg) 77%, var(--accent));
}

.high-child,
.cover-layer {
  position: absolute;
  inset-block-start: 2.8rem;
  display: grid;
  place-content: center;
  inline-size: 7.7rem;
  block-size: 3.6rem;
  border-radius: 0.4rem;
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  text-align: center;
}

.high-child {
  inset-inline-end: -3.8rem;
  z-index: 999;
  background: #c2410c;
}

.cover-layer {
  inset-inline-start: -1.5rem;
  z-index: 1;
  background: #0369a1;
}

.stack-status {
  min-block-size: 1.2rem;
  color: var(--fg-dim);
  font-family: var(--font-mono);
  font-size: 0.66rem;
}
</style>
