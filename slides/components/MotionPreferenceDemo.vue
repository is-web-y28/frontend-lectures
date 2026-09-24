<script setup>
import { ref } from "vue";

const props = defineProps({
  initialReduced: {
    type: Boolean,
    default: false,
  },
});

const reduced = ref(props.initialReduced);
const noticeVisible = ref(false);
const noticeKey = ref(0);

function showNotice() {
  noticeVisible.value = true;
  noticeKey.value += 1;
}
</script>

<template>
  <section
    class="motion-demo"
    :class="{ reduced }"
    aria-label="Демонстрация обычного и reduced-motion режимов"
  >
    <div class="controls">
      <span class="controls-label">Предпочтение движения</span>
      <button
        type="button"
        :class="{ active: !reduced }"
        :aria-pressed="!reduced"
        @click="reduced = false"
      >
        Обычное
      </button>
      <button
        type="button"
        :class="{ active: reduced }"
        :aria-pressed="reduced"
        @click="reduced = true"
      >
        Меньше движения
      </button>
      <button type="button" class="show-notice" @click="showNotice">
        Показать уведомление
      </button>
    </div>

    <div class="preview">
      <article class="event-card">
        <p class="eyebrow">Интерактивная карточка</p>
        <h3>Modern CSS: условия интерфейса</h3>
        <p>
          Наведите указатель или перейдите по Tab к ссылке: состояние остаётся
          заметным в обоих режимах.
        </p>
        <a href="#registration">Зарегистрироваться</a>
      </article>

      <p v-if="noticeVisible" :key="noticeKey" class="notice" role="status">
        <strong>Сохранено.</strong> Регистрация доступна в личном кабинете.
      </p>
    </div>

    <p class="hint">
      {{
        reduced
          ? "Декоративные transition и animation выключены; содержание и фокус сохранены."
          : "Эффект дополняет уже понятное интерактивное состояние."
      }}
    </p>
  </section>
</template>

<style scoped>
.motion-demo {
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

button.active,
.show-notice {
  border-color: var(--accent);
  background: color-mix(in oklab, var(--accent) 12%, var(--surface-bg));
  color: var(--accent-deep, var(--accent));
}

.preview {
  display: grid;
  gap: 0.7rem;
  max-width: 38rem;
  margin-inline: auto;
}

.event-card,
.notice {
  border: var(--surface-border);
  border-radius: 0.6rem;
  background: var(--surface-bg);
  padding: 0.9rem;
}

.event-card {
  transition:
    box-shadow 180ms ease,
    transform 180ms ease;
}

.event-card:hover,
.event-card:focus-within {
  box-shadow: 0 1rem 2rem color-mix(in srgb, var(--fg) 14%, transparent);
  transform: translateY(-0.25rem);
}

.event-card h3,
.event-card p {
  margin: 0;
}

.event-card h3 {
  font-size: 1.05rem;
}

.event-card > p:not(.eyebrow) {
  margin-top: 0.5rem;
  color: var(--fg-dim);
  font-size: 0.84rem;
}

.event-card a {
  display: inline-block;
  margin-top: 0.7rem;
  border-radius: 0.3rem;
  color: var(--accent-deep, var(--accent));
  font-weight: 700;
  outline-offset: 0.2rem;
}

.notice {
  border-color: var(--good);
  background: color-mix(in oklab, var(--good) 11%, var(--surface-bg));
  animation: reveal 240ms ease-out both;
  font-size: 0.86rem;
}

.hint {
  margin: 0;
}

.reduced .event-card,
.reduced .notice {
  animation: none;
  transition: none;
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
