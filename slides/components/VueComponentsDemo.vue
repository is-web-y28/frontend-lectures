<script setup lang="ts">
import { ref } from 'vue'
import { onSlideEnter, onSlideLeave } from '@slidev/client'
import App from '../../examples/11-vue-components/src/App.vue'
import '../../examples/11-vue-components/src/styles.css'
defineProps<{ mode: string }>()
const active = ref(false)
const revision = ref(0)
const base = new URL(`${import.meta.env.BASE_URL}examples/10-async-http/`, location.href)
onSlideEnter(() => { active.value = true })
onSlideLeave(() => { active.value = false })
</script>
<template>
  <section class="components-demo">
    <header><span>Frontend Meetup · настоящие компоненты Vue</span><button type="button" @click="revision++">Начать заново</button></header>
    <div class="demo-stage"><App v-if="active" :key="revision" :mode="mode" :base="base" /></div>
  </section>
</template>
<style scoped>
.components-demo { display: flex; flex: 1; flex-direction: column; gap: 10px; min-height: 0; }
header { display: flex; justify-content: space-between; align-items: center; color: var(--fg-dim); font-size: 12px; }
button { font: inherit; color: var(--fg); padding: 5px 9px; border: 1px solid var(--surface-border); border-radius: 6px; background: var(--surface-bg); }
button:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.demo-stage { min-height: 0; overflow: auto; flex: 1; padding: 5px; }
</style>
