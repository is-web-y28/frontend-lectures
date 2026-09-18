<script setup lang="ts">
import { computed, ref } from 'vue'
import HighlightedCode from './HighlightedCode.vue'

type PropertyExample = {
  id: 'color' | 'font-size' | 'background' | 'border' | 'padding'
  label: string
  selector: string
  declaration: string
  explanation: string
}

const examples: PropertyExample[] = [
  {
    id: 'color',
    label: 'color',
    selector: '.meetup-card h2',
    declaration: 'color: #075985;',
    explanation: 'Меняет цвет текста заголовка.',
  },
  {
    id: 'font-size',
    label: 'font-size',
    selector: '.meetup-card h2',
    declaration: 'font-size: 2rem;',
    explanation: 'Меняет размер текста заголовка.',
  },
  {
    id: 'background',
    label: 'background',
    selector: '.meetup-card',
    declaration: 'background: #e0f2fe;',
    explanation: 'Меняет только фон карточки.',
  },
  {
    id: 'border',
    label: 'border',
    selector: '.meetup-card',
    declaration: 'border: 3px solid #0c4a6e;',
    explanation: 'Меняет только границу карточки.',
  },
  {
    id: 'padding',
    label: 'padding',
    selector: '.meetup-card',
    declaration: 'padding: 2.25rem;',
    explanation: 'Меняет только пространство между границей и содержимым.',
  },
]

const selectedId = ref<PropertyExample['id']>('background')
const showDeclaration = ref(true)
const selected = computed(() => examples.find((example) => example.id === selectedId.value) ?? examples[0])
const displayedCode = computed(() => `/* базовые стили карточки уже существуют */
${selected.value.selector} {
  ${selected.value.declaration}
}`)
const cardStyle = computed(() => ({
  background: showDeclaration.value && selectedId.value === 'background' ? '#e0f2fe' : '#ffffff',
  border: showDeclaration.value && selectedId.value === 'border' ? '3px solid #0c4a6e' : '1px solid #cbd5e1',
  padding: showDeclaration.value && selectedId.value === 'padding' ? '2.25rem' : '1rem',
}))
const titleStyle = computed(() => ({
  color: showDeclaration.value && selectedId.value === 'color' ? '#075985' : '#172033',
  fontSize: showDeclaration.value && selectedId.value === 'font-size' ? '2rem' : '1.35rem',
}))
</script>

<template>
  <section class="property-preview" aria-label="Визуальные примеры CSS-свойств">
    <div class="preview-stage">
      <p class="eyebrow">HTML остаётся тем же</p>
      <p class="baseline">Базовый вид уже задан: рамка 1px, padding 1rem, обычные цвет и размер заголовка.</p>
      <article class="meetup-card" :style="cardStyle">
        <p class="date">17 сентября · 19:00</p>
        <h2 :style="titleStyle">Frontend Meetup</h2>
        <p>Одна карточка показывает, за что отвечает выбранное свойство.</p>
        <a href="#program">Открыть программу</a>
      </article>
    </div>

    <div class="property-controls">
      <p class="eyebrow">Одна декларация поверх базового вида</p>
      <div class="property-list" role="group" aria-label="CSS-свойства">
        <button
          v-for="example in examples"
          :key="example.id"
          type="button"
          class="property-button"
          :class="{ selected: selectedId === example.id }"
          :aria-pressed="selectedId === example.id"
          @click="selectedId = example.id"
        >
          {{ example.label }}
        </button>
      </div>
      <div class="mode-controls" role="group" aria-label="Показ результата">
        <button type="button" class="mode-button" :class="{ selected: !showDeclaration }" :aria-pressed="!showDeclaration" @click="showDeclaration = false">Базовый вид</button>
        <button type="button" class="mode-button" :class="{ selected: showDeclaration }" :aria-pressed="showDeclaration" @click="showDeclaration = true">С декларацией</button>
      </div>

      <HighlightedCode :code="displayedCode" lang="css" />
      <p class="explanation" role="status" aria-live="polite">{{ showDeclaration ? selected.explanation : 'Показан только базовый вид: выбранная декларация временно выключена.' }}</p>
    </div>
  </section>
</template>

<style scoped>
.property-preview {
  align-items: stretch;
  display: grid;
  flex: 1;
  gap: 1rem;
  grid-template-columns: 1.05fr 0.95fr;
  min-height: 0;
  width: 100%;
}

.preview-stage,
.property-controls {
  background: var(--lecture-surface);
  border: 1px solid var(--lecture-border);
  border-radius: 0.5rem;
  padding: 1rem;
}

.eyebrow {
  color: var(--lecture-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin: 0 0 0.75rem;
  text-transform: uppercase;
}

.baseline {
  color: var(--lecture-muted);
  font-size: 0.76rem;
  line-height: 1.35;
  margin: -0.35rem 0 0.75rem;
}

.meetup-card {
  border-radius: 0.5rem;
  box-sizing: border-box;
  color: #172033;
  min-height: 12rem;
  transition: background 180ms ease, border-width 180ms ease, padding 180ms ease;
}

.meetup-card h2 {
  line-height: 1.1;
  margin: 0.35rem 0 0.75rem;
  transition: color 180ms ease, font-size 180ms ease;
}

.meetup-card p {
  font-size: 0.82rem;
  line-height: 1.45;
  margin: 0 0 0.75rem;
}

.meetup-card .date {
  color: #475569;
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 0;
}

.meetup-card a {
  color: #0369a1;
  font-size: 0.82rem;
  font-weight: 700;
}

.property-list,
.mode-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.property-list {
  margin-bottom: 0.7rem;
}

.mode-controls {
  border-top: 1px solid var(--lecture-border);
  margin-bottom: 0.8rem;
  padding-top: 0.7rem;
}

.property-button,
.mode-button {
  background: transparent;
  border: 1px solid var(--lecture-border);
  border-radius: 999px;
  color: var(--lecture-ink);
  cursor: pointer;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.72rem;
  padding: 0.3rem 0.55rem;
}

.property-button:hover,
.property-button:focus-visible,
.mode-button:hover,
.mode-button:focus-visible {
  outline: 3px solid #075985;
  outline-offset: 1px;
}

.property-button.selected,
.mode-button.selected {
  background: var(--lecture-accent-soft);
  border-color: var(--lecture-accent);
  color: var(--lecture-accent);
  font-weight: 700;
}


.explanation {
  color: var(--lecture-muted);
  font-size: 0.82rem;
  line-height: 1.35;
  margin: 0.75rem 0 0;
}
</style>
