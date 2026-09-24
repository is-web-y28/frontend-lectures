<script setup>
import { ref, computed } from 'vue'

const position = ref('relative')
const showAncestor = ref(true)
const top = ref(0)
const left = ref(0)
const zIndex = ref(1)
const scrollArea = ref(null)
const scrollOffset = ref(0)

const positions = [
  { id: 'static', label: 'static' },
  { id: 'relative', label: 'relative' },
  { id: 'absolute', label: 'absolute' },
  { id: 'fixed', label: 'fixed' },
  { id: 'sticky', label: 'sticky' },
]

const parentStyle = computed(() => ({
  position: showAncestor.value ? 'relative' : 'static',
}))

const childStyle = computed(() => ({
  position: position.value,
  insetBlockStart: `${top.value}px`,
  insetInlineStart: `${left.value}px`,
  zIndex: zIndex.value,
}))

const fixedPreviewStyle = computed(() => ({
  insetBlockStart: `${top.value + 16}px`,
  insetInlineStart: `${left.value + 16}px`,
  zIndex: zIndex.value,
}))

const layerStyle = computed(() => {
  const staysInFlow = ['static', 'relative', 'sticky'].includes(position.value)
  const blockStart = staysInFlow ? 82 : top.value + 16
  const inlineStart = staysInFlow ? 56 : left.value + 48

  return {
    insetBlockStart: `${blockStart}px`,
    insetInlineStart: `${inlineStart}px`,
    zIndex: 5,
  }
})

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

function toggleScroll() {
  const area = scrollArea.value
  if (!area) return

  const nextOffset = area.scrollTop > 0 ? 0 : 96
  area.scrollTo({ top: nextOffset })
  scrollOffset.value = nextOffset
}

function handlePositionChange() {
  scrollArea.value?.scrollTo({ top: 0 })
  scrollOffset.value = 0
}

function handleScroll() {
  scrollOffset.value = scrollArea.value?.scrollTop ?? 0
}
</script>

<template>
  <div class="positioning-playground">
    <div class="controls">
      <label class="control-group">
        <span>position</span>
        <select v-model="position" @change="handlePositionChange">
          <option v-for="item in positions" :key="item.id" :value="item.id">{{ item.label }}</option>
        </select>
      </label>

      <label class="control-group">
        <span>scroll container</span>
        <button @click="toggleScroll" :class="{ active: scrollOffset > 0 }">
          {{ scrollOffset > 0 ? 'Наверх' : 'Прокрутить +96px' }}
        </button>
      </label>

      <label class="control-group">
        <span>inset-block-start</span>
        <button @click="toggleTop" :class="{ active: top !== 0 }">{{ top === 0 ? '+24px' : '0' }}</button>
      </label>

      <label class="control-group">
        <span>inset-inline-start</span>
        <button @click="toggleLeft" :class="{ active: left !== 0 }">{{ left === 0 ? '+32px' : '0' }}</button>
      </label>

      <label class="control-group">
        <span>containing block</span>
        <button @click="showAncestor = !showAncestor" :class="{ active: showAncestor }">
          {{ showAncestor ? 'relative' : 'static' }}
        </button>
      </label>

      <label class="control-group">
        <span>z-index</span>
        <button @click="toggleZIndex" :class="{ active: zIndex > 1 }">{{ zIndex }}</button>
      </label>
    </div>

    <div class="preview-boundary">
      <span class="viewport-label">viewport model</span>
      <div ref="scrollArea" :style="parentStyle" class="playground-area" @scroll="handleScroll">
        <div class="scroll-content">
          <span class="ancestor-label">scroll container · parent: {{ showAncestor ? 'relative' : 'static' }}</span>
          <p class="scroll-marker">Начало содержимого</p>
          <div v-if="position !== 'fixed'" :style="childStyle" class="positioned-child">Child · z-index {{ zIndex }}</div>
          <p class="scroll-space">Прокрутите область: absolute уедет вместе с содержимым, fixed останется у viewport, sticky остановится у верхней границы контейнера.</p>
          <p class="scroll-marker">Конец содержимого</p>
        </div>
      </div>
      <div :style="layerStyle" class="overlap-card">Layer · z-index 5</div>
      <div v-if="position === 'fixed'" :style="fixedPreviewStyle" class="positioned-child fixed-preview">Child · z-index {{ zIndex }}</div>
    </div>

    <code class="generated-code">{{ generatedCode }}</code>

    <p class="hint">
      {{ position === 'static' ? 'static — остаётся в потоке; inset и z-index не меняют положение.' :
         position === 'relative' ? 'relative — сохраняет место в потоке; попробуйте inset.' :
         position === 'absolute' ? 'absolute — прокрутка увозит его вместе с containing block.' :
         position === 'fixed' ? 'fixed — вне scroll container; внешняя рамка моделирует viewport, поэтому Child остаётся на месте.' :
         'sticky — начинается в потоке и удерживается у верхней границы scroll container.' }}
    </p>
  </div>
</template>

<style scoped>
.positioning-playground {
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 0.5rem;
}

.controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
}

.control-group {
  display: grid;
  min-width: 0;
  gap: 0.2rem;
  color: #64748b;
  font-size: 0.7rem;
}

.control-group select,
.control-group button {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 0.25rem 0.4rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.25rem;
  background: white;
  color: #0f172a;
  font-size: 0.78rem;
}

.control-group button.active {
  background: #0284c7;
  color: white;
  border-color: #0284c7;
}

.preview-boundary {
  position: relative;
  min-height: 0;
  height: 150px;
  overflow: hidden;
  border: 2px dashed #94a3b8;
  border-radius: 0.5rem;
}

.playground-area {
  height: 100%;
  overflow: auto;
  border-radius: inherit;
}

.scroll-content {
  position: relative;
  min-height: 288px;
  box-sizing: border-box;
  padding: 0.5rem;
}

.positioned-child,
.overlap-card {
  width: max-content;
  max-width: calc(100% - 1rem);
  box-sizing: border-box;
  padding: 0.4rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.78rem;
  font-weight: 500;
}

.positioned-child {
  border: 1px solid #fca5a5;
  background: #fee2e2;
  color: #991b1b;
}

.overlap-card {
  position: absolute;
  border: 1px solid #a5b4fc;
  background: #e0e7ff;
  color: #3730a3;
}

.fixed-preview {
  position: absolute;
  border-color: #38bdf8;
  background: #e0f2fe;
  color: #075985;
}

.viewport-label {
  position: absolute;
  inset-block-start: 0.35rem;
  inset-inline-end: 0.5rem;
  z-index: 6;
  color: #0284c7;
  font-size: 0.68rem;
}
.ancestor-label,
.scroll-marker,
.scroll-space,
.hint {
  color: #64748b;
  font-size: 0.72rem;
}

.scroll-marker {
  margin: 0.5rem 0 2.25rem;
}

.scroll-space {
  min-height: 140px;
  margin: 4rem 0 0;
  max-width: 34rem;
}

.generated-code {
  max-height: 88px;
  margin: 0;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  border-radius: 0.375rem;
  background: #1e293b;
  color: #e2e8f0;
  padding: 0.5rem 0.75rem;
  font-size: 0.72rem;
  line-height: 1.35;
}

.hint {
  margin: 0;
}
</style>
