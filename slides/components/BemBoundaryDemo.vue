<script setup lang="ts">
import { computed, ref } from 'vue'
import HighlightedCode from './HighlightedCode.vue'

const useBroadSelector = ref(true)
const featured = ref(false)
const movedToAside = ref(false)

const strategyCode = computed(() => {
  const selector = useBroadSelector.value ? '.agenda .card' : '.event-card'
  const rule = useBroadSelector.value
    ? `/* Зависит от места: только карточка в main */
${selector} {
  border-color: var(--accent);
  background: color-mix(in oklab, var(--accent) 12%, var(--surface-bg));
}`
    : `/* Роль компонента: работает в любом контейнере */
${selector} {
  border-color: var(--accent);
  background: color-mix(in oklab, var(--accent) 12%, var(--surface-bg));
}`

  return featured.value
    ? `${rule}

.event-card--featured {
  box-shadow: inset 0.28rem 0 var(--accent);
}`
    : rule
})

const observation = computed(() => {
  if (useBroadSelector.value && movedToAside.value) {
    return '«Каскад» переехал в aside и потерял оформление: широкий селектор привязан к .agenda.'
  }
  if (useBroadSelector.value) {
    return 'Обе карточки события пока находятся внутри .agenda, поэтому широкий селектор выглядит правдоподобно.'
  }
  return 'Класс .event-card описывает роль. Перемещение между main и aside не меняет базовое оформление.'
})
</script>

<template>
  <section class="bem-boundary-demo" aria-label="Демонстрация границ BEM-компонента">
    <header class="demo-header">
      <div>
        <p class="eyebrow">Граница компонента</p>
        <h3>Роль не должна зависеть от родителя</h3>
      </div>
      <div class="controls" aria-label="Управление демонстрацией BEM">
        <button
          type="button"
          :class="{ selected: useBroadSelector }"
          :aria-pressed="useBroadSelector"
          @click="useBroadSelector = true"
        >
          Широкий: .agenda .card
        </button>
        <button
          type="button"
          :class="{ selected: !useBroadSelector }"
          :aria-pressed="!useBroadSelector"
          @click="useBroadSelector = false"
        >
          BEM: .event-card
        </button>
        <button
          type="button"
          :class="{ selected: featured }"
          :aria-pressed="featured"
          @click="featured = !featured"
        >
          {{ featured ? 'Убрать --featured' : 'Включить --featured' }}
        </button>
        <button type="button" @click="movedToAside = !movedToAside">
          {{ movedToAside ? 'Вернуть «Каскад» в main' : 'Переместить «Каскад» в aside' }}
        </button>
      </div>
    </header>

    <div class="demo-grid">
      <div
        class="site-preview"
        :class="useBroadSelector ? 'strategy-broad' : 'strategy-bem'"
        aria-label="Макет мероприятия с main и aside"
      >
        <main class="agenda" aria-label="Основная программа">
          <p class="container-label">main .agenda</p>
          <article v-if="!movedToAside" class="card event-card" :class="{ 'event-card--featured': featured }">
            <span class="card-kind">event-card</span>
            <strong>Каскад без сюрпризов</strong>
            <small>18:00 · зал «Код»</small>
          </article>
          <article class="card event-card">
            <span class="card-kind">event-card</span>
            <strong>Слои и сборка CSS</strong>
            <small>19:00 · зал «Код»</small>
          </article>
        </main>

        <aside class="sidebar" aria-label="Боковая колонка">
          <p class="container-label">aside .sidebar</p>
          <article v-if="movedToAside" class="card event-card" :class="{ 'event-card--featured': featured }">
            <span class="card-kind">event-card</span>
            <strong>Каскад без сюрпризов</strong>
            <small>18:00 · зал «Код»</small>
          </article>
          <article class="card registration-card">
            <span class="card-kind">registration-card</span>
            <strong>Регистрация</strong>
            <small>Билет и напоминание</small>
            <button type="button" class="registration-action">Записаться</button>
          </article>
        </aside>
      </div>

      <div class="code-panel">
        <p class="panel-label">{{ useBroadSelector ? 'Правило зависит от контекста' : 'Правило описывает блок' }}</p>
        <HighlightedCode :code="strategyCode" lang="css" />
        <p class="observation" aria-live="polite">{{ observation }}</p>
        <p class="legend"><code>.event-card--featured</code> — модификатор одного блока, а не новый контекст.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bem-boundary-demo {
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
.panel-label,
.container-label {
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
  max-width: 43rem;
}

.controls button,
.registration-action {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 999px;
  color: var(--fg);
  cursor: pointer;
  font: inherit;
  font-size: 0.64rem;
  padding: 0.3rem 0.48rem;
}

.controls button.selected {
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
  grid-template-columns: minmax(20rem, 1.15fr) minmax(16rem, 0.85fr);
  min-height: 0;
}

.site-preview,
.code-panel {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 0.65rem;
  min-height: 0;
  padding: 0.65rem;
}

.site-preview {
  display: grid;
  gap: 0.55rem;
  grid-template-columns: minmax(0, 1.2fr) minmax(8rem, 0.8fr);
}

.agenda,
.sidebar {
  border: 1px dashed color-mix(in oklab, var(--border) 60%, var(--fg-dim));
  border-radius: 0.45rem;
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
  min-width: 0;
  padding: 0.48rem;
}

.sidebar {
  background: color-mix(in oklab, var(--fg) 3%, var(--surface-bg));
}

.card {
  border: 1px solid var(--border);
  border-radius: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.12rem;
  min-height: 0;
  padding: 0.45rem;
}

.card-kind {
  color: var(--fg-dim);
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 0.55rem;
}

.card strong {
  color: var(--fg);
  font-size: 0.7rem;
  line-height: 1.2;
}

.card small {
  color: var(--fg-dim);
  font-size: 0.59rem;
}

.strategy-broad .agenda .card {
  background: color-mix(in oklab, var(--accent) 12%, var(--surface-bg));
  border-color: var(--accent);
}

.strategy-bem .event-card {
  background: color-mix(in oklab, var(--accent) 12%, var(--surface-bg));
  border-color: var(--accent);
}

.event-card--featured {
  box-shadow: inset 0.28rem 0 var(--accent);
}

.registration-card {
  background: color-mix(in oklab, var(--good, var(--accent)) 9%, var(--surface-bg));
}

.registration-action {
  align-self: start;
  border-color: var(--good, var(--accent));
  font-size: 0.56rem;
  margin-top: 0.22rem;
}

.code-panel {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  overflow: hidden;
}

.code-panel :deep(pre) {
  font-size: 0.59rem;
  line-height: 1.35;
  margin: 0;
  overflow: auto;
}

.observation,
.legend {
  color: var(--fg-dim);
  font-size: 0.68rem;
  line-height: 1.35;
  margin: 0;
}

.observation {
  border-inline-start: 0.2rem solid var(--accent);
  margin-top: auto;
  padding-inline-start: 0.45rem;
}

.legend code {
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
