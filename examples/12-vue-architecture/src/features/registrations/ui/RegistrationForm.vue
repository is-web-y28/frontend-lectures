<script setup lang="ts">
import { computed, nextTick, ref, useId, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Draft } from '../model/localModel'

const emit = defineEmits<{ submit: [draft: Draft] }>()
const { t } = useI18n({ useScope: 'global' })
const id = useId()
const nameInput = useTemplateRef('nameInput')
const name = ref('')
const count = ref<number | string>(1)
const valid = computed(() => name.value.trim() && typeof count.value === 'number'
  && Number.isInteger(count.value) && count.value >= 1 && count.value <= 5)

async function submit() {
  if (!valid.value || typeof count.value !== 'number') return
  emit('submit', { name: name.value.trim(), count: count.value })
  name.value = ''
  count.value = 1
  await nextTick()
  nameInput.value?.focus()
}
</script>

<template>
  <form class="registration-form" @submit.prevent="submit">
    <div>
      <label :for="`${id}-name`">{{ t('name') }}</label>
      <input :id="`${id}-name`" ref="nameInput" v-model="name" required autocomplete="name">
    </div>
    <div>
      <label :for="`${id}-count`">{{ t('seatCount') }}</label>
      <input :id="`${id}-count`" v-model.number="count" name="seats" type="number" min="1" max="5" required>
    </div>
    <button :disabled="!valid" type="submit">{{ t('add') }}</button>
  </form>
</template>
