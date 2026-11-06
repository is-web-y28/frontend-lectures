<script setup lang="ts">
import { ref } from 'vue'
import { onSlideLeave } from '@slidev/client'
import AsyncRegistrationsApp from './AsyncRegistrationsApp.vue'

const revision = ref(0)
onSlideLeave(() => revision.value++)
</script>

<template>
  <section class="async-vue-demo" aria-label="Тот же сценарий на Vue">
    <header>
      <span>Frontend Meetup · Vue + общий JavaScript-модуль</span>
      <button type="button" @click="revision++">Начать заново</button>
    </header>
    <p class="demo-note">Тот же клиент, проверки и кеш. Чтение JSON настоящее; задержки, изменение источника и 503 имитируются.</p>
    <div class="app-stage"><AsyncRegistrationsApp :key="revision" /></div>
  </section>
</template>

<style scoped>
.async-vue-demo { display: flex; flex: 1; flex-direction: column; gap: .6rem; min-height: 0; color: var(--fg); }
header { display: flex; justify-content: space-between; align-items: center; gap: .5rem; font-size: .65rem; color: var(--fg-dim); }
button { font: inherit; color: var(--fg); background: var(--surface-bg); border: 1px solid var(--surface-border); border-radius: .35rem; padding: .35rem .55rem; cursor: pointer; }
button:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.demo-note { margin: 0; color: var(--fg-dim); font-size: .6rem; }
.app-stage { overflow: auto; padding: .7rem; border: 1px solid var(--surface-border); border-radius: .5rem; min-height: 0; }
</style>
