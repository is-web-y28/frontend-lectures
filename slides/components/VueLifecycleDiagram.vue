<script setup lang="ts">
const source = `${import.meta.env.BASE_URL}examples/11-vue-components/lifecycle.svg`
</script>
<template>
  <figure class="lifecycle-map">
    <a :href="source" target="_blank" rel="noopener" aria-label="Открыть схему жизненного цикла отдельно">
      <img :src="source" alt="Setup и первое монтирование; повторяемая петля beforeUpdate, обновление DOM, updated; beforeUnmount, удаление и unmounted">
    </a>
    <figcaption>Клиентский цикл одного экземпляра · без KeepAlive и асинхронных потомков</figcaption>
  </figure>
</template>
<style scoped>
.lifecycle-map { display: flex; flex: 1; flex-direction: column; justify-content: center; min-height: 0; margin: 0; gap: 8px; }
a { display: flex; justify-content: center; min-height: 0; }
img { width: 100%; max-height: 330px; object-fit: contain; }
a:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
figcaption { text-align: center; color: var(--fg-dim); font-size: 12px; }
</style>
