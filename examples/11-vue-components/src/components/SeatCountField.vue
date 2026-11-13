<script setup lang="ts">
import { useId } from 'vue'
defineOptions({ inheritAttrs: false })
const count = defineModel<number | string>({ required: true })
const id = useId()
</script>
<template>
  <div>
    <label :for="id">Места</label>
    <input v-bind="$attrs" :id="id" v-model.number="count" type="number" min="1" max="5" step="1" required :aria-describedby="`${id}-hint`">
    <small :id="`${id}-hint`">От 1 до 5 целых мест</small>
  </div>
</template>
