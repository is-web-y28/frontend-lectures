<script setup lang="ts">
import { computed, ref } from 'vue'
const count = ref(1)
const canAdd = computed(() => count.value < 5)
</script>

<template>
  <button type="button" :disabled="!canAdd"
    @click="count++">Ещё место</button>
  <p>Мест: {{ count }}</p>
  <p v-if="!canAdd" role="status">Достигнут лимит</p>
</template>
