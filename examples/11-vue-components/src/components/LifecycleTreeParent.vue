<script setup lang="ts">
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, useTemplateRef } from 'vue'
import LifecycleTreeChild from './LifecycleTreeChild.vue'
import type { LifecycleRecorder } from './lifecycle-types'
const props = defineProps<{ record: LifecycleRecorder }>()
const count = ref(0)
const unused = ref(0)
const output = useTemplateRef<HTMLElement>('output')
function log(hook: string) {
  props.record({ owner: 'Родитель', hook, state: count.value, dom: output.value?.textContent?.trim() ?? 'нет' })
}
log('setup')
onBeforeMount(() => log('beforeMount'))
onMounted(() => log('mounted'))
onBeforeUpdate(() => log('beforeUpdate'))
onUpdated(() => log('updated'))
onBeforeUnmount(() => log('beforeUnmount'))
onUnmounted(() => log('unmounted'))
function incrementTwice() {
  count.value++
  count.value++
}
function changeUnused() {
  unused.value++
  log(`команда: unused=${unused.value}`)
}
</script>
<template>
  <section class="panel" aria-label="Родительский экземпляр">
    <h3>Родитель: count из ref</h3>
    <p ref="output">{{ count }}</p>
    <div class="controls">
      <button type="button" @click="incrementTwice">Два изменения count</button>
      <button type="button" @click="changeUnused">Изменить неиспользуемый ref</button>
    </div>
    <LifecycleTreeChild :value="count" :record="record" />
  </section>
</template>
