<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

const props = defineProps<{
  mode: 'reactivity' | 'computed' | 'bindings' | 'conditions' | 'keys' | 'forms'
    | 'nested' | 'collections' | 'model-timing' | 'reactive'
}>()

let plain = 1
const count = ref(1)
const snapshot = count.value * 2
const doubled = computed(() => count.value * 2)
const enabled = ref(false)
const isOpen = ref(true)
const rows = ref([{ id: 'a', name: 'Анна' }, { id: 'b', name: 'Борис' }])
const revision = ref(0)
const name = ref('Анна')
const places = ref<number | string>(2)
const newsletter = ref(false)
const format = ref('onsite')
const registration = ref({ id: 'a', name: 'Анна', count: 2 })
const { count: initialCount } = registration.value
const currentCount = computed(() => registration.value.count)
const seedCollection = () => [
  { id: 'v', name: 'Вера', count: 1 },
  { id: 'a', name: 'Анна', count: 2 },
  { id: 'b', name: 'Борис', count: 1 },
]
const collectionRows = ref(seedCollection())
const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, 'ru')
const ordered = computed(() => [...collectionRows.value].sort(byName))
const liveName = ref('')
const confirmedName = ref('')
const selected = ref({ name: 'Анна', count: 2 })
const draft = reactive({ name: 'Анна', count: 2 })
const formState = computed(() => JSON.stringify({
  name: name.value,
  count: places.value,
  countType: typeof places.value,
  newsletter: newsletter.value,
  format: format.value,
}, null, 2))
const source = computed(() => ({
  reactivity: `let plain = 1\nconst count = ref(1)\n\n// кнопки: plain++ и count++\n<p>{{ plain }} / {{ count }}</p>`,
  computed: `const count = ref(1)\nconst snapshot = count.value * 2\nconst doubled = computed(() =>\n  count.value * 2\n)`,
  bindings: `<button @click="enabled = !enabled">\n  Разрешить отправку\n</button>\n<button :disabled="!enabled">Добавить</button>\n<p :class="{ ready: enabled }">\n  {{ enabled ? 'Можно отправить' : 'Ожидаем' }}\n</p>`,
  conditions: `<div v-if="isOpen">\n  <input aria-label="Черновик v-if">\n</div>\n<div v-show="isOpen">\n  <input aria-label="Черновик v-show">\n</div>`,
  keys: `// первая колонка\n<li v-for="(item, i) in rows" :key="i">\n// вторая колонка\n<li v-for="item in rows" :key="item.id">\n// в каждой строке — несвязанное поле\n<input aria-label="Заметка">`,
  forms: `<input v-model="name">\n<input v-model.number="places" type="number">\n<input v-model="newsletter" type="checkbox">\n<select v-model="format">\n  <option value="onsite">В зале</option>\n  <option value="online">Онлайн</option>\n</select>`,
  nested: `const registration = ref({\n  id: 'a', name: 'Анна', count: 2,\n})\nconst { count: initialCount } = registration.value\nconst currentCount = computed(() =>\n  registration.value.count\n)\n// кнопки меняют поле или весь .value`,
  collections: `const ordered = computed(() =>\n  [...collectionRows.value].sort(byName)\n)\n\n// изменить поле общей заявки\nanna.count++\n// изменить исходный порядок\ncollectionRows.value.sort(byName)`,
  'model-timing': `<input v-model="liveName">\n<input v-model.lazy.trim="confirmedName">\n\n// сравниваем значения строк\nJSON.stringify(liveName.value)\nJSON.stringify(confirmedName.value)`,
  reactive: `// ref: заменяем значение контейнера\nselected.value = { name: 'Борис', count: 1 }\n\n// reactive: меняем поля того же объекта\ndraft.name = 'Борис'\ndraft.count = 1`,
}[props.mode]))

function increaseBoth() {
  selected.value.count++
  draft.count++
}

function loadBoris() {
  selected.value = { name: 'Борис', count: 1 }
  draft.name = 'Борис'
  draft.count = 1
}

function increaseAnna() {
  const anna = collectionRows.value.find(item => item.id === 'a')
  if (anna) anna.count++
}

