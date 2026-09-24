<script setup>
import { ref } from "vue";

const props = defineProps({
  initialMode: {
    type: String,
    default: "narrow",
  },
});

const mode = ref(props.initialMode);

const modes = [
  { id: "narrow", label: "Узко" },
  { id: "wide", label: "Широко" },
  { id: "zoom", label: "Крупный текст" },
];
</script>

<template>
  <section
    class="responsive-demo"
    aria-label="Демонстрация доступного пространства"
  >
    <div class="controls" aria-label="Режим доступного пространства">
      <span class="controls-label">Доступное пространство</span>
      <button
        v-for="item in modes"
        :key="item.id"
        type="button"
        :class="{ active: mode === item.id }"
        :aria-pressed="mode === item.id"
        @click="mode = item.id"
      >
        {{ item.label }}
      </button>
    </div>

    <div class="viewport" :class="`mode-${mode}`">
      <p class="viewport-label">
        {{
          mode === "narrow"
            ? "узкая область"
            : mode === "wide"
              ? "достаточная ширина"
              : "узко + увеличенный текст"
        }}
      </p>

      <section class="schedule" aria-label="Программа и регистрация">
        <div class="program">
          <p class="eyebrow">Программа</p>
          <div class="cards">
            <article class="event-card">
              <strong>CSS Layout</strong>
              <span>18:00 · Основной зал</span>
            </article>
            <article class="event-card">
              <strong>Modern CSS</strong>
              <span>19:00 · Основной зал</span>
            </article>
          </div>
        </div>

        <aside class="registration">
          <p class="eyebrow">Регистрация</p>
          <p>
            Билет бесплатный. Оставьте контакты, чтобы получить напоминание.
          </p>
          <div class="actions">
            <button type="button">Участвовать</button>
            <button type="button" class="secondary">Программа</button>
          </div>
        </aside>
      </section>
    </div>

    <p class="hint">
      Ищем момент, когда текст, карточки или действия перестают иметь полезную
      ширину.
    </p>
  </section>
</template>

<style scoped>
.responsive-demo {
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
  align-items: center;
  gap: 0.45rem;
}

.controls-label,
.viewport-label,
.eyebrow,
.hint {
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
  padding: 0.3rem 0.55rem;
}

.controls button.active,
.actions button:first-child {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--on-accent, white);
}

.viewport {
  box-sizing: border-box;
  width: min(100%, 46rem);
  margin-inline: auto;
  border: 2px dashed color-mix(in oklab, var(--accent) 48%, var(--fg-dim));
  border-radius: 0.65rem;
  background: color-mix(in oklab, var(--surface-bg) 94%, var(--accent));
  padding: 0.65rem;
  transition:
    inline-size 180ms ease,
    font-size 180ms ease;
}

.viewport.mode-narrow,
.viewport.mode-zoom {
  width: min(100%, 25rem);
}

.viewport.mode-zoom {
  font-size: 1.14em;
}

.viewport-label,
.eyebrow {
  margin: 0 0 0.45rem;
}

.schedule {
  display: grid;
  gap: 0.65rem;
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
  padding: 0.65rem;
}

.cards {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
}

.event-card {
  display: grid;
  gap: 0.22rem;
  min-width: 0;
  padding: 0.6rem;
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
  gap: 0.45rem;
  margin-top: 0.7rem;
}

.mode-wide .actions {
  flex-direction: row;
  flex-wrap: wrap;
}

.actions .secondary {
  background: color-mix(in oklab, var(--accent) 8%, var(--surface-bg));
  color: var(--accent-deep, var(--accent));
}

.hint {
  margin: 0;
}

@media (prefers-reduced-motion: reduce) {
  .viewport {
    transition: none;
  }
}
</style>
