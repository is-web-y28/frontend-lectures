<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { DemoMode } from './demo'
import { useLocalRegistrationsStore } from '@/features/registrations'

defineProps<{ mode: DemoMode }>()
const { t, locale } = useI18n({ useScope: 'global' })
const { totalSeats } = storeToRefs(useLocalRegistrationsStore())
const route = useRoute()
const main = useTemplateRef('main')
const inspectAddress = ['routes', 'api', 'full']
const showLocale = ['locale', 'fallback', 'full']
const showTotal = ['store', 'locale', 'full']
watch(locale, value => { document.documentElement.lang = value }, { immediate: true })
watch(() => route.path, () => main.value?.focus(), { flush: 'post' })
</script>

<template>
  <header class="app-header">
    <strong>Frontend Meetup</strong>
    <nav :aria-label="t('nav')" class="toolbar">
      <RouterLink :to="{ name: 'schedule' }">{{ t('schedule') }}</RouterLink>
      <RouterLink v-if="mode === 'routes'" :to="{ name: 'event', params: { eventId: 'frontend-meetup' } }">Frontend Meetup</RouterLink>
      <RouterLink v-if="mode === 'routes' || mode === 'store'" :to="{ name: 'event', params: { eventId: 'css-workshop' } }">CSS Workshop</RouterLink>
      <RouterLink v-if="mode === 'api'" :to="{ name: 'registrations', params: { eventId: 'frontend-meetup' } }">Frontend Meetup</RouterLink>
      <RouterLink v-if="mode === 'routes' || mode === 'api'" :to="{ name: 'registrations', params: { eventId: 'css-workshop' } }">CSS Workshop · API</RouterLink>
      <RouterLink v-if="mode === 'dependency'" :to="{ name: 'registrations', params: { eventId: 'frontend-meetup' } }">HTTP</RouterLink>
      <RouterLink v-if="mode === 'dependency'" :to="{ name: 'dependency' }">{{ t('dependency') }}</RouterLink>
    </nav>
    <label v-if="showLocale.includes(mode)" class="language" for="locale">{{ t('language') }}
      <select id="locale" v-model="locale"><option value="ru" lang="ru">Русский</option><option value="en" lang="en">English</option></select>
    </label>
    <p v-if="showTotal.includes(mode)" class="total" role="status">{{ t('localTotal', { seats: t('seats', totalSeats) }) }}</p>
  </header>
  <main ref="main" tabindex="-1">
    <RouterView />
  </main>
  <div v-if="inspectAddress.includes(mode)" class="address" lang="ru">
    Адрес экрана <RouterLink :to="route.fullPath" target="_blank" rel="noopener">{{ route.fullPath }}</RouterLink>
  </div>
</template>
