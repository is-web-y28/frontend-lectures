<script setup lang="ts">
import { useId, useTemplateRef } from 'vue'
defineProps<{ tag: 'p' | 'section'; count: number }>()
const instanceId = useId()
const output = useTemplateRef<HTMLElement>('output')
defineExpose({ getElement: () => output.value, instanceId })
</script>
<template>
  <component :is="tag" ref="output" :data-count="count" :class="{ 'is-emphasized': count % 2 === 0 }">
    <span>Frontend Meetup</span>
    <strong>Мест: {{ count }}</strong>
  </component>
</template>
