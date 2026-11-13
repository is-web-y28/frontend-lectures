<script setup lang="ts">
import { computed, ref } from 'vue'
const props = withDefaults(defineProps<{ count?: number }>(), { count: 1 })
const initial = ref(props.count)
const current = computed(() => props.count)
</script>
<template>
  <section class="panel">
    <h3>Дочерний экземпляр</h3>
    <p>props.count: <strong data-testid="prop">{{ props.count }}</strong></p>
    <p>ref(props.count): <strong data-testid="snapshot">{{ initial }}</strong></p>
    <p>computed(() =&gt; props.count): <strong data-testid="live">{{ current }}</strong></p>
  </section>
</template>
