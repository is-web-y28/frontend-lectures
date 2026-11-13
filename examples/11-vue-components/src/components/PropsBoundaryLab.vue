<script setup lang="ts">
import { ref } from 'vue'
import PropsProbe from './PropsProbe.vue'
const count = ref(1)
const passValue = ref(true)
const revision = ref(0)
</script>
<template>
  <div>
    <p class="notice">Родитель хранит count. Ребёнок сравнивает вход, начальную копию и живое вычисление.</p>
    <div class="controls">
      <button type="button" @click="count++">Увеличить у родителя</button>
      <label class="inline"><input v-model="passValue" type="checkbox"> Передавать count</label>
      <button type="button" @click="revision++">Новый экземпляр</button>
    </div>
    <p role="status">Родитель: count = {{ count }} · key = {{ revision }}</p>
    <PropsProbe :key="revision" :count="passValue ? count : undefined" />
  </div>
</template>