function reset() {
  plain = 1
  count.value = 1
  enabled.value = false
  isOpen.value = true
  rows.value = [{ id: 'a', name: 'Анна' }, { id: 'b', name: 'Борис' }]
  name.value = 'Анна'
  places.value = 2
  newsletter.value = false
  format.value = 'onsite'
  registration.value = { id: 'a', name: 'Анна', count: 2 }
  collectionRows.value = seedCollection()
  liveName.value = ''
  confirmedName.value = ''
  selected.value = { name: 'Анна', count: 2 }
  draft.name = 'Анна'
  draft.count = 2
  revision.value++
}
</script>

<template>
  <section class="mechanism" :aria-label="`Демонстрация Vue: ${mode}`">
    <header><span>Код → наблюдение</span><button type="button" @click="reset">Начать заново</button></header>
    <div class="stage">
      <pre class="source"><code>{{ source }}</code></pre>
      <div :key="revision" :class="['result', { 'forms-result': mode === 'forms' }]">
        <template v-if="mode === 'reactivity'">
          <p>Обычная переменная: <strong data-testid="plain">{{ plain }}</strong></p>
          <p><code>ref</code>: <strong data-testid="ref">{{ count }}</strong></p>
          <button type="button" @click="plain++">Обычное число +1</button>
          <button type="button" @click="count++"><code>ref</code> +1</button>
          <p class="hint">Какое изменение запускает обновление шаблона?</p>
        </template>
        <template v-else-if="mode === 'computed'">
          <button type="button" @click="count++">Увеличить <code>count</code></button>
          <dl>
            <dt><code>count</code></dt><dd>{{ count }}</dd>
            <dt><code>snapshot</code></dt><dd>{{ snapshot }}</dd>
            <dt><code>doubled</code></dt><dd>{{ doubled }}</dd>
          </dl>
          <p class="hint"><code>snapshot</code> вычислен один раз при создании компонента.</p>
        </template>
        <template v-else-if="mode === 'bindings'">
          <button type="button" :aria-pressed="enabled" @click="enabled = !enabled">Разрешить отправку</button>
          <button type="button" :disabled="!enabled">Добавить</button>
          <p :class="{ ready: enabled }">{{ enabled ? 'Можно отправить' : 'Ожидаем' }}</p>
          <p class="hint">Состояние управляет свойством кнопки, классом и текстом.</p>
        </template>
        <template v-else-if="mode === 'conditions'">
          <button type="button" :aria-pressed="isOpen" @click="isOpen = !isOpen">{{ isOpen ? 'Скрыть поля' : 'Показать поля' }}</button>
          <div v-if="isOpen"><label>Черновик <code>v-if</code><input placeholder="Напишите текст" aria-label="Черновик v-if"></label></div>
          <div v-show="isOpen"><label>Черновик <code>v-show</code><input placeholder="Напишите текст" aria-label="Черновик v-show"></label></div>
          <p class="hint">Поля намеренно не связаны с <code>ref</code>: исследуем состояние DOM.</p>
        </template>
        <template v-else-if="mode === 'keys'">
          <button type="button" @click="rows.reverse()">Поменять порядок</button>
          <div class="lists">
            <div><h3><code>key</code> = индекс</h3><ul>
              <li v-for="(item, index) in rows" :key="index">
                <label>{{ item.name }}<input :aria-label="`Индекс: заметка для ${item.name}`" placeholder="Заметка"></label>
              </li>
            </ul></div>
            <div><h3><code>key = id</code></h3><ul>
              <li v-for="item in rows" :key="item.id">
                <label>{{ item.name }}<input :aria-label="`Id: заметка для ${item.name}`" placeholder="Заметка"></label>
              </li>
            </ul></div>
          </div>
          <p class="hint">Введите заметку Анне в обеих колонках, затем смените порядок.</p>
        </template>
        <template v-else-if="mode === 'forms'">
          <div class="form-controls"><label>Имя<input v-model="name" autocomplete="name"></label>
          <label>Места<input v-model.number="places" type="number"></label>
          <label><input v-model="newsletter" type="checkbox"> Получать новости</label>
          <label>Формат<select v-model="format"><option value="onsite">В зале</option><option value="online">Онлайн</option></select></label>
          </div>
          <pre class="form-state" aria-label="Состояние полей"><code>{{ formState }}</code></pre>
        </template>
        <template v-else-if="mode === 'nested'">
          <p>Текущая заявка: <strong>{{ registration.name }}</strong></p>
          <button type="button" @click="registration.count++">Увеличить <code>count</code></button>
          <button type="button" @click="registration = { id: 'b', name: 'Борис', count: 1 }">Заменить заявку</button>
          <dl>
            <dt><code>currentCount</code></dt><dd data-testid="current-count">{{ currentCount }}</dd>
            <dt><code>initialCount</code></dt><dd data-testid="initial-count">{{ initialCount }}</dd>
          </dl>
          <p class="hint">Обычное число, извлечённое из объекта, не становится <code>ref</code>.</p>
        </template>
        <template v-else-if="mode === 'collections'">
          <button type="button" @click="increaseAnna">Место Анне +1</button>
          <button type="button" @click="collectionRows.sort(byName)">Сортировать источник</button>
          <div class="lists">
            <div><h3>Источник</h3><ol aria-label="Исходная коллекция">
              <li v-for="item in collectionRows" :key="item.id">{{ item.name }} · {{ item.count }}</li>
            </ol></div>
            <div><h3>Копия по имени</h3><ol aria-label="Производная коллекция">
              <li v-for="item in ordered" :key="item.id">{{ item.name }} · {{ item.count }}</li>
            </ol></div>
          </div>
          <p class="hint">Массивы разные, объекты заявок общие. <code>byName</code> сравнивает имена через <code>localeCompare</code>.</p>
        </template>
        <template v-else-if="mode === 'model-timing'">
          <label><code>input</code><input v-model="liveName" autocomplete="off"></label>
          <p>Модель <code>input</code>: <output aria-label="Модель input"><code>{{ JSON.stringify(liveName) }}</code></output></p>
          <label><code>change</code> + <code>trim</code><input v-model.lazy.trim="confirmedName" autocomplete="off"></label>
          <p>Модель <code>change</code>: <output aria-label="Модель change"><code>{{ JSON.stringify(confirmedName) }}</code></output></p>
          <p class="hint">Введите текст с пробелами по краям; затем уйдите из поля клавишей Tab.</p>
        </template>
        <template v-else-if="mode === 'reactive'">
          <button type="button" @click="increaseBoth">Добавить место в обоих</button>
          <button type="button" @click="loadBoris">Загрузить Бориса</button>
          <div class="lists">
            <div aria-label="Состояние ref">
              <h3><code>ref</code></h3>
              <p>{{ selected.name }}</p>
              <p>Мест: <strong>{{ selected.count }}</strong></p>
            </div>
            <div aria-label="Состояние reactive">
              <h3><code>reactive</code></h3>
              <p>{{ draft.name }}</p>
              <p>Мест: <strong>{{ draft.count }}</strong></p>
            </div>
          </div>
          <p class="hint">В обоих случаях изменения видны. Различается способ доступа и обновления данных в <code>script</code>.</p>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mechanism { display: flex; flex: 1; flex-direction: column; min-height: 0; gap: .7rem; color: var(--fg); font-size: .8rem; }
