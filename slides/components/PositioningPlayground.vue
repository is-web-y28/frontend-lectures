<script setup>
import { ref, computed } from 'vue'

const position = ref('relative')
const showAncestor = ref(true)
const top = ref(0)
const left = ref(0)
const zIndex = ref(1)

const positions = [
  { id: 'static', label: 'static' },
  { id: 'relative', label: 'relative' },
  { id: 'absolute', label: 'absolute' },
  { id: 'fixed', label: 'fixed' },
  { id: 'sticky', label: 'sticky' },
]

const parentStyle = computed(() => ({
  position: showAncestor.value ? 'relative' : 'static',
  border: '2px dashed #94a3b8',
  borderRadius: '0.5rem',
  padding: '1rem',
  minHeight: position.value === 'sticky' ? '180px' : '200px',
  maxWidth: '100%',
  overflow: position.value === 'sticky' ? 'auto' : 'visible',
}))

const childStyle = computed(() => ({
  position: position.value,
  insetBlockStart: `${top.value}px`,
  insetInlineStart: `${left.value}px`,
  zIndex: zIndex.value,
}))

const generatedCode = computed(() => [
  `position: ${position.value};`,
  `inset-block-start: ${top.value}px;`,
  `inset-inline-start: ${left.value}px;`,
  `z-index: ${zIndex.value};`,
].join('\n'))

function toggleTop() {
  top.value = top.value === 0 ? 24 : 0
}

function toggleLeft() {
  left.value = left.value === 0 ? 32 : 0
}

function toggleZIndex() {
  zIndex.value = zIndex.value === 1 ? 10 : 1
}
</script>

<template>
  <div class="positioning-playground">
    <div class="controls">
      <div class="control-group">
        <label>position</label>
        <div class="button-row">
          <button v-for="item in positions" :key="item.id" :class="{ active: position === item.id }" @click="position = item.id">
            {{ item.label }}
          </button>
        </div>
      </div>

      <div class="control-group">
        <label>inset-block-start</label>
        <button @click="toggleTop" :class="{ active: top !== 0 }">
          {{ top === 0 ? '+24px' : '0' }}
        </button>
      </div>

      <div class="control-group">
        <label>inset-inline-start</label>
        <button @click="toggleLeft" :class="{ active: left !== 0 }">
          {{ left === 0 ? '+32px' : '0' }}
        </button>
      </div>

      <div class="control-group">
        <label>containing block</label>
        <button @click="showAncestor = !showAncestor" :class="{ active: showAncestor }">
          {{ showAncestor ? 'relative' : 'static' }}
        </button>
      </div>

      <div class="control-group">
        <label>z-index</label>
        <button @click="toggleZIndex" :class="{ active: zIndex > 1 }">
          {{ zIndex }}
        </button>
      </div>
    </div>

    <div :style="parentStyle" class="playground-area">
      <span v-if="showAncestor" class="ancestor-label">parent: relative</span>
      <div :style="childStyle" class="positioned-child">Child</div>
      <div v-if="position === 'sticky'" class="scroll-space">
        Прокрутите этот контейнер, чтобы увидеть поведение sticky.
      </div>
    </div>

    <code class="generated-code">{{ generatedCode }}</code>

    <p class="hint">
      {{ position === 'static' ? 'static — остаётся в потоке, смещения игнорируются.' :
         position === 'relative' ? 'relative — сохраняет место в потоке, смещение не влияет на соседей.' :
         position === 'absolute' ? 'absolute — выходит из потока, координаты считаются от containing block.' :
         position === 'fixed' ? 'fixed — обычно привязан к viewport и не движется при прокрутке.' :
         'sticky — начинает в потоке и прилипает при прокрутке контейнера.' }}
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

.ancestor-label {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
}

.scroll-space {
  min-height: 320px;
  padding-top: 12rem;
  color: #64748b;
  font-size: 0.75rem;
}

.generated-code {
  white-space: pre;
  background: #1e293b;
  color: #e2e8f0;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  line-height: 1.6;
}

.hint {
  font-size: 0.75rem;
  color: #64748b;
}
</style>
