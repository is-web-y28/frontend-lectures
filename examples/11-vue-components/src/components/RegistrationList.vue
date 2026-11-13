<script setup lang="ts">
import type { Registration } from '../types'
defineProps<{ rows: Registration[] }>()
const emit = defineEmits<{ remove: [id: number] }>()
</script>
<template>
  <ul v-if="rows.length">
    <li v-for="row in rows" :key="row.id">
      <span>{{ row.name }} · мест: {{ row.count }}</span>
      <button type="button" :aria-label="`Удалить заявку: ${row.name}`" @click="emit('remove', row.id)">Удалить</button>
    </li>
  </ul>
  <p v-else role="status">Ничего не найдено</p>
</template>
