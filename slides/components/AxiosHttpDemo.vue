<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { onSlideLeave } from '@slidev/client'
import axios from 'axios'
import { createAxiosClient, describeAxiosError, loadWithAxios } from './axios-http-client'
import { loadRegistrations } from '../public/examples/10-async-http/registration-client.js'

const base = new URL(`${import.meta.env.BASE_URL}examples/10-async-http/`, location.href)
const api = createAxiosClient(base.href)
const transport = ref('axios')
const file = ref('registrations.json')
const phase = ref('idle')
const message = ref('Выберите клиент и загрузите тот же файл')
const diagnostic = ref('')
const rows = ref<Awaited<ReturnType<typeof loadWithAxios>>>([])
const busy = computed(() => phase.value === 'loading')
let controller: AbortController | undefined
let latest = 0

function reset() {
  latest++
  controller?.abort()
  controller = undefined
  phase.value = 'idle'
  message.value = 'Выберите клиент и загрузите тот же файл'
  diagnostic.value = ''
  rows.value = []
}
onSlideLeave(reset)
onUnmounted(reset)

async function run() {
  if (busy.value) return
  const id = ++latest
  const client = transport.value
  const current = new AbortController()
  controller = current
  phase.value = 'loading'
  message.value = `${client}: ожидаем ответ…`
  diagnostic.value = ''
  rows.value = []
  try {
    const result = client === 'axios'
      ? await loadWithAxios(api, file.value, current.signal)
      : await loadRegistrations(new URL(file.value, base), current.signal)
    if (id !== latest) return
    rows.value = result
    phase.value = 'success'
    message.value = result.length ? `Получено заявок: ${result.length}` : 'Успех: заявок нет'
    diagnostic.value = 'Массив прошёл parseRegistrations'
  } catch (error) {
    if (id !== latest) return
    const cancelled = axios.isCancel(error) || (error instanceof Error && error.name === 'AbortError')
    phase.value = cancelled ? 'cancelled' : 'error'
    message.value = client === 'axios'
      ? describeAxiosError(error)
      : cancelled ? 'Запрос отменён' : error instanceof Error ? error.message : String(error)
    diagnostic.value = axios.isAxiosError(error)
      ? `${error.name} · code: ${error.code ?? 'нет'} · HTTP: ${error.response?.status ?? 'нет ответа'}`
      : error instanceof Error ? error.name : typeof error
  } finally {
    if (id === latest) controller = undefined
  }
}
</script>

<template>
  <section class="axios-demo" aria-label="Сравнение fetch и Axios">
    <header>
      <span>Frontend Meetup · один URL, одна проверка данных</span>
      <button type="button" @click="reset">Начать заново</button>
    </header>
    <div class="demo-body">
      <div class="demo-controls">
        <label>HTTP-клиент
          <select v-model="transport" :disabled="busy">
            <option value="axios">Axios</option>
            <option value="fetch">fetch</option>
          </select>
        </label>
        <label>Файл ответа
          <select v-model="file" :disabled="busy">
            <option value="registrations.json">Корректный список</option>
            <option value="empty.json">Пустой список</option>
            <option value="shape.json">Неверные поля</option>
            <option value="invalid.txt">Повреждённый JSON</option>
          </select>
        </label>
        <button type="button" :disabled="busy" @click="run">Загрузить заявки</button>
        <button type="button" :disabled="!busy" @click="controller?.abort()">Отменить запрос</button>
      </div>
      <div class="demo-result">
        <section :aria-busy="busy" aria-label="Результат загрузки">
          <p role="status">{{ message }}</p>
          <ul v-if="rows.length">
            <li v-for="row in rows" :key="row.id">{{ row.name }} · мест: {{ row.count }}</li>
          </ul>
        </section>
        <p class="diagnostic"><code>{{ phase }}</code> · {{ diagnostic }}</p>
        <p>Адрес: <code>{{ file }}</code></p>
        <p>Axios: <code>response.data</code> → <code>parseRegistrations</code></p>
        <p><code>fetch</code>: <code>response.ok</code> → <code>json()</code> → <code>parseRegistrations</code></p>
      </div>
    </div>
    <p class="demo-note">Настоящие HTTP-запросы к локальным файлам, без искусственной задержки. Для наблюдения отмены включите ограничение скорости в DevTools Network.</p>
  </section>
</template>

<style scoped>
.axios-demo { display: flex; flex: 1; flex-direction: column; gap: .7rem; min-height: 0; overflow: auto; color: var(--fg); font-size: .72rem; }
header { display: flex; justify-content: space-between; align-items: center; gap: .6rem; font-size: .65rem; color: var(--fg-dim); }
.demo-body { display: grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.3fr); gap: 1.1rem; }
.demo-controls { display: flex; flex-direction: column; gap: .5rem; }
label { display: flex; flex-direction: column; gap: .25rem; }
button, select { font: inherit; color: var(--fg); background: var(--surface-bg); border: var(--surface-border); border-radius: .35rem; padding: .4rem .55rem; min-width: 0; }
button { cursor: pointer; }
button:disabled, select:disabled { opacity: .5; cursor: default; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.demo-result { min-width: 0; }
.demo-result section { padding: .75rem; border: var(--surface-border); border-radius: .4rem; background: var(--surface-bg); min-height: 5rem; }
p { margin: 0 0 .55rem; }
ul { margin: .4rem 0 0; padding-left: 1.2rem; }
.diagnostic, .demo-note { font-size: .6rem; color: var(--fg-dim); overflow-wrap: anywhere; }
.demo-result > p:not(.diagnostic) { font-size: .6rem; }
code { font-size: .95em; }
@media (max-width: 650px) { .demo-body { grid-template-columns: 1fr; } }
</style>
