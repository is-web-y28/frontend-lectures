<script setup lang="ts">
import { ref } from 'vue'
import LifecycleTreeParent from './LifecycleTreeParent.vue'
import type { LifecycleEntry } from './lifecycle-types'
const open = ref(false)
const entries = ref<LifecycleEntry[]>([])
function record(entry: LifecycleEntry) { entries.value.push(entry) }
</script>
<template>
  <div>
    <p class="notice">Настоящие хуки Vue. Журнал живёт вне наблюдаемого дерева; запись в него не меняет состояние родителя и ребёнка.</p>
    <div class="controls">
      <button type="button" @click="open = !open">{{ open ? 'Удалить дерево' : 'Создать дерево' }}</button>
      <button type="button" @click="entries = []">Очистить журнал</button>
    </div>
    <div class="columns">
      <LifecycleTreeParent v-if="open" :record="record" />
      <section class="panel" aria-label="Журнал хуков">
        <h3>Порядок / state / DOM</h3>
        <ol class="event-log" aria-label="События жизненного цикла">
          <li v-for="(entry, i) in entries" :key="i"><span>{{ i + 1 }}. {{ entry.owner }} · {{ entry.hook }} · {{ entry.state }} / {{ entry.dom }}</span></li>
        </ol>
        <p v-if="!entries.length">Создайте дерево, затем измените count.</p>
      </section>
    </div>
  </div>
</template>
