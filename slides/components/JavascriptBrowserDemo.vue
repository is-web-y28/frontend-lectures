<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  mode: 'types' | 'functions' | 'dom' | 'disclosure' | 'events' | 'form' | 'full' | 'multiple' | 'form-data' | 'replacement' | 'reset' | 'delegation' | 'native'
  compact?: boolean
}>(), { compact: false })

const revision = ref(0)
const source = computed(() => `${import.meta.env.BASE_URL}examples/06-javascript-browser/${props.mode === 'native' ? 'native.html' : `index.html?demo=${props.mode}`}`)
</script>

<template>
  <section class="javascript-browser-demo" :class="{ compact }" aria-label="Настоящий HTML и JavaScript в браузере">
    <header class="demo-toolbar">
      <span>Frontend Meetup · HTML + JavaScript</span>
      <div class="demo-actions">
        <button type="button" @click="revision++">Начать заново</button>
        <a :href="source" target="_blank" rel="noopener">Открыть отдельно ↗</a>
      </div>
    </header>
    <div class="demo-stage">
      <iframe :key="`${mode}-${revision}`" :src="`${source}${mode === 'native' ? '?' : '&'}embedded=1`" :title="`Демонстрация JavaScript: ${mode}`" />
    </div>
  </section>
</template>

<style scoped>
.javascript-browser-demo {
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
.compact .demo-toolbar > span { display: none; }
.compact .demo-stage { min-height: 12rem; }
</style>
