<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  mode: 'legacy' | 'routes' | 'page-state' | 'store' | 'api' | 'dependency' | 'contract' | 'locale' | 'fallback' | 'full'
  initialPath?: string
}>()

const revision = ref(0)
const sources = computed(() => {
  const entry = `${import.meta.env.BASE_URL}examples/12-vue-architecture/index.html?demo=${props.mode}`
  const path = props.initialPath ? `#${props.initialPath}` : ''
  return {
    standalone: `${entry}${path}`,
    embedded: `${entry}&embedded=1${path}`,
  }
})
</script>

<template>
  <section class="vue-architecture-demo" aria-label="Архитектура приложения Frontend Meetup">
    <header class="demo-toolbar">
      <span>Frontend Meetup · архитектура приложения</span>
      <div class="demo-actions">
        <button type="button" @click="revision++">Начать заново</button>
        <a :href="sources.standalone" target="_blank" rel="noopener">Открыть отдельно ↗</a>
      </div>
    </header>
    <div class="demo-stage">
      <iframe
        :key="`${mode}-${revision}`"
        :src="sources.embedded" loading="lazy"
        :title="`Демонстрация Frontend Meetup: ${mode}`"
      />
    </div>
  </section>
</template>

<style scoped>
.vue-architecture-demo {
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
