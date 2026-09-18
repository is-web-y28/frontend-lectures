<script setup>
import { ref, computed } from 'vue'

const mode = ref('block')
const extraText = ref('')

const displayStyle = computed(() => ({
  display: mode.value === 'block' ? 'block' : mode.value === 'inline' ? 'inline' : 'inline-block',
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

function addText() {
  if (extraText.value) {
    extraText.value = ''
  } else {
    extraText.value = 'Это дополнительный текст, который показывает, как следующие элементы сдвигаются при увеличении размера предыдущего.'
  }
}
</script>

<template>
  <div class="normal-flow-demo">
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

      <div class="flow-document">
        <article class="flow-card">
          <strong>Карточка 1</strong>
          <p>Содержимое меняет высоту этой коробки.</p>
          <p v-if="extraText">{{ extraText }}</p>
        </article>
        <article class="flow-card">
          <strong>Карточка 2</strong>
          <p>Следующий элемент остаётся после предыдущего.</p>
        </article>
        <article class="flow-card">
          <strong>Карточка 3</strong>
          <p>Нормальный поток учитывает размер содержимого.</p>
        </article>
      </div>
    </div>

    <button class="add-text-btn" @click="addText">
      {{ extraText ? 'Убрать текст' : '+ Добавить текст' }}
    </button>

    <p class="hint">
      Блок занимает всю строку; <code>inline</code> остаётся в строке текста;
      <code>inline-block</code> — в строке, но с размерами.
    </p>
  </div>
</template>

<style scoped>
.normal-flow-demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: inherit;
}

.controls {
  display: flex;
  gap: 0.5rem;
}

.controls button {
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

.content-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  min-height: 4rem;
}

.flow-document {
  display: block;
}

.flow-card {
  display: block;
  margin-top: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: white;
}

.flow-card p {
  margin: 0.35rem 0 0;
}

.tag {
  transition: display 0.15s ease;
}

.add-text-btn {
  padding: 0.375rem 0.75rem;
  border: 1px solid #94a3b8;
  border-radius: 0.375rem;
  background: white;
  color: #475569;
  font-size: 0.875rem;
  cursor: pointer;
}

.hint {
  font-size: 0.75rem;
  color: #64748b;
}
</style>
