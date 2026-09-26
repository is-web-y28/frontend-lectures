<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  initialMode: {
    type: String,
    default: "narrow",
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const mode = ref(props.initialMode);
const viewport = ref(null);
const manualWidth = ref(null);
const resizing = ref(false);
const dragStartX = ref(0);
const dragStartWidth = ref(0);
const dragScale = ref(1);

const MIN_WIDTH = 200;
const MAX_WIDTH = 736;
const LAYOUT_BREAKPOINT = 480;

const isWide = computed(() =>
  manualWidth.value === null
    ? mode.value === "wide"
    : manualWidth.value >= LAYOUT_BREAKPOINT,
);

const viewportWidth = computed(
  () =>
    manualWidth.value ??
    (mode.value === "wide" ? MAX_WIDTH : 25 * 16),
);

function selectMode(nextMode) {
  mode.value = nextMode;
  manualWidth.value = null;
}

function clampWidth(width) {
  const availableWidth = viewport.value?.parentElement?.clientWidth ?? MAX_WIDTH;
  return Math.round(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, availableWidth, width)));
}

function startResize(event) {
  const bounds = viewport.value?.getBoundingClientRect();
  const computedWidth = viewport.value
    ? Number.parseFloat(getComputedStyle(viewport.value).width)
    : Number.NaN;
  const width = Number.isFinite(computedWidth)
    ? computedWidth
    : viewportWidth.value;

  dragStartX.value = event.clientX;
  dragStartWidth.value = width;
  dragScale.value = bounds?.width ? width / bounds.width : 1;
  manualWidth.value = clampWidth(width);
  resizing.value = true;
  event.currentTarget.setPointerCapture(event.pointerId);
}

function resize(event) {
  if (!resizing.value) return;
  manualWidth.value = clampWidth(
    dragStartWidth.value +
      (event.clientX - dragStartX.value) * dragScale.value,
  );
}

function endResize(event) {
  if (!resizing.value) return;
  resizing.value = false;
  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
}

function adjustWidth(delta) {
  manualWidth.value = clampWidth(viewportWidth.value + delta);
}


const modes = [
  { id: "narrow", label: "Узко" },
  { id: "wide", label: "Широко" },
  { id: "zoom", label: "Крупный текст" },
];
</script>

<template>
  <section
    class="responsive-demo"
    :class="{ compact: props.compact }"
    aria-label="Демонстрация доступного пространства"
  >
    <div
      v-if="!props.compact"
      class="controls"
      aria-label="Режим доступного пространства"
    >
      <span class="controls-label">Доступное пространство</span>
      <button
        v-for="item in modes"
        :key="item.id"
        type="button"
        :class="{ active: manualWidth === null && mode === item.id }"
        :aria-pressed="manualWidth === null && mode === item.id"
        @click="selectMode(item.id)"
      >
        {{ item.label }}
      </button>
      <span class="resize-hint">Тяните маркер справа</span>
    </div>

    <div
      ref="viewport"
      class="viewport"
      :class="{
        'mode-narrow': !isWide && mode !== 'zoom',
        'mode-wide': isWide,
        'mode-zoom': mode === 'zoom',
        'is-resizing': resizing,
      }"
      :style="manualWidth === null ? undefined : { width: `${manualWidth}px` }"
    >
      <p class="viewport-label">
        {{
          manualWidth === null
            ? mode === "narrow"
              ? "узкая область"
              : mode === "wide"
                ? "достаточная ширина"
                : "узко + увеличенный текст"
            : `ручная ширина: ${manualWidth}px`
        }}
      </p>

      <section class="schedule" aria-label="Программа и регистрация">
        <div class="program">
          <p class="eyebrow">Программа</p>
          <div class="cards">
            <article class="event-card">
              <strong>Раскладка CSS</strong>
              <span>18:00 · Основной зал</span>
            </article>
          </div>
        </div>

        <aside class="registration">
          <p class="eyebrow">Регистрация</p>
          <p>Билет бесплатный. Пришлём напоминание.</p>
          <div class="actions">
            <button type="button">Участвовать</button>
            <button type="button" class="secondary">Программа</button>
          </div>
        </aside>
      </section>

      <p class="observation">
        <strong>Наблюдаем:</strong>
        {{
          manualWidth !== null
            ? isWide
              ? "появилось место для двух самостоятельных зон."
              : "смысл и действие читаются — точка смены раскладки пока не нужна."
            : mode === "narrow"
              ? "смысл и действие читаются — точка смены раскладки пока не нужна."
              : mode === "wide"
                ? "появилось место для двух самостоятельных зон."
                : "текст вырос — снова нужна одна колонка."
        }}
      </p>
      <div
        v-if="!props.compact"
        class="resize-handle"
        role="slider"
        tabindex="0"
        aria-label="Ширина области просмотра"
        title="Перетащите, чтобы изменить ширину."
        aria-orientation="horizontal"
        :aria-valuemin="MIN_WIDTH"
        :aria-valuemax="MAX_WIDTH"
        :aria-valuenow="viewportWidth"
        :aria-valuetext="`${viewportWidth} пикселей`"
        @pointerdown="startResize"
        @pointermove="resize"
        @pointerup="endResize"
        @pointercancel="endResize"
        @keydown.left.prevent="adjustWidth(-16)"
        @keydown.right.prevent="adjustWidth(16)"
        @keydown.home.prevent="manualWidth = MIN_WIDTH"
        @keydown.end.prevent="manualWidth = clampWidth(MAX_WIDTH)"
      ></div>
    </div>
  </section>
