<script setup>
import { computed, nextTick, ref } from 'vue'

function createCard(id) {
  return { id, columnStart: 'auto', columnEnd: 'auto', rowStart: 'auto', rowEnd: 'auto' }
}

const columnTracks = ref(Array.from({ length: 3 }, () => ({ size: 1, unit: 'fr' })))
const rowTracks = ref(Array.from({ length: 2 }, () => ({ size: 64, unit: 'px' })))
const gap = ref(8)
const items = ref(Array.from({ length: 6 }, (_, index) => createCard(index + 1)))
const selectedIndex = ref(0)
const columnIndex = ref(0)
const rowIndex = ref(0)
const gridRoot = ref(null)
let nextCardId = 7

const selectedCard = computed(() => items.value[selectedIndex.value])
const selectedColumn = computed(() => columnTracks.value[columnIndex.value])
const selectedRow = computed(() => rowTracks.value[rowIndex.value])
const columnsCSS = computed(() => columnTracks.value.map(track => `${track.size}${track.unit}`).join(' '))
const rowsCSS = computed(() => rowTracks.value.map(track => `${track.size}px`).join(' '))
const gridStyle = computed(() => ({
  gridTemplateColumns: columnsCSS.value,
  gridTemplateRows: rowsCSS.value,
  gridAutoRows: '64px',
  gap: `${gap.value}px`,
}))
const generatedCSS = computed(() => `.grid {
  display: grid;
  grid-template-columns: ${columnsCSS.value};
  grid-template-rows: ${rowsCSS.value};
  grid-auto-rows: 64px;
  gap: ${gap.value}px;
}
.card-${selectedCard.value.id} {
  grid-column: ${selectedCard.value.columnStart} / ${selectedCard.value.columnEnd};
  grid-row: ${selectedCard.value.rowStart} / ${selectedCard.value.rowEnd};
}`)

function clearOutsideLines(axis, lastLine) {
  const start = `${axis}Start`
  const end = `${axis}End`
  for (const card of items.value) {
    if (card[start] > lastLine || card[end] > lastLine) {
      card[start] = 'auto'
      card[end] = 'auto'
    }
  }
}

function updateColumns(count) {
  while (columnTracks.value.length < count) columnTracks.value.push({ size: 1, unit: 'fr' })
  columnTracks.value.length = count
  columnIndex.value = Math.min(columnIndex.value, count - 1)
  clearOutsideLines('column', count + 1)
}

function updateRows(event) {
  if (!event.target.validity.valid) return
  const count = event.target.valueAsNumber
  while (rowTracks.value.length < count) rowTracks.value.push({ size: 64, unit: 'px' })
  rowTracks.value.length = count
  rowIndex.value = Math.min(rowIndex.value, count - 1)
  clearOutsideLines('row', count + 1)
}

function updateSize(track, event) {
  if (event.target.validity.valid) track.size = event.target.valueAsNumber
}

async function addGridCard() {
  items.value.push(createCard(nextCardId++))
  selectedIndex.value = items.value.length - 1
  await nextTick()
  gridRoot.value?.lastElementChild?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}

