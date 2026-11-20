<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { events } from '../events'
import BasePanel from '../shared/ui/BasePanel.vue'

const { t, d } = useI18n({ useScope: 'global' })
</script>

<template>
  <BasePanel>
    <template #title>{{ t('schedule') }}</template>
    <ul class="schedule-list">
      <li v-for="event in events" :key="event.id">
        <RouterLink :to="{ name: 'event', params: { eventId: event.id } }">{{ event.title }}</RouterLink>
        <time :datetime="event.startsAt">{{ d(new Date(event.startsAt), 'schedule') }}</time>
      </li>
    </ul>
  </BasePanel>
</template>