</template>

<style scoped>
.responsive-demo {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: 0.45rem;
  color: var(--fg);
  font-size: 0.92rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
}

.controls-label,
.viewport-label,
.eyebrow,
.resize-hint {
  color: var(--fg-dim);
  font-size: 0.74rem;
}

.controls-label {
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

button {
  border: var(--surface-border);
  border-radius: 0.35rem;
  background: var(--surface-bg);
  color: var(--fg);
  cursor: pointer;
  font: inherit;
  padding: 0.24rem 0.45rem;
}

.controls button.active,
.actions button:first-child {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--on-accent, white);
}

.resize-hint {
  margin-inline-start: auto;
}

.viewport {
  position: relative;
  box-sizing: border-box;
  display: grid;
  gap: 0.45rem;
  min-width: 0;
  max-width: 100%;
  width: min(100%, 46rem);
  margin-inline: auto;
  border: 2px dashed color-mix(in oklab, var(--accent) 48%, var(--fg-dim));
  border-radius: 0.65rem;
  background: color-mix(in oklab, var(--surface-bg) 94%, var(--accent));
  padding: 0.5rem;
  transition:
    inline-size 180ms ease,
    font-size 180ms ease;
}

.compact .viewport {
  width: 100%;
  margin-inline: 0;
  padding: 0.55rem;
}

.viewport.mode-narrow,
.viewport.mode-zoom {
  width: min(100%, 25rem);
}

.viewport.mode-zoom {
  font-size: 1.14em;
}

.compact .viewport.mode-narrow,
.compact .viewport.mode-zoom {
  width: 100%;
}

.viewport.is-resizing {
  transition: font-size 180ms ease;
}

.resize-handle {
  position: absolute;
  inset-block: 0.5rem;
  inset-inline-end: -0.7rem;
  width: 0.7rem;
  cursor: col-resize;
  touch-action: none;
}

.resize-handle::before {
  content: "";
  position: absolute;
  inset-block: 35%;
  inset-inline-start: 50%;
  width: 0.2rem;
  border-radius: 999px;
  background: var(--accent);
  opacity: 0.5;
  transform: translateX(-50%);
  transition: opacity 120ms ease;
}

.resize-handle:hover::before,
.resize-handle:focus-visible::before {
  opacity: 1;
}

.resize-handle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 0.15rem;
}

.viewport-label,
.eyebrow {
  margin: 0 0 0.3rem;
}

.observation {
  margin: 0;
  border-inline-start: 0.2rem solid var(--accent);
  background: color-mix(in oklab, var(--accent) 8%, var(--surface-bg));
  color: var(--fg-dim);
  font-size: 0.74em;
  line-height: 1.35;
  padding: 0.35rem 0.45rem;
}

.observation strong {
  color: var(--fg);
}

.compact .observation {
  font-size: 0.74em;
}

.schedule {
  display: grid;
  gap: 0.45rem;
}

.mode-wide .schedule {
  grid-template-columns: minmax(0, 1.35fr) minmax(12rem, 0.65fr);
}

.program,
.registration,
.event-card {
  border: var(--surface-border);
  border-radius: 0.45rem;
  background: var(--surface-bg);
}

.program,
.registration {
  padding: 0.5rem;
}

.cards {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
}

.event-card {
  display: grid;
  gap: 0.18rem;
  min-width: 0;
  padding: 0.45rem;
}

.event-card span,
.registration p {
  margin: 0;
  color: var(--fg-dim);
  font-size: 0.78em;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.45rem;
}

.mode-wide .actions {
  flex-direction: row;
  flex-wrap: wrap;
}

.actions .secondary {
  background: color-mix(in oklab, var(--accent) 8%, var(--surface-bg));
  color: var(--accent-deep, var(--accent));
}

.compact .event-card {
  padding: 0.45rem;
}

@media (prefers-reduced-motion: reduce) {
  .viewport {
    transition: none;
  }
}
</style>
