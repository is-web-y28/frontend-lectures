<script setup lang="ts">
import { ref } from 'vue'
import { useRegistrationSearch } from '../composables/useRegistrationSearch'
const props = defineProps<{ label: string; base: URL }>()
const emit = defineEmits<{ trace: [message: string] }>()
const query = ref('')
const file = ref('registrations.json')
const { state, message, refresh } = useRegistrationSearch(query, file, props.base, message => emit('trace', `${props.label}: ${message}`))
</script>
<template>
  <section class="panel" :aria-label="`Поиск ${label}`" :aria-busy="state.phase === 'loading'">
    <h3>Панель {{ label }}</h3>
    <label>Имя<select v-model="query"><option value="">Все</option><option>Анна</option><option>Борис</option></select></label>
    <label>Ответ<select v-model="file"><option value="registrations.json">Корректный</option><option value="503">HTTP 503 (имитация)</option><option value="shape.json">Неверные поля</option><option value="empty.json">Пустой список</option></select></label>
    <div class="controls">
      <button type="button" @click="query = 'Борис'">Выбрать Бориса из кода</button>
      <button type="button" @click="refresh">Обновить</button>
    </div>
    <p role="status">{{ message }}</p>
    <p v-if="state.errorText" role="alert">{{ state.errorText }}</p>
    <ul v-if="state.hasData"><li v-for="row in state.rows" :key="row.id">{{ row.name }} · мест: {{ row.count }}</li></ul>
    <details><summary>Журнал запросов {{ label }}</summary><ol><li v-for="(event, i) in state.events" :key="i">{{ event }}</li></ol></details>
  </section>
</template>
