<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useLifecycleTrace } from '../composables/useLifecycleTrace'

const emit = defineEmits<{ trace: [message: string] }>()
function report(message: string) { emit('trace', message) }

useLifecycleTrace('A', report)
useLifecycleTrace('B', report)
onMounted(() => report('Компонент: mounted'))
onUnmounted(() => report('Компонент: unmounted'))
</script>

<template>
  <section class="panel" aria-label="Общий владелец хуков">
    <h3>Один компонент</h3>
    <p>setup вызвал useLifecycleTrace('A') и useLifecycleTrace('B').</p>
    <p>Два composables и собственные callbacks подключены к одному экземпляру.</p>
  </section>
</template>
