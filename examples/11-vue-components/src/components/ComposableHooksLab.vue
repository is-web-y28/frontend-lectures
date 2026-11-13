<script setup lang="ts">
import { ref } from 'vue'
import ComposableHookOwner from './ComposableHookOwner.vue'

const show = ref(false)
const events = ref<string[]>([])
</script>

<template>
  <div>
    <div class="controls">
      <button type="button" @click="show = !show">{{ show ? 'Удалить компонент' : 'Создать компонент' }}</button>
      <button type="button" @click="events = []">Очистить журнал</button>
    </div>
    <p role="status">{{ show ? 'Компонент создан' : 'Компонента нет' }}</p>
    <ComposableHookOwner v-if="show" @trace="events.push($event)" />
    <p>Журнал хранится вне удаляемого компонента.</p>
    <ol class="event-log" aria-label="Журнал хуков">
      <li v-for="(event, index) in events" :key="index">{{ index + 1 }}. {{ event }}</li>
    </ol>
  </div>
</template>
