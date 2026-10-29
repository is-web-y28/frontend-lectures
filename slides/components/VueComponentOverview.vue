<script setup lang="ts">
import { ref } from 'vue'
import VueSeatCounter from './VueSeatCounter.vue'
import source from './VueSeatCounter.vue?raw'

defineProps<{ annotated?: boolean }>()
const revision = ref(0)
</script>

<template>
  <section class="component-overview" aria-label="Полный компонент выбора мест">
    <header><span>Одна заявка · от 1 до 5 мест</span><button type="button" @click="revision++">Начать заново</button></header>
    <div class="overview-stage">
      <pre aria-label="Исходник VueSeatCounter.vue"><code>{{ source.trim() }}</code></pre>
      <div class="overview-result">
        <div class="counter"><VueSeatCounter :key="revision" /></div>
        <ul v-if="annotated" class="reading-guide">
          <li><code>ref</code> хранит <code>count</code>.</li>
          <li><code>computed</code> выводит <code>canAdd</code> из количества.</li>
          <li><code>@click</code> меняет состояние.</li>
          <li><code>:disabled</code>, текст и <code>v-if</code> описывают результат.</li>
        </ul>
        <div v-else class="hint">
          <p>Предварительный просмотр: сейчас достаточно увидеть поведение.</p>
          <p>Знакомый JavaScript: <code>import</code>, <code>const</code>, <code>=&gt;</code>, <code>&lt;</code>.</p>
          <p>Связь с Vue: <code>ref</code>, <code>computed</code>, <code>@click</code>, <code>v-if</code>.</p>
          <p>К этому же исходнику вернёмся в конце.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.component-overview { display: flex; flex: 1; flex-direction: column; min-height: 0; gap: .7rem; font-size: .8rem; color: var(--fg); }
header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; color: var(--fg-dim); }
.overview-stage { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); flex: 1; min-height: 0; gap: 1rem; }
pre, .overview-result { margin: 0; padding: .9rem; overflow: auto; background: var(--surface-bg); border: var(--surface-border); border-radius: .5rem; }
pre { display: flex; align-items: center; white-space: pre-wrap; font-size: .63rem; line-height: 1.5; }
button, .counter :deep(button) { color: var(--fg); background: var(--surface-bg); border: var(--surface-border); border-radius: .3rem; padding: .35rem .6rem; font: inherit; cursor: pointer; }
.counter :deep(button:disabled) { cursor: not-allowed; opacity: .5; }
button:focus-visible, .counter :deep(:focus-visible) { outline: 3px solid var(--accent); outline-offset: 2px; }
.counter :deep(p) { margin: .6rem 0; }
.counter :deep([role=status]) { color: var(--accent); }
.hint { color: var(--fg-dim); font-size: .72rem; }
.reading-guide { margin-top: 1rem; padding-left: 1rem; font-size: .7rem; line-height: 1.6; }
.reading-guide li { margin: .5rem 0; }
@media (max-width: 600px) { .overview-stage { grid-template-columns: 1fr; overflow: auto; } pre { overflow: visible; } }
</style>
