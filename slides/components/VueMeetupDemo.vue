<script setup lang="ts">
import { computed, ref } from 'vue'

type Registration = { id: number; name: string; count: number }
const initial = (): Registration[] => [
  { id: 1, name: 'Анна', count: 2 },
  { id: 2, name: 'Борис', count: 1 },
]
const registrations = ref(initial())
const name = ref('')
const count = ref<number | string>(1)
const query = ref('')
const nextId = ref(3)
const visible = computed(() => registrations.value.filter(item => item.name.toLowerCase().includes(query.value.trim().toLowerCase())))
const seats = computed(() => registrations.value.reduce((sum, item) => sum + item.count, 0))
const canSubmit = computed(() => name.value.trim().length > 0 && typeof count.value === 'number' && Number.isInteger(count.value) && count.value >= 1 && count.value <= 5)
function add() {
  if (!canSubmit.value || typeof count.value !== 'number') return
  registrations.value.push({ id: nextId.value++, name: name.value.trim(), count: count.value })
  name.value = ''
  count.value = 1
}
function reset() {
  registrations.value = initial()
  name.value = ''
  count.value = 1
  query.value = ''
  nextId.value = 3
}
</script>

<template>
  <section class="meetup-demo" aria-label="Демонстрация Vue Frontend Meetup">
    <header><strong>Frontend Meetup</strong><button type="button" @click="reset">Начать заново</button></header>
    <div class="content">
      <form @submit.prevent="add">
        <h3>Регистрация</h3>
        <label>Имя <input v-model="name" required autocomplete="name"></label>
        <label>Места <input v-model.number="count" type="number" min="1" max="5" required></label>
        <button type="submit" :disabled="!canSubmit">Добавить</button>
      </form>
      <div>
        <h3>Заявки · мест: {{ seats }}</h3>
        <p class="note" aria-live="polite">Всего заявок: {{ registrations.length }} · видно: {{ visible.length }}</p>
        <label>Поиск <input v-model="query" type="search"></label>
        <p v-if="visible.length === 0" role="status">Ничего не найдено</p>
        <ul v-else>
          <li v-for="item in visible" :key="item.id">
            <span>{{ item.name }} · {{ item.count }}</span>
            <button type="button" :aria-label="`Удалить заявку: ${item.name}`" @click="registrations = registrations.filter(entry => entry.id !== item.id)">Удалить</button>
          </li>
        </ul>
      </div>
    </div>
    <p class="note">Данные хранятся в памяти и сбрасываются при перезагрузке.</p>
  </section>
</template>

<style scoped>
.meetup-demo { flex: 1; min-height: 0; padding: 1.1rem; border: var(--surface-border); border-radius: .7rem; background: var(--surface-bg); color: var(--fg); overflow: auto; font-size: .8rem; }
header, li { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.content { display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: 1.2rem; }
h3 { margin: .8rem 0; }
label { display: block; margin: .5rem 0; }
input { display: block; box-sizing: border-box; width: 100%; margin-top: .25rem; padding: .35rem; color: var(--fg); background: var(--surface-bg); border: var(--surface-border); border-radius: .25rem; }
button { padding: .35rem .6rem; color: var(--fg); background: var(--surface-bg); border: var(--surface-border); border-radius: .3rem; cursor: pointer; }
button:disabled { opacity: .5; cursor: not-allowed; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
ul { padding: 0; list-style: none; } li { padding: .35rem 0; border-bottom: var(--surface-border); }
li::before { display: none; }
.note { color: var(--fg-dim); font-size: .7rem; }
</style>
