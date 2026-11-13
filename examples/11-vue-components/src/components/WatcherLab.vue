<script setup lang="ts">
import { ref, useId, watch, watchEffect } from 'vue'

const query = ref('Анна')
const diagnostic = ref(0)
const queryId = useId()
const events = ref<{
  observer: 'watch' | 'watchEffect'
  query: string
  diagnostic: number
}[]>([])

watch(query, () => {
  events.value.push({ observer: 'watch', query: query.value, diagnostic: diagnostic.value })
}, { immediate: true })

watchEffect(() => {
  events.value.push({ observer: 'watchEffect', query: query.value, diagnostic: diagnostic.value })
})
</script>

<template>
  <div>
    <p>Оба callback читают <code>query</code> и <code>diagnostic</code> — служебную метку журнала.</p>
    <label :for="queryId">Имя для поиска · query</label>
    <input :id="queryId" v-model="query">
    <div class="controls">
      <button type="button" @click="diagnostic++">Изменить метку журнала</button>
      <span>diagnostic = {{ diagnostic }}</span>
    </div>
    <div class="columns">
      <section v-for="observer in (['watch', 'watchEffect'] as const)" :key="observer" class="panel" :aria-label="observer">
        <h3>{{ observer }}</h3>
        <p v-if="observer === 'watch'"><code>watch(query, callback, { immediate: true })</code></p>
        <p v-else><code>watchEffect(callback)</code></p>
        <p>{{ observer === 'watch' ? 'Источник — query.' : 'Зависимости — query и diagnostic.' }}</p>
        <ol class="event-log" :aria-label="`Выполнения ${observer}`">
          <li v-for="(event, index) in events.filter(event => event.observer === observer)" :key="index">
            {{ index + 1 }}. query={{ event.query }}, diagnostic={{ event.diagnostic }}
          </li>
        </ol>
      </section>
    </div>
  </div>
</template>

<style scoped>
.event-log {
  margin: 4px 0 0;
}

code {
  overflow-wrap: anywhere;
}
</style>
