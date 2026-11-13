<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
const props = defineProps<{ listen: (fn: () => void) => () => void; trace: (message: string) => void }>()
const draft = ref('')
let release: (() => void) | undefined
onMounted(() => {
  props.trace('mounted: поле появилось, подписка установлена')
  release = props.listen(() => props.trace('Получено событие window'))
})
onUnmounted(() => { release?.(); props.trace('unmounted: экземпляр удалён') })
</script>
<template><label>Черновик экземпляра<input v-model="draft" placeholder="Введите Вера"></label></template>
