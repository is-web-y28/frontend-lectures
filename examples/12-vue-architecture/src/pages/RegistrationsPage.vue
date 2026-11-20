<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { demoKey } from '../demo'
import { findEvent } from '../events'
import BasePanel from '../shared/ui/BasePanel.vue'
import {
  diagnosticsKey, readMinSeats, useRegistrationsApi, useRemoteRegistrations,
} from '@/features/registrations'
import type { Diagnostics } from '@/features/registrations'

const props = defineProps<{ eventId: string }>()
const route = useRoute()
const router = useRouter()
const mode = inject(demoKey, 'full')
const diagnostics = inject<Diagnostics>(diagnosticsKey)
const { t, n, locale } = useI18n({ useScope: 'global' })
const event = computed(() => findEvent(props.eventId))
const { rows, phase, hasData, refresh } = useRemoteRegistrations(
  computed(() => event.value?.id), useRegistrationsApi(), message => diagnostics?.report(message),
)
const minSeats = computed(() => readMinSeats(route.query.minSeats))
const visible = computed(() => rows.value.filter(row => row.count >= minSeats.value))
const error = computed(() => phase.value === 'unavailable' ? t('unavailable') : phase.value === 'error' ? t('loadError') : '')
const pending = computed(() => phase.value === 'loading')
const showControls = computed(() => mode === 'api' || mode === 'full'
  || (mode === 'contract' && props.eventId === 'frontend-meetup'))
const fallbackLabelLanguage = computed(() => mode === 'fallback' && locale.value === 'en' ? 'ru' : undefined)

function filter(enabled: boolean) {
  const query = { ...route.query }
  if (enabled) query.minSeats = '2'
  else delete query.minSeats
  void router.push({ query })
}
</script>

<template>
  <template v-if="event">
    <h1>{{ event.title }}</h1>
    <p v-if="route.name !== 'dependency' && !['api', 'contract'].includes(mode)">
      <RouterLink :to="{ name: 'event', params: { eventId } }">{{ t('local') }}</RouterLink>
    </p>
    <details v-if="showControls && diagnostics" class="diagnostic api-diagnostics" :open="mode !== 'full'" lang="ru">
      <summary>{{ mode === 'contract' ? 'Оболочка JSON · объект с items' : 'Условия демонстрации API' }}</summary>
      <div class="api-diagnostics-body">
        <label>
          {{ mode === 'contract' ? 'Парсер ответа' : 'Условие ответа' }}
          <select v-model="diagnostics.response.value">
            <template v-if="mode === 'contract'">
              <option value="wrapped-array">Ожидает массив</option>
              <option value="wrapped-items">Читает items</option>
            </template>
            <template v-else>
              <option value="ok">Корректный ответ</option>
              <option value="slow">Медленный Frontend Meetup</option>
              <option value="503">Имитация 503</option>
              <option value="invalid">Неверные поля JSON</option>
            </template>
          </select>
        </label>
        <ol reversed aria-label="Журнал чтения" tabindex="0">
          <li v-for="(entry, index) in diagnostics.log.value" :key="index">{{ entry }}</li>
        </ol>
      </div>
    </details>
    <BasePanel>
      <template #title>{{ t('api') }}</template>
      <div class="toolbar">
        <label :lang="fallbackLabelLanguage"><input type="checkbox" :checked="minSeats === 2" @change="filter(($event.target as HTMLInputElement).checked)"> {{ t('minSeats') }}</label>
        <button v-if="mode !== 'routes'" type="button" @click="refresh">{{ t(error ? 'retry' : 'refresh') }}</button>
      </div>
      <p v-if="pending" role="status">{{ hasData ? t('refreshing') : t('loading') }}</p>
      <p v-if="error" role="alert">{{ error }}</p>
      <div :aria-busy="pending">
        <ul v-if="visible.length" class="registration-list">
          <li v-for="row in visible" :key="row.id">
            <span>{{ row.name }} · {{ t('seats', row.count, { named: { count: n(row.count, 'integer') } }) }}</span>
          </li>
        </ul>
        <p v-else-if="hasData" role="status">{{ rows.length ? t('filteredEmpty') : t('rowsEmpty') }}</p>
      </div>
    </BasePanel>
  </template>
  <h1 v-else>{{ t('eventMissing') }}</h1>
</template>
