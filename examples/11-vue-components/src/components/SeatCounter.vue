<script setup lang="ts">
import { useSeatCount } from '../composables/useSeatCount'
defineProps<{ label: string }>()
const { count, canAdd, increment } = useSeatCount()
</script>
<template><section class="panel"><h3>{{ label }}</h3><p role="status">Мест: {{ count }}</p><button type="button" :disabled="!canAdd" @click="increment">Ещё место</button></section></template>
