<script setup lang="ts">
import { ref } from 'vue'
import RegistrationSearchPanel from './RegistrationSearchPanel.vue'
defineProps<{ base: URL }>()
const showA = ref(true)
const showB = ref(true)
const events = ref<string[]>([])
</script>
<template>
  <div>
    <p class="notice">Отдельный список только для чтения. fetch и проверка JSON настоящие; задержки и 503 имитируются. Кеш каждого экземпляра — 5 секунд.</p>
    <div class="controls"><button type="button" @click="showA = !showA">{{ showA ? 'Закрыть A' : 'Открыть A' }}</button><button type="button" @click="showB = !showB">{{ showB ? 'Закрыть B' : 'Открыть B' }}</button></div>
    <div class="columns">
      <RegistrationSearchPanel v-if="showA" label="A" :base="base" @trace="events.push($event)" />
      <RegistrationSearchPanel v-if="showB" label="B" :base="base" @trace="events.push($event)" />
    </div>
    <p role="status">{{ events.join(' · ') }}</p>
  </div>
</template>
