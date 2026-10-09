<script setup>
import { computed, ref } from 'vue'

const direction = ref('row')
const isColumn = computed(() => direction.value === 'column')
const horizontalAxis = computed(() => isColumn.value ? 'Поперечная' : 'Главная')
const verticalAxis = computed(() => isColumn.value ? 'Главная' : 'Поперечная')
const description = computed(() => isColumn.value
  ? 'Главная ось направлена вниз, поперечная — вправо.'
  : 'Главная ось направлена вправо, поперечная — вниз.')
</script>

<template>
  <section class="flex-axes-demo" aria-label="Визуальное представление осей Flexbox">
    <div class="direction-controls" role="group" aria-label="Направление Flexbox">
      <button
        v-for="value in ['row', 'column']"
        :key="value"
        type="button"
        :aria-pressed="direction === value"
        @click="direction = value"
      >
        {{ value }}
      </button>
    </div>

    <div class="axis-stage" role="img" :aria-label="description">
      <div class="axis-horizontal" :class="isColumn ? 'cross-axis' : 'main-axis'" aria-hidden="true">
        <span>{{ horizontalAxis }}</span>
      </div>
      <div class="axis-vertical" :class="isColumn ? 'main-axis' : 'cross-axis'" aria-hidden="true">
        <span>{{ verticalAxis }}</span>
      </div>
      <div class="axis-items" :style="{ flexDirection: direction }" aria-hidden="true">
        <span v-for="item in ['A', 'B', 'C']" :key="item" class="axis-item">{{ item }}</span>
      </div>
    </div>

    <div class="axis-legend">
      <span class="main-key">Главная — <code>justify-content</code></span>
      <span class="cross-key">Поперечная — <code>align-items</code></span>
    </div>
    <p class="axis-description" aria-live="polite">{{ description }}</p>
    <p class="writing-context">Горизонтальная запись, <code>direction: ltr</code>.</p>
  </section>
</template>

<style scoped>
.flex-axes-demo {
  --main-axis-color: color-mix(in oklab, var(--accent) 70%, var(--fg));
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-height: 0;
  color: var(--fg);
}

.direction-controls {
  display: flex;
  gap: 0.4rem;
}

.direction-controls button {
  padding: 0.35rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 0.4rem;
  background: var(--surface-bg);
  color: var(--fg);
  font: 0.8rem var(--font-mono);
}

.direction-controls button[aria-pressed='true'] {
  border-color: var(--main-axis-color);
  background: color-mix(in oklab, var(--accent) 14%, var(--surface-bg));
}

.direction-controls button:focus-visible {
  outline: 2px solid var(--fg);
  outline-offset: 3px;
}

.axis-stage {
  position: relative;
  flex: 1;
  min-height: 12rem;
  border: 1px solid var(--border);
  border-radius: 0.6rem;
  background: var(--surface-bg);
  direction: ltr;
  writing-mode: horizontal-tb;
}

.axis-horizontal,
.axis-vertical {
  position: absolute;
  font-size: 0.75rem;
  font-weight: 700;
}

.main-axis { color: var(--main-axis-color); }
.cross-axis { color: var(--fg-dim); }

.axis-horizontal {
  top: 2rem;
  left: 2.75rem;
  right: 1rem;
  border-top: 2px solid currentColor;
}

.axis-horizontal.cross-axis { border-top-style: dashed; }

.axis-horizontal::after {
  content: '';
  position: absolute;
  top: -0.32rem;
  right: -0.1rem;
  border-left: 0.5rem solid currentColor;
  border-block: 0.25rem solid transparent;
}

.axis-horizontal span {
  position: absolute;
  top: -1.5rem;
  left: 0;
}

.axis-vertical {
  top: 2.75rem;
  bottom: 1rem;
  left: 2rem;
  border-left: 2px solid currentColor;
}

.axis-vertical.cross-axis { border-left-style: dashed; }

.axis-vertical::after {
  content: '';
  position: absolute;
  bottom: -0.1rem;
  left: -0.32rem;
  border-top: 0.5rem solid currentColor;
  border-inline: 0.25rem solid transparent;
}

.axis-vertical span {
  position: absolute;
  top: 0;
  left: -1.6rem;
  writing-mode: vertical-rl;
}

.axis-items {
  position: absolute;
  inset: 3rem 1rem 1rem 3rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.axis-item {
  display: grid;
  flex: 0 0 auto;
  width: 2.8rem;
  height: 2rem;
  place-items: center;
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  background: color-mix(in oklab, var(--accent) 12%, var(--surface-bg));
  font: 700 0.85rem var(--font-mono);
}

.axis-legend {
  display: grid;
  gap: 0.25rem;
  font-size: 0.72rem;
}

.axis-legend span::before {
  content: '';
  display: inline-block;
  width: 1.4rem;
  margin-inline-end: 0.4rem;
  vertical-align: middle;
}

.main-key::before { border-top: 2px solid var(--main-axis-color); }
.cross-key::before { border-top: 2px dashed var(--fg-dim); }

.axis-description,
.writing-context {
  margin: 0;
  font-size: 0.72rem;
  line-height: 1.35;
}

.writing-context { color: var(--fg-dim); }
</style>