header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; color: var(--fg-dim); }
.stage { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1rem; min-height: 0; flex: 1; }
.source, .result { margin: 0; padding: .9rem; border: var(--surface-border); border-radius: .5rem; background: var(--surface-bg); overflow: auto; }
pre { white-space: pre-wrap; font-size: .68rem; line-height: 1.5; }
.source { display: flex; align-items: center; }
button, input, select { font: inherit; color: var(--fg); background: var(--surface-bg); border: var(--surface-border); border-radius: .3rem; padding: .3rem .45rem; }
button { cursor: pointer; margin: .2rem .3rem .2rem 0; }
button:disabled { opacity: .45; cursor: not-allowed; }
label { display: block; margin: .5rem 0; }
input:not([type=checkbox]), select { display: block; width: 100%; box-sizing: border-box; margin-top: .2rem; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
.result p { margin: .5rem 0; }
.result li::before { display: none; }
.result li { padding: 0; margin: 0; }
.forms-result { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: .7rem; align-items: start; }
.form-state { margin: 0; padding: .6rem; font-size: .62rem; }
.ready { color: var(--accent); font-weight: 700; border-inline-start: 3px solid var(--accent); padding-inline-start: .5rem; }
.hint { font-size: .68rem; color: var(--fg-dim); line-height: 1.5; }
dl { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; } dd { margin: 0; font-weight: 700; }
.lists { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: .6rem; } h3 { font-size: .72rem; } ul, ol { list-style: none; padding: 0; }
.lists ol li { padding: .5rem 0; border-bottom: var(--surface-border); }
output { font-family: monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
@media (max-width: 600px) { .stage { grid-template-columns: 1fr; overflow: auto; } .source { min-height: 6rem; } .result { overflow: visible; } }
</style>
