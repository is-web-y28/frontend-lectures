<script setup>
import { ref, computed } from 'vue'

const direction = ref('row')
const justify = ref('flex-start')
const align = ref('stretch')
const wrap = ref('nowrap')
const gap = ref('0')

const items = [
  { label: 'Element A', text: 'Short' },
  { label: 'Item B (longer)', text: 'This element has longer text to test grow' },
  { label: 'C', text: 'C' },
]

const flexStyle = computed(() => ({
  display: 'flex',
  flexDirection: direction.value,
  justifyContent: justify.value,
  alignItems: align.value,
  flexWrap: wrap.value,
  gap: `${gap.value}px`,
  border: '2px dashed #94a3b8',
  borderRadius: '0.5rem',
  padding: '1rem',
  minHeight: direction.value === 'column' ? '200px' : '120px',
  maxWidth: '100%',
}))

const gapOptions = [0, 4, 8, 16]
const itemsPerRow = ref(3)

function addItem() {
  if (itemsPerRow.value < 6) itemsPerRow.value++
}

function removeItem() {
  if (itemsPerRow.value > 2) itemsPerRow.value--
}
</script>

<template>
  <div class="flex-playground">
    <div class="controls">
      <div class="control-group">
        <label>flex-direction</label>
        <select v-model="direction">
          <option value="row">row</option>
          <option value="column">column</option>
        </select>
      </div>

      <div class="control-group">
        <label>justify-content</label>
        <select v-model="justify">
          <option value="flex-start">flex-start</option>
          <option value="center">center</option>
          <option value="space-between">space-between</option>
          <option value="space-around">space-around</option>
          <option value="space-evenly">space-evenly</option>
        </select>
      </div>

      <div class="control-group">
        <label>align-items</label>
        <select v-model="align">
          <option value="stretch">stretch</option>
          <option value="flex-start">flex-start</option>
          <option value="center">center</option>
          <option value="flex-end">flex-end</option>
        </select>
      </div>

      <div class="control-group">
        <label>flex-wrap</label>
        <select v-model="wrap">
          <option value="nowrap">nowrap</option>
          <option value="wrap">wrap</option>
        </select>
      </div>

      <div class="control-group">
        <label>gap (px)</label>
        <select v-model.number="gap">
          <option v-for="g in gapOptions" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>

      <div class="control-group">
        <label>элементы</label>
        <button @click="addItem" :disabled="itemsPerRow >= 6">+1</button>
        <button @click="removeItem" :disabled="itemsPerRow <= 2">-1</button>
      </div>
    </div>

    <div :style="flexStyle" class="playground-area">
      <div v-for="i in itemsPerRow" :key="i" class="flex-item">
        {{ items[i - 1]?.text || `Element ${i}` }}
      </div>
    </div>

    <code class="generated-code">
      display: flex;
      flex-direction: {{ direction }};
      justify-content: {{ justify }};
      align-items: {{ align }};
      flex-wrap: {{ wrap }};
      gap: {{ gap }}px;
    </code>
  </div>
</template>

<style scoped>
.flex-playground {
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

.control-group select,
.control-group button {
  padding: 0.25rem 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.playground-area {
  transition: all 0.2s ease;
}

.flex-item {
  background: #e0f2fe;
  border: 1px solid #7dd3fc;
  color: #0c4a6e;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  text-align: center;
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
