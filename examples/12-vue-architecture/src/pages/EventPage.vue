<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { demoKey } from '../demo'
import { findEvent } from '../events'
import BasePanel from '../shared/ui/BasePanel.vue'
import {
  LocalRegistrationList, RegistrationForm, initialRows, totalIn, useLocalRegistrationsStore,
} from '@/features/registrations'
import type { Draft } from '@/features/registrations'

const props = defineProps<{ eventId: string }>()
const { t, d } = useI18n({ useScope: 'global' })
const event = computed(() => findEvent(props.eventId))
const store = useLocalRegistrationsStore()
const mode = inject(demoKey, 'full')
const pageOwnsRows = mode === 'page-state'
const pageRows = ref(pageOwnsRows ? initialRows() : {})
let nextId = 3
const rows = computed(() => (pageOwnsRows ? pageRows.value : store.rowsByEventId)[props.eventId] ?? [])
const seats = computed(() => totalIn(rows.value))
const eventChanges = ref(0)

if (mode === 'routes') watch(() => props.eventId, () => { eventChanges.value++ })

function add(draft: Draft) {
  if (pageOwnsRows) rows.value.push({ id: nextId++, ...draft })
  else store.add(props.eventId, draft)
}

function remove(id: number) {
  if (pageOwnsRows) pageRows.value[props.eventId] = rows.value.filter(row => row.id !== id)
  else store.remove(props.eventId, id)
}
</script>

<template>
  <template v-if="event">
    <h1>{{ event.title }}</h1>
    <p><time :datetime="event.startsAt">{{ d(new Date(event.startsAt), 'schedule') }}</time> ·
      <RouterLink :to="{ name: 'registrations', params: { eventId } }">{{ t('api') }}</RouterLink>
    </p>
    <p v-if="mode === 'routes'" class="diagnostic">Идентификатор: {{ eventId }} · изменений prop после setup: {{ eventChanges }}</p>
    <BasePanel v-else>
      <template #title>{{ t('local') }}</template>
      <RegistrationForm :key="eventId" @submit="add" />
      <p role="status">{{ t('seats', seats) }}</p>
      <LocalRegistrationList :rows="rows" @remove="remove" />
    </BasePanel>
  </template>
  <h1 v-else>{{ t('eventMissing') }}</h1>
</template>
