<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'display',
  },
})

const mode = ref('block')
const extraText = ref('')

const displayStyle = computed(() => ({
  display: mode.value,
  backgroundColor: '#e0f2fe',
  border: '1px solid #7dd3fc',
  padding: mode.value === 'inline' ? '0 0.25rem' : '0.25rem 0.5rem',
  fontSize: '1rem',
  margin: mode.value === 'inline' ? '0' : '0.25rem 0',
}))

const items = [
  { id: 'block', label: 'display: block' },
  { id: 'inline', label: 'display: inline' },
  { id: 'inline-block', label: 'display: inline-block' },
]

function toggleMode(id) {
  mode.value = id
}

function toggleText() {
  extraText.value = extraText.value
    ? ''
    : 'Дополнительный текст увеличивает первую карточку; следующая остаётся после неё.'
}
</script>

<template>
  <div class="normal-flow-demo">
    <template v-if="props.variant === 'display'">
      <div class="controls">
        <button
          v-for="item in items"
          :key="item.id"
          :class="{ active: mode === item.id }"
          @click="toggleMode(item.id)"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="content-box">
        <p>
          Начало
          <span :style="displayStyle" class="tag">CSS</span>
          продолжение текста
        </p>
      </div>
    </template>

    <template v-else>
      <div class="flow-document">
        <article class="flow-card">
          <strong>Карточка 1</strong>
          <p>Содержимое определяет высоту коробки.</p>
          <p v-if="extraText">{{ extraText }}</p>
        </article>
        <article class="flow-card">
          <strong>Карточка 2</strong>
          <p>Следующий элемент занимает место после предыдущего.</p>
        </article>
      </div>

      <button class="add-text-btn" @click="toggleText">
        {{ extraText ? 'Убрать текст' : '+ Добавить текст в карточку 1' }}
      </button>

      <p class="hint">
        Это normal flow: изменение высоты первой карточки сдвигает вторую, а не накладывает её поверх.
      </p>
    </template>
  </div>
</template>

<style scoped>
.normal-flow-demo {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0;
  font-family: inherit;
  margin-top: 1rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.controls button,
.add-text-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #f8fafc;
  color: #475569;
  font-size: 0.875rem;
  cursor: pointer;
}

.controls button.active {
  background: #0284c7;
  color: white;
  border-color: #0284c7;
}

.content-box,
.flow-document {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
}

.content-box p,
.flow-card p {
  margin: 0.35rem 0 0;
}

.flow-document {
  display: grid;
  gap: 0.75rem;
}

.flow-card {
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: white;
}

.hint {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
}
</style>
