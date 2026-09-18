<script setup>
import { ref, computed } from 'vue'

const position = ref('relative')
const showAncestor = ref(true)
const top = ref(0)
const left = ref(0)

const parentStyle = computed(() => {
  const base = {
    position: showAncestor.value ? 'relative' : 'static',
    border: '2px dashed #94a3b8',
    borderRadius: '0.5rem',
    padding: '1rem',
    minHeight: '240px',
    maxWidth: '100%',
    positionRelative: showAncestor.value ? 'relative' : 'static',
  }
  return base
})

const childStyle = computed(() => ({
  position: position.value,
  top: `${top.value}px`,
  left: `${left.value}px`,
}))

const positions = [
  { id: 'static', label: 'static' },
  { id: 'relative', label: 'relative' },
  { id: 'absolute', label: 'absolute' },
]

function animatePosition() {
  top.value = top.value === 0 ? 24 : 0
}

function animateLeft() {
  left.value = left.value === 0 ? 32 : 0
}
</script>

<template>
  <div class="positioning-playground">
    <div class="controls">
      <div class="control-group">
        <label>position</label>
        <div class="button-row">
          <button v-for="p in positions" :key="p.id" :class="{ active: position === p.id }" @click="position = p.id">
            {{ p.label }}
          </button>
        </div>
      </div>

      <div class="control-group">
        <label>top</label>
        <button @click="animatePosition" :class="{ active: top !== 0 }">
          {{ top === 0 ? '+24px' : '−24px' }}
        </button>
      </div>

      <div class="control-group">
        <label>left</label>
        <button @click="animateLeft" :class="{ active: left !== 0 }">
          {{ left === 0 ? '+32px' : '−32px' }}
        </button>
      </div>

      <div class="control-group">
        <label>Containing block</label>
        <button @click="showAncestor = !showAncestor" :class="{ active: showAncestor }">
          {{ showAncestor ? 'Включить' : 'Выключить' }}
        </button>
      </div>
    </div>

    <div :style="parentStyle" class="playground-area">
      <span v-if="showAncestor" class="ancestor-label">parent (relative)</span>
      <div :style="childStyle" class="positioned-child">Child</div>
    </div>

    <p class="hint">
      {{ position === 'static' ? 'static — стандартное положение в потоке, inset игнорируется.' :
         position === 'relative' ? 'relative — сохраняет место в потоке, визуальное смещение не влияет соседей.' :
         'absolute — выходит из потока. Координаты от ближайшего позиционированного предка.' }}
    </p>
  </div>
</template>

<style scoped>
.positioning-playground {
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
  position: relative;
  transition: all 0.2s ease;
}

.positioned-child {
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #991b1b;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
}

.positioned-child.absolute {
  /* position is set dynamically */
}

.ancestor-label {
  font-size: 0.75rem;
  color: #64748b;
}

.hint {
  font-size: 0.75rem;
  color: #64748b;
}
</style>
