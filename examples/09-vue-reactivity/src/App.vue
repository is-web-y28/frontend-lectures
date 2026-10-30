<script setup lang="ts">
import { computed, ref } from 'vue'

type Registration = { id: number; name: string; count: number }
const initial = (): Registration[] => [
  { id: 1, name: 'Анна', count: 2 },
  { id: 2, name: 'Борис', count: 1 },
]

// Источники состояния: черновик формы, поиск и сохранённые в памяти заявки.
const registrations = ref(initial())
const name = ref('')
const count = ref<number | string>(1)
const query = ref('')
const nextId = ref(3)

// Производные значения: фильтр не изменяет источник и общий итог.
const visible = computed(() => {
  const search = query.value.trim().toLowerCase()
  return registrations.value.filter(item => item.name.toLowerCase().includes(search))
})
const seats = computed(() => registrations.value.reduce((sum, item) => sum + item.count, 0))
const canSubmit = computed(() =>
  name.value.trim().length > 0 &&
  typeof count.value === 'number' &&
  Number.isInteger(count.value) &&
  count.value >= 1 && count.value <= 5
)

function add() {
  if (!canSubmit.value || typeof count.value !== 'number') return
  registrations.value.push({ id: nextId.value++, name: name.value.trim(), count: count.value })
  name.value = ''
  count.value = 1
}

function remove(id: number) {
  registrations.value = registrations.value.filter(item => item.id !== id)
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
  <main>
    <header>
      <div>
        <p class="eyebrow">Лекция 09 · Vue</p>
        <h1>Frontend Meetup</h1>
        <p>Форма, список и итог следуют за состоянием.</p>
      </div>
      <button type="button" @click="reset">Начать заново</button>
    </header>

    <div class="columns">
      <section aria-labelledby="registration-title">
        <h2 id="registration-title">Регистрация</h2>
        <form @submit.prevent="add">
          <label for="name">Имя</label>
          <input id="name" v-model="name" required autocomplete="name">
          <label for="count">Места</label>
          <input id="count" v-model.number="count" type="number" min="1" max="5" step="1" required aria-describedby="count-hint">
          <p id="count-hint" class="hint">От 1 до 5 целых мест. Имя не должно состоять из пробелов.</p>
          <button type="submit" class="primary" :disabled="!canSubmit">Добавить</button>
        </form>
      </section>

      <section aria-labelledby="list-title">
        <h2 id="list-title">Заявки</h2>
        <p class="summary" role="status">Всего заявок: {{ registrations.length }} · видно: {{ visible.length }} · мест: {{ seats }}</p>
        <label for="query">Поиск по имени</label>
        <input id="query" v-model="query" type="search">
        <p v-if="visible.length === 0" role="status">Ничего не найдено</p>
        <ul v-else>
          <li v-for="item in visible" :key="item.id">
            <span>{{ item.name }} · {{ item.count }}</span>
            <button type="button" :aria-label="`Удалить заявку: ${item.name}`" @click="remove(item.id)">Удалить</button>
          </li>
        </ul>
        <p class="hint">Итог мест считается по всем заявкам, независимо от поиска.</p>
      </section>
    </div>

    <details>
      <summary>Состояние и вычисляемые значения</summary>
      <p>В Vue Devtools выберите компонент App и сопоставьте значения с интерфейсом.</p>
      <pre>{{ JSON.stringify({ name, count, countType: typeof count, query, canSubmit, seats, visible, registrations }, null, 2) }}</pre>
    </details>
    <footer>Данные живут в памяти. Перезагрузка или «Начать заново» возвращают Анну и Бориса.</footer>
  </main>
</template>
