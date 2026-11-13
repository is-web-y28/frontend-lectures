<script setup lang="ts">
import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, useTemplateRef } from 'vue'
import type { LifecycleRecorder } from './lifecycle-types'
const props = defineProps<{ value: number; record: LifecycleRecorder }>()
const output = useTemplateRef<HTMLElement>('output')
function log(hook: string) {
  props.record({ owner: 'Ребёнок', hook, state: props.value, dom: output.value?.textContent?.trim() ?? 'нет' })
}
log('setup')
onBeforeMount(() => log('beforeMount'))
onMounted(() => log('mounted'))
onBeforeUpdate(() => log('beforeUpdate'))
onUpdated(() => log('updated'))
onBeforeUnmount(() => log('beforeUnmount'))
onUnmounted(() => log('unmounted'))
</script>
<template>
  <section class="panel" aria-label="Дочерний экземпляр">
    <h3>Ребёнок: value из prop</h3>
    <p ref="output">{{ value }}</p>
  </section>
</template>
