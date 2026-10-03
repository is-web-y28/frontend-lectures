<script setup>
import { computed, ref } from "vue";

const mode = ref("wide");

const modes = [
  { id: "wide", label: "Широко · 100%" },
  { id: "narrow", label: "Узко · 100%" },
  { id: "text-200", label: "Узко · текст 200%" },
];

const observation = computed(() => {
  if (mode.value === "wide") {
    return "Две смысловые зоны стоят рядом; расписание и регистрация остаются полностью доступны.";
  }
  if (mode.value === "narrow") {
    return "Зоны выстроены в документном порядке: программа, затем регистрация; содержимое не исчезает.";
  }
  return "Текст увеличен вдвое: базовая одна колонка и перенос строк сохраняют содержание и действия.";
});
</script>

<template>
  <section class="verification-demo" aria-label="Практическая проверка адаптивного интерфейса">
    <div class="controls" aria-label="Условия проверки">
      <span class="controls-label">Условие</span>
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

    <div class="verification-stage" tabindex="0" aria-label="Область проверки, прокручивается вертикально при увеличении текста" @keydown.stop>
    <div class="verification-shell" :class="`mode-${mode}`">
      <p class="shell-label">
        {{ mode === "wide" ? "широкая область" : "узкая область" }}
        <span v-if="mode === 'text-200'">· текст 200%</span>
      </p>

      <div class="schedule">
        <section class="program" aria-labelledby="verification-program-title">
          <p class="eyebrow">Программа</p>
          <h3 id="verification-program-title">Современный CSS</h3>
          <p>18:00 · основная сессия · полный текст описания остаётся в документе.</p>
        </section>

        <aside class="registration" aria-labelledby="verification-registration-title">
          <p class="eyebrow">Регистрация</p>
          <h3 id="verification-registration-title">Участие</h3>
          <p>Билет бесплатный. Напоминание придёт на почту.</p>
          <div class="actions" aria-label="Действия регистрации">
            <button type="button">Участвовать</button>
            <button type="button" class="secondary">Программа</button>
          </div>
        </aside>
      </div>

      <div class="table-scroll" tabindex="0" aria-label="Таблица сравнения, прокручивается горизонтально внутри области" @keydown.stop>
        <table>
          <caption>Широкая таблица: прокручивается только эта область</caption>
          <thead>
            <tr><th>Проверка</th><th>Ожидание</th><th>Наблюдение</th></tr>
          </thead>
          <tbody>
            <tr><td>Содержание</td><td>Не скрыто</td><td>Программа и регистрация на месте</td></tr>
          </tbody>
        </table>
      </div>

      <p class="observation"><strong>Наблюдение:</strong> {{ observation }}</p>
    </div>
    </div>

    <div class="contrast" aria-label="Измеренный контраст">
      <span><strong>Обычный текст</strong> #1F2933 / #FFF = 14.76:1 ≥ 4.5:1</span>
      <span><strong>Крупный текст</strong> #1F2933 / #FFF = 14.76:1 ≥ 3:1</span>
      <span><strong>Фокус, не текст</strong> #0F766E / #FFF = 5.47:1 ≥ 3:1</span>
    </div>
  </section>
</template>

<style scoped>
.verification-demo {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  flex: 1;
  min-height: 0;
  gap: 0.55rem;
  color: var(--fg);
  font-size: 0.82rem;
}

.controls,
.actions,
.contrast {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.controls-label,
.shell-label,
.eyebrow,
.contrast {
  color: var(--fg-dim);
  font-size: 0.78em;
}

.controls-label,
.eyebrow {
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
  padding: 0.28rem 0.48rem;
}

.controls button.active,
.actions button:first-child {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--on-accent, white);
}

button:focus-visible,
.table-scroll:focus-visible {
  outline: 0.18rem solid #0f766e;
  outline-offset: 0.16rem;
}

.verification-stage {
  min-height: 0;
  overflow: auto;
  padding: 0.25rem;
  background: #fff;
}

.verification-stage:focus-visible {
  outline: 0.18rem solid #0f766e;
  outline-offset: 0.16rem;
}

.verification-shell {
  box-sizing: border-box;
  display: grid;
  gap: 0.5rem;
  width: min(100%, 44rem);
  max-width: 100%;
  margin-inline: auto;
  border: 2px dashed color-mix(in oklab, var(--accent) 48%, var(--fg-dim));
  border-radius: 0.65rem;
  background: #fff;
  color: #1f2933;
  padding: 0.55rem;
}

.verification-shell.mode-narrow,
.verification-shell.mode-text-200 {
  width: min(100%, 22rem);
}

.verification-shell.mode-text-200 {
  font-size: 2em;
}

.shell-label,
.eyebrow,
h3,
.program p,
.registration p,
.observation {
  margin: 0;
}

.schedule {
  display: grid;
  gap: 0.5rem;
}

.mode-wide .schedule {
  grid-template-columns: minmax(0, 1.25fr) minmax(11rem, 0.75fr);
}

.program,
.registration {
  min-inline-size: 0;
  border: var(--surface-border);
  border-radius: 0.45rem;
  background: #fff;
  padding: 0.5rem;
}

h3 {
  font-size: 1.08em;
}

.program p:not(.eyebrow),
.registration p:not(.eyebrow) {
  color: #1f2933;
  font-size: 0.88em;
  overflow-wrap: anywhere;
}

.actions {
  margin-top: 0.45rem;
}

.actions .secondary {
  background: color-mix(in oklab, var(--accent) 8%, var(--surface-bg));
  color: var(--accent-deep, var(--accent));
}

.table-scroll {
  max-width: 100%;
  overflow-x: auto;
  border: var(--surface-border);
  border-radius: 0.35rem;
  background: #fff;
}

table {
  width: 100%;
  min-width: 34rem;
  border-collapse: collapse;
  text-align: start;
}

caption {
  caption-side: top;
  padding: 0.35rem 0.45rem;
  color: #1f2933;
  font-size: 0.78em;
  text-align: start;
}

th,
td {
  border-top: var(--surface-border);
  padding: 0.32rem 0.45rem;
  vertical-align: top;
}

th {
  color: inherit;
}

.observation {
  border-inline-start: 0.2rem solid var(--accent);
  background: color-mix(in oklab, var(--accent) 8%, var(--surface-bg));
  color: var(--fg-dim);
  font-size: 0.8em;
  line-height: 1.35;
  padding: 0.35rem 0.45rem;
}

.observation strong {
  color: var(--fg);
}

.contrast {
  justify-content: center;
  border: 1px solid #1f2933;
  background: #fff;
  color: #1f2933;
  line-height: 1.3;
  padding: 0.3rem 0.45rem;
}


.contrast span {
  border-inline-start: 1px solid color-mix(in oklab, var(--fg-dim) 35%, transparent);
  padding-inline-start: 0.4rem;
}

.contrast span:first-child {
  border-inline-start: 0;
}

.contrast strong {
  color: inherit;
}

@media (max-width: 32rem) {
  .controls,
  .contrast {
    align-items: flex-start;
    flex-direction: column;
  }

  .contrast span {
    border-inline-start: 0;
    padding-inline-start: 0;
  }
}
</style>