function removeGridCard() {
  if (items.value.length <= 1) return
  items.value.pop()
  selectedIndex.value = Math.min(selectedIndex.value, items.value.length - 1)
}
</script>
<template>
  <section class="grid-playground" aria-label="Редактор треков и размещения карточек Grid">
    <div class="controls">
      <div class="basic-controls">
        <div role="group" aria-label="Количество колонок">
          <span class="control-label">Колонки</span>
          <div class="button-row">
            <button
              v-for="n in 4"
              :key="n"
              type="button"
              :aria-pressed="columnTracks.length === n"
              @click="updateColumns(n)"
            >{{ n }}</button>
          </div>
        </div>
        <div role="group" aria-label="Промежуток между треками">
          <span class="control-label">gap, px</span>
          <div class="button-row">
            <button
              v-for="value in [0, 4, 8, 16]"
              :key="value"
              type="button"
              :aria-pressed="gap === value"
              @click="gap = value"
            >{{ value }}</button>
          </div>
        </div>
      </div>

      <fieldset>
        <legend>Размеры треков</legend>
        <div class="track-controls">
          <label>Колонка
            <select v-model.number="columnIndex">
              <option v-for="(_, index) in columnTracks" :key="index" :value="index">{{ index + 1 }}</option>
            </select>
          </label>
          <label>Ширина
            <input type="number" min="0.25" step="0.25" :value="selectedColumn.size" @input="updateSize(selectedColumn, $event)">
          </label>
          <label>Единица
            <select v-model="selectedColumn.unit">
              <option value="fr">fr</option>
              <option value="px">px</option>
            </select>
          </label>
          <label>Число строк
            <input type="number" min="1" step="1" :value="rowTracks.length" @input="updateRows">
          </label>
          <label>Строка
            <select v-model.number="rowIndex">
              <option v-for="(_, index) in rowTracks" :key="index" :value="index">{{ index + 1 }}</option>
            </select>
          </label>
          <label>Высота, px
            <input type="number" min="1" step="1" :value="selectedRow.size" @input="updateSize(selectedRow, $event)">
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Карточки</legend>
        <div class="button-row">
          <button type="button" @click="addGridCard">+ карточка</button>
          <button type="button" :disabled="items.length <= 1" @click="removeGridCard">− карточка</button>
          <span class="card-count" aria-live="polite">{{ items.length }}</span>
        </div>
        <label>Карточка
          <select v-model.number="selectedIndex">
            <option v-for="(item, index) in items" :key="item.id" :value="index">Карточка {{ item.id }}</option>
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend>Линии выбранной карточки</legend>
        <div class="placement-controls">
          <label>Колонка: начало
            <select v-model="selectedCard.columnStart">
              <option value="auto">auto</option>
              <option v-for="line in columnTracks.length + 1" :key="line" :value="line">{{ line }}</option>
            </select>
          </label>
          <label>Колонка: конец
            <select v-model="selectedCard.columnEnd">
              <option value="auto">auto</option>
              <option v-for="line in columnTracks.length + 1" :key="line" :value="line">{{ line }}</option>
            </select>
          </label>
          <label>Строка: начало
            <select v-model="selectedCard.rowStart">
              <option value="auto">auto</option>
              <option v-for="line in rowTracks.length + 1" :key="line" :value="line">{{ line }}</option>
            </select>
          </label>
          <label>Строка: конец
            <select v-model="selectedCard.rowEnd">
              <option value="auto">auto</option>
              <option v-for="line in rowTracks.length + 1" :key="line" :value="line">{{ line }}</option>
            </select>
          </label>
        </div>
      </fieldset>
    </div>

    <div class="preview-panel">
      <div class="grid-viewport" tabindex="0" aria-label="Сетка карточек, доступна прокрутка">
        <div ref="gridRoot" class="playground-area" :style="gridStyle">
          <button
            v-for="(item, index) in items"
            :key="item.id"
            type="button"
            class="grid-item"
            :class="[`card-${item.id}`, { selected: selectedIndex === index }]"
            :aria-label="`Выбрать карточку ${item.id}`"
            :aria-pressed="selectedIndex === index"
            :style="{ gridColumn: `${item.columnStart} / ${item.columnEnd}`, gridRow: `${item.rowStart} / ${item.rowEnd}` }"
            @click="selectedIndex = index"
          >Карточка {{ item.id }}</button>
        </div>
      </div>
      <pre class="generated-code"><code>{{ generatedCSS }}</code></pre>
    </div>
  </section>
</template>

<style scoped>
.grid-playground {
  display: grid;
  grid-template-columns: minmax(15rem, 0.9fr) minmax(0, 1.4fr);
  flex: 1;
  min-height: 0;
  gap: 0.8rem;
  color: var(--fg);
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-height: 0;
  overflow: auto;
  padding: 0.15rem 0.3rem 0.15rem 0.15rem;
}

.basic-controls,
.placement-controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem;
}

.track-controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.4rem;
}

fieldset {
  min-width: 0;
  margin: 0;
  padding: 0.35rem 0.5rem 0.45rem;
  border: 1px solid var(--border);
  border-radius: 0.4rem;
}

legend {
  padding-inline: 0.2rem;
  font-size: 0.72rem;
  font-weight: 700;
}

label,
.control-label {
  display: block;
  min-width: 0;
  color: var(--fg-dim);
  font-size: 0.66rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.button-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-block: 0.2rem;
}

button,
select,
input {
  box-sizing: border-box;
  min-width: 0;
  padding: 0.25rem 0.4rem;
  border: 1px solid var(--border);
  border-radius: 0.3rem;
  background: var(--surface-bg);
  color: var(--fg);
  font: inherit;
  font-size: 0.72rem;
}

select,
input { width: 100%; }

button[aria-pressed='true'] {
  border-color: var(--accent);
  background: color-mix(in oklab, var(--accent) 14%, var(--surface-bg));
}

button:disabled { opacity: 0.45; }
input:invalid { border-color: #b91c1c; }

button:focus-visible,
select:focus-visible,
input:focus-visible,
.grid-viewport:focus-visible {
  outline: 2px solid var(--fg);
  outline-offset: 2px;
}

.card-count {
  margin-inline-start: auto;
  font: 700 0.75rem var(--font-mono);
}

.preview-panel {
  display: grid;
  grid-template-rows: minmax(6rem, 1fr) auto;
  min-width: 0;
  min-height: 0;
  gap: 0.5rem;
}

.grid-viewport {
  min-height: 0;
  overflow: auto;
  padding: 0.4rem;
  border: 1px dashed var(--border);
  border-radius: 0.4rem;
}

.playground-area {
  display: grid;
  min-width: 0;
  align-content: start;
}

.grid-item {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  overflow-wrap: anywhere;
  background: color-mix(in oklab, var(--accent) 6%, var(--surface-bg));
}

.grid-item.selected {
  border: 2px solid var(--accent);
  font-weight: 700;
}

.generated-code {
  max-height: 12rem;
  min-width: 0;
  margin: 0;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  background: var(--surface-bg);
  color: var(--fg);
  padding: 0.5rem 0.65rem;
  border-radius: 0.4rem;
  font: 0.68rem/1.35 var(--font-mono);
}
</style>
