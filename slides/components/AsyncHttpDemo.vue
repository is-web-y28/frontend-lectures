<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{ mode: 'waiting' | 'event-loop' | 'http' | 'state' | 'race' | 'cache' | 'full'; scenario?: 'basic' | 'nested' | 'chain' | 'timer' | 'await' | 'pending' }>()

const revision = ref(0)
const source = computed(() => `${import.meta.env.BASE_URL}examples/10-async-http/index.html?demo=${props.mode}&case=${props.scenario || 'basic'}`)
</script>

<template>
  <section class="javascript-state-demo" aria-label="Асинхронные данные Frontend Meetup">
    <header class="demo-toolbar">
      <span>Frontend Meetup · ожидание и HTTP</span>
      <div class="demo-actions">
        <button type="button" @click="revision++">Начать заново</button>
        <a :href="source" target="_blank" rel="noopener">Открыть отдельно ↗</a>
      </div>
    </header>
    <div class="demo-stage">
      <iframe
        :key="`${mode}-${scenario}-${revision}`"
        :src="`${source}&embedded=1`"
        :title="`Асинхронная демонстрация: ${mode}`"
      />
    </div>
  </section>
</template>

<style scoped>
.javascript-state-demo {
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  gap: 0.5rem;
}
.demo-toolbar, .demo-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.demo-toolbar { color: var(--fg-dim); font-size: 0.68rem; }
.demo-actions button, .demo-actions a {
  background: var(--surface-bg);
  color: var(--fg);
  border: 1px solid var(--surface-border);
  border-radius: 0.35rem;
  font: inherit;
  padding: 0.3rem 0.5rem;
}
.demo-actions button { cursor: pointer; }
.demo-actions :focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.demo-stage {
  position: relative;
  flex: 1 1 0;
  min-height: 15rem;
  overflow: hidden;
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  background: white;
}
.demo-stage iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
</style>
