<script setup lang="ts">
import { computed, nextTick, ref, useId, useTemplateRef } from 'vue'
import MeetupPanel from './MeetupPanel.vue'
import RegistrationForm from './RegistrationForm.vue'
import RegistrationList from './RegistrationList.vue'
import type { Draft, Registration } from '../types'
const props = withDefaults(defineProps<{ contract?: boolean }>(), { contract: false })
const rows = ref<Registration[]>([{ id: 1, name: 'Анна', count: 2 }, { id: 2, name: 'Борис', count: 1 }])
let nextId = 3
const query = ref('')
const showForm = ref(true)
const connected = ref(!props.contract)
const events = ref<string[]>([])
const queryInput = useTemplateRef<HTMLInputElement>('queryInput')
const id = useId()
const seats = computed(() => rows.value.reduce((sum, row) => sum + row.count, 0))
const visible = computed(() => rows.value.filter(row => row.name.toLowerCase().includes(query.value.trim().toLowerCase())))
function trace(message: string) { events.value.push(message) }
function add(draft: Draft) {
  rows.value = [...rows.value, { ...draft, id: nextId++ }]
  trace(`App: добавлена ${draft.name}`)
}
async function remove(id: number) {
  trace(`Список: emit remove(${id})`)
  if (!connected.value) { trace('Listener не подключён: коллекция прежняя'); return }
  rows.value = rows.value.filter(row => row.id !== id)
  trace(`App: удалён id=${id}`)
  await nextTick()
  queryInput.value?.focus()
}
</script>
<template>
  <div>
    <p class="notice">Локальная регистрация · только память, без отправки на сервер</p>
    <label v-if="contract" class="inline"><input v-model="connected" type="checkbox"> Подключить обработчик владельца</label>
    <div class="columns">
      <MeetupPanel>
        <template #title>Регистрация</template>
        <template #actions><button type="button" @click="showForm = !showForm">{{ showForm ? 'Скрыть форму' : 'Открыть форму' }}</button></template>
        <RegistrationForm v-if="showForm" @submit="add" @trace="trace" />
      </MeetupPanel>
      <MeetupPanel>
        <template #title>Всего мест: {{ seats }}</template>
        <p role="status">Заявок: {{ rows.length }} · видно: {{ visible.length }}</p>
        <label :for="id">Поиск по имени</label>
        <input :id="id" ref="queryInput" v-model="query" type="search">
        <RegistrationList :rows="visible" @remove="remove" />
      </MeetupPanel>
    </div>
    <details><summary>Журнал контрактов и жизненного цикла</summary><ol><li v-for="(event, i) in events" :key="i">{{ event }}</li></ol></details>
  </div>
</template>
