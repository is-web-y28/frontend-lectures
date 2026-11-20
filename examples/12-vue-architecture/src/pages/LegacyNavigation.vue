<script setup lang="ts">
import { ref } from 'vue'
import { events } from '../events'
import BasePanel from '../shared/ui/BasePanel.vue'
import meetupRows from '../../../../slides/public/examples/10-async-http/registrations.json'

const screen = ref<'schedule' | 'registrations'>('schedule')
const address = location.href
</script>

<template>
  <header class="app-header">
    <strong>Frontend Meetup</strong>
    <div class="toolbar">
      <button type="button" :aria-pressed="screen === 'schedule'" @click="screen = 'schedule'">Расписание</button>
      <button type="button" :aria-pressed="screen === 'registrations'" @click="screen = 'registrations'">Заявки из API</button>
    </div>
  </header>
  <main>
    <BasePanel v-if="screen === 'schedule'">
      <template #title>Расписание</template>
      <ul class="schedule-list">
        <li v-for="event in events" :key="event.id">{{ event.title }}</li>
      </ul>
    </BasePanel>
    <BasePanel v-else>
      <template #title>Заявки из API · Frontend Meetup</template>
      <ul class="registration-list">
        <li v-for="row in meetupRows" :key="row.id">{{ row.name }} · число мест: {{ row.count }}</li>
      </ul>
    </BasePanel>
  </main>
  <p class="address">
    Адрес страницы <a :href="address" target="_blank" rel="noopener">Открыть этот же адрес ↗</a>
  </p>
</template>
