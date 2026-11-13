<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useId, useTemplateRef } from 'vue'
import SeatCountField from './SeatCountField.vue'
import type { Draft } from '../types'
const emit = defineEmits<{ submit: [draft: Draft]; trace: [message: string] }>()
const name = ref('')
const count = ref<number | string>(1)
const nameInput = useTemplateRef<HTMLInputElement>('nameInput')
const id = useId()
const canSubmit = computed(() => name.value.trim() !== '' && typeof count.value === 'number' && Number.isInteger(count.value) && count.value >= 1 && count.value <= 5)
onMounted(() => emit('trace', 'Форма: mounted'))
onUnmounted(() => emit('trace', 'Форма: unmounted'))
async function submit() {
  if (!canSubmit.value || typeof count.value !== 'number') return
  emit('submit', { name: name.value.trim(), count: count.value })
  name.value = ''
  count.value = 1
  await nextTick()
  nameInput.value?.focus()
}
</script>
<template>
  <form @submit.prevent="submit">
    <label :for="id">Имя</label>
    <input :id="id" ref="nameInput" v-model="name" required autocomplete="name">
    <SeatCountField v-model="count" name="seats" />
    <button type="submit" :disabled="!canSubmit">Добавить</button>
    <small>Черновик: {{ name || 'пусто' }} · {{ count }} ({{ typeof count }})</small>
  </form>
</template>
