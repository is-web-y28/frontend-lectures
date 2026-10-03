<script setup>
import { ref } from "vue";

const hasContainer = ref(false);
</script>

<template>
  <section class="supports-demo" aria-label="Базовая версия и улучшение через supports">
    <div class="controls">
      <button
        type="button"
        :aria-pressed="!hasContainer"
        :class="{ active: !hasContainer }"
        @click="hasContainer = false"
      >
        Базовая версия
      </button>
      <button
        type="button"
        :aria-pressed="hasContainer"
        :class="{ active: hasContainer }"
        @click="hasContainer = true"
      >
        Контейнер объявлен
      </button>
    </div>

    <article class="feature-card" :class="{ 'has-container': hasContainer }">
      <div class="feature-card__body">
        <div class="poster" aria-hidden="true">CSS</div>
        <div>
          <p class="eyebrow">Событие</p>
          <h3>Контейнерные запросы</h3>
          <p>Базовая карточка читается в одну колонку. При доступном улучшении изображение и текст становятся рядом.</p>
        </div>
      </div>
    </article>

    <p class="observation">
      <strong>{{ hasContainer ? "Улучшение:" : "База:" }}</strong>
      {{ hasContainer
        ? "в поддерживающем браузере запрос проверяет ширину карточки: от 24rem доступны две колонки."
        : "контейнер не объявлен, поэтому запрос не совпадает и остаётся исходная одна колонка." }}
    </p>
  </section>
</template>

<style scoped>
.supports-demo {
  display: grid;
  flex: 1;
  min-height: 0;
  align-content: center;
  gap: 0.7rem;
  color: var(--fg);
  font-size: 0.9rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

button {
  border: var(--surface-border);
  border-radius: 0.35rem;
  background: var(--surface-bg);
  color: var(--fg);
  cursor: pointer;
  font: inherit;
  padding: 0.32rem 0.55rem;
}

button.active {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--on-accent, white);
}

button:focus-visible {
  outline: 0.18rem solid var(--accent);
  outline-offset: 0.16rem;
}

.feature-card {
  box-sizing: border-box;
  width: min(100%, 42rem);
  max-width: 100%;
  border: var(--surface-border);
  border-radius: 0.65rem;
  background: var(--surface-bg);
  padding: 0.65rem;
}

.feature-card__body {
  display: grid;
  gap: 0.65rem;
  align-items: center;
}

.poster {
  display: grid;
  min-block-size: 5rem;
  place-items: center;
  border-radius: 0.4rem;
  background: color-mix(in oklab, var(--accent) 18%, var(--surface-bg));
  color: var(--accent-deep, var(--accent));
  font-weight: 800;
  letter-spacing: 0.08em;
}

.eyebrow,
h3,
p {
  margin: 0;
}

.eyebrow,
.feature-card p:not(.eyebrow) {
  color: var(--fg-dim);
}

.eyebrow {
  font-size: 0.72em;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

h3 {
  font-size: 1.15em;
}

.observation {
  border-inline-start: 0.2rem solid var(--accent);
  background: color-mix(in oklab, var(--accent) 8%, var(--surface-bg));
  color: var(--fg-dim);
  font-size: 0.84em;
  line-height: 1.4;
  padding: 0.4rem 0.5rem;
}

.observation strong {
  color: var(--fg);
}

@supports (container-type: inline-size) {
  .feature-card.has-container {
    container-type: inline-size;
  }

  @container (min-width: 24rem) {
    .feature-card__body {
      grid-template-columns: 8rem minmax(0, 1fr);
    }
  }
}
</style>
