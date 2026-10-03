<script setup lang="ts">
import { computed, ref } from 'vue'
import HighlightedCode from './HighlightedCode.vue'

const hovered = ref(false)
const focused = ref(false)
const pressed = ref(false)

const state = computed(() => {
  if (pressed.value) return 'active — кнопка нажата прямо сейчас'
  if (focused.value) return 'focus — при переходе Tab браузер покажет focus-visible'
  if (hovered.value) return 'hover — указатель находится над кнопкой'
  return 'normal — обычное состояние'
})

const stateCode = `.demo-button { background: #075985; }
.demo-button:hover { background: #0c4a6e; }
.demo-button:focus-visible {
  outline: 3px solid #075985;
  outline-offset: 3px;
}
.demo-button:active { transform: translateY(1px); }
.demo-consent:checked { accent-color: #075985; }
.demo-closed:disabled { opacity: 0.55; }`
</script>

<template>
  <section class="state-demo" aria-label="Интерактивные и нативные состояния элементов">
    <div class="control-panel">
      <p class="eyebrow">Наведите, нажмите Tab, удерживайте Enter или пробел</p>
      <button
        class="demo-button"
        type="button"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
        @focus="focused = true"
        @blur="focused = false; pressed = false"
        @mousedown="pressed = true"
        @mouseup="pressed = false"
        @keydown.enter="pressed = true"
        @keyup.enter="pressed = false"
        @keydown.space="pressed = true"
        @keyup.space="pressed = false"
      >
        Открыть программу
      </button>
      <p class="state" role="status" aria-live="polite">Сейчас: {{ state }}</p>
      <p class="note">Нажатие не сохраняется: это временное состояние элемента, не состояние приложения.</p>

      <div class="native-states">
        <p class="eyebrow">Нативное состояние — без JavaScript</p>
        <div class="choice">
          <input id="css-state-consent" class="demo-consent" type="checkbox">
          <label for="css-state-consent">Получать напоминание о встрече</label>
        </div>
        <button class="demo-closed" type="button" disabled>Регистрация закрыта</button>
      </div>
    </div>

    <HighlightedCode :code="stateCode" lang="css" />
  </section>
</template>

<style scoped>
.state-demo {
  align-items: stretch;
  display: grid;
  flex: 1;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
  min-height: 0;
  width: 100%;
}

.control-panel {
  background: var(--lecture-surface);
  border: 1px solid var(--lecture-border);
  border-radius: 0.5rem;
  margin: 0;
  padding: 1.1rem;
}

.eyebrow {
  color: var(--lecture-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin: 0 0 1rem;
  text-transform: uppercase;
}

.demo-button {
  background: #075985;
  border: 1px solid #075985;
  border-radius: 0.35rem;
  color: #ffffff;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 0.75rem 1rem;
}

.demo-button:hover {
  background: #0c4a6e;
}

.demo-button:focus-visible {
  outline: 3px solid #075985;
  outline-offset: 3px;
}

.demo-button:active {
  transform: translateY(1px);
}

.state,
.note {
  font-size: 0.82rem;
  line-height: 1.4;
}

.state {
  color: var(--lecture-ink);
  font-weight: 700;
  margin: 1rem 0 0.4rem;
}

.note {
  color: var(--lecture-muted);
  margin: 0;
}

.native-states {
  border-top: 1px solid var(--lecture-border);
  margin-top: 1rem;
  padding-top: 1rem;
}

.native-states .eyebrow {
  margin-bottom: 0.5rem;
}

.choice {
  align-items: center;
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.demo-consent:checked {
  accent-color: #075985;
}

.demo-consent:checked + label {
  color: #075985;
  font-weight: 700;
}

.demo-closed:disabled {
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  border-radius: 0.35rem;
  color: #475569;
  cursor: not-allowed;
  font: inherit;
  opacity: 0.55;
  padding: 0.55rem 0.75rem;
}

</style>
