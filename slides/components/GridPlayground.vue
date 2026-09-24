<script setup>
import { ref, computed } from 'vue'

const columnCount = ref(3)
const gap = ref(8)
const isColumn = ref(false)
const items = ref(Array.from({ length: 6 }, (_, i) => `Item ${i + 1}`))

const columnsCSS = computed(() => Array(columnCount.value).fill('1fr').join(' '))

function updateColumns(count) {
  columnCount.value = count
}

function addGridCard() {
  if (items.value.length < 8) items.value.push(`Item ${items.value.length + 1}`)
}

function removeGridCard() {
  if (items.value.length > 1) items.value.pop()
}

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
        <div class="button-row">
          <button @click="addGridCard" :disabled="items.length >= 8">+ карточка</button>
          <button @click="removeGridCard" :disabled="items.length <= 1">− карточка</button>
        </div>
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
      grid-column: {{ isColumn ? 'span 2' : 'auto' }};
    </code>
  </div>
</template>

<style scoped>
.grid-playground {
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 0.55rem;
  overflow: hidden;
}

.controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.45rem;
}

.control-group {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.2rem;
}

.control-group label {
  color: #64748b;
  font-size: 0.7rem;
}

.button-row {
  display: flex;
  gap: 0.25rem;
}

.control-group button {
  box-sizing: border-box;
  min-width: 0;
  padding: 0.25rem 0.4rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  color: #0f172a;
  font-size: 0.75rem;
}

.control-group button.active {
  background: #0284c7;
  color: white;
  border-color: #0284c7;
}

.playground-area {
  min-height: 84px;
  max-height: 148px;
  overflow: auto;
}

.grid-item {
  min-width: 0;
  overflow-wrap: anywhere;
  background: #dcfce7;
  border: 1px solid #86efac;
  color: #14532d;
  padding: 0.55rem;
  border-radius: 0.375rem;
  text-align: center;
  font-size: 0.75rem;
}

.grid-item.span2 {
  grid-column: span 2;
  background: #fde68a;
  border-color: #fbbf24;
  color: #78350f;
}

.generated-code {
  max-height: 78px;
  margin: 0;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  background: #1e293b;
  color: #e2e8f0;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.7rem;
  line-height: 1.35;
}
</style>
