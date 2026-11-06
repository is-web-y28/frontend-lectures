<script setup lang="ts">
import { computed, onUnmounted, reactive, ref } from 'vue'
import { createDemoSource } from '../public/examples/10-async-http/registration-client.js'
import { createRegistrationState, createRegistrationSearch, describeRegistrationState } from '../public/examples/10-async-http/registration-model.js'

const file = ref('registrations.json')
const version = ref(1)
const base = new URL(`${import.meta.env.BASE_URL}examples/10-async-http/`, location.href)
// #region vue-binding
const state = reactive(createRegistrationState())
const load = createDemoSource(base, () => ({
  file: file.value, version: version.value,
}), message => actions.report(message))
const actions = createRegistrationSearch(
  state, load,
)
const message = computed(() => {
  return describeRegistrationState(state)
})
// #endregion vue-binding
onUnmounted(actions.dispose)
function changeSource() {
  version.value = version.value % 5 + 1
  actions.report(`Источник изменён: v${version.value}; снимки в кеше прежние`)
}
</script>

<template>
  <section class="async-vue-app" aria-label="Загрузка заявок на Vue">
    <div class="app-controls">
      <!-- #region vue-controls -->
      <label>Поиск
        <select v-model="state.query" @change="actions.search(state.query)">
          <option value="">Все заявки</option>
          <option value="Анна">Анна · медленный ответ</option>
          <option value="Борис">Борис · быстрый ответ</option>
        </select>
      </label>
      <button type="button" @click="actions.search(state.query)">Открыть список</button>
      <button type="button" @click="actions.search(state.query, true)">Обновить принудительно</button>
      <!-- #endregion vue-controls -->
      <button type="button" @click="changeSource">Изменить источник</button>
      <label>Ответ при чтении
        <select v-model="file">
          <option value="registrations.json">Корректный</option>
          <option value="empty.json">Пустой список</option>
          <option value="invalid.txt">Повреждённый JSON</option>
          <option value="shape.json">Неверные поля</option>
          <option value="503">HTTP 503 (имитация)</option>
        </select>
      </label>
    </div>
    <div class="app-result">
      <!-- #region vue-result -->
      <section
        :aria-busy="state.phase === 'loading'"
        aria-label="Результат"
      >
        <p role="status">{{ message }}</p>
        <ul v-if="state.hasData">
          <li v-for="row in state.rows" :key="row.id">
            {{ row.name }} · мест: {{ row.count }}
          </li>
        </ul>
      </section>
      <!-- #endregion vue-result -->
      <p class="state-hint">phase: {{ state.phase }} · записей: {{ state.rows.length }}</p>
      <details open>
        <summary>Журнал операций</summary>
        <ol aria-live="polite"><li v-for="(event, index) in state.events" :key="index">{{ event }}</li></ol>
      </details>
    </div>
  </section>
</template>

<style scoped>
.async-vue-app { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: 1rem; font-size: .72rem; color: var(--fg); }
.app-controls { display: flex; flex-direction: column; gap: .45rem; }
label { display: flex; flex-direction: column; gap: .2rem; }
button, select { font: inherit; color: inherit; background: var(--surface-bg); border: 1px solid var(--surface-border); border-radius: .35rem; padding: .4rem .55rem; width: 100%; min-width: 0; }
button { cursor: pointer; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.app-result { min-width: 0; }
.app-result section { padding: .65rem; border: 1px solid var(--surface-border); border-radius: .4rem; background: var(--surface-bg); min-height: 5rem; }
p { margin: 0 0 .5rem; }
ul, ol { padding-left: 1.2rem; margin: .3rem 0; }
.state-hint { font-size: .58rem; color: var(--fg-dim); margin: .5rem 0; }
details { font-size: .6rem; }
details ol { max-height: 5.5rem; overflow: auto; }
@media (max-width: 650px) { .async-vue-app { grid-template-columns: 1fr; } }
</style>
