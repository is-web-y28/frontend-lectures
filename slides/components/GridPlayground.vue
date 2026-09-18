<script setup>
import { ref, computed } from 'vue'

const columnCount = ref(3)
const gap = ref(8)
const addCard = ref(false)

const columnsCSS = computed(() => {
  const cols = Array(columnCount.value).fill('1fr').join(' ')
  return cols
})

const items = ref(Array.from({ length: columnCount.value + 1 }, (_, i) => `Item ${i + 1}`))
if (addCard.value) {
  items.value.push(`Item ${columnCount.value + 2}`)
}

function updateColumns(count) {
  columnCount.value = count
  items.value = Array.from({ length: count + 1 }, (_, i) => `Item ${i + 1}`)
}

const isColumn = ref(false)
</script>

<template>
  <div class="grid-playground">
    <div class="controls">
      <div class="control-group">
        <label>Колонки</label>
        <div class="button-row">
          <button v-for="n in 4" :key="n" :class="{ active: columnCount === n }" @click="updateColumns(n)">
            {{ n }}
          </button>
        </div>
      </div>

      <div class="control-group">
        <label>gap (px)</label>
        <div class="button-row">
          <button v-for="g in [0, 4, 8, 16]" :key="g" :class="{ active: gap === g }" @click="gap = g">
            {{ g }}
          </button>
        </div>
      </div>

      <div class="control-group">
        <label>Свойства</label>
        <button :class="{ active: isColumn }" @click="isColumn = !isColumn">
          grid-column: span 2
        </button>
      </div>
    </div>

    <div class="playground-area" :style="{ display: 'grid', gridTemplateColumns: columnsCSS, gap: `${gap}px` }">
      <div v-for="(item, index) in items" :key="index" class="grid-item" :class="{ span2: index === 0 && isColumn }">
        {{ item }}
      </div>
    </div>

    <code class="generated-code">
      display: grid;
      grid-template-columns: {{ columnsCSS }};
      gap: {{ gap }}px;
    </code>
  </div>
</template>

<style scoped>
.grid-playground {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.control-group label {
  font-size: 0.75rem;
  color: #64748b;
}

.button-row {
  display: flex;
  gap: 0.25rem;
}

.control-group button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: #f8fafc;
  color: #475569;
  font-size: 0.8125rem;
  cursor: pointer;
}

.control-group button.active {
  background: #0284c7;
  color: white;
  border-color: #0284c7;
}

.playground-area {
  min-height: 160px;
}

.grid-item {
  background: #dcfce7;
  border: 1px solid #86efac;
  color: #14532d;
  padding: 1rem;
  border-radius: 0.375rem;
  text-align: center;
  font-size: 0.875rem;
}

.grid-item.span2 {
  background: #fde68a;
  border-color: #fbbf24;
  color: #78350f;
}

.generated-code {
  background: #1e293b;
  color: #e2e8f0;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.6;
}
</style>
