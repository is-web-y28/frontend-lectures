<script setup lang="ts">
import { nextTick, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { LocalRegistration } from '../model/localModel'

defineProps<{ rows: LocalRegistration[] }>()
const emit = defineEmits<{ remove: [id: number] }>()
const { t } = useI18n({ useScope: 'global' })
const list = useTemplateRef('list')

async function remove(id: number) {
  emit('remove', id)
  await nextTick()
  list.value?.focus()
}
</script>

<template>
  <div ref="list" tabindex="-1">
    <ul v-if="rows.length" class="registration-list">
      <li v-for="row in rows" :key="row.id">
        <span>{{ row.name }} · {{ t('seats', row.count) }}</span>
        <button type="button" :aria-label="t('removeNamed', { name: row.name })" @click="remove(row.id)">{{ t('remove') }}</button>
      </li>
    </ul>
    <p v-else>{{ t('rowsEmpty') }}</p>
  </div>
</template>
