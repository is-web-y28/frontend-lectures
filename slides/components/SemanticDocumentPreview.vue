<script setup lang="ts">
const exampleUrl = `${import.meta.env.BASE_URL}examples/01-web-html/index.html`
</script>

<template>
  <section class="semantic-document-preview" aria-label="Предпросмотр семантической HTML-страницы мероприятия">
    <iframe
      :src="exampleUrl"
      title="Семантическая HTML-страница мероприятия"
    ></iframe>
    <a :href="exampleUrl" target="_blank" rel="noreferrer">
      Открыть пример в новой вкладке
    </a>
  </section>
</template>

<style scoped>
.semantic-document-preview {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.6rem;
}

iframe {
  min-height: 0;
  flex: 1;
  width: 100%;
  border: var(--surface-border);
  border-radius: var(--radius-sm);
  background: var(--surface-bg);
}

a {
  align-self: flex-start;
  color: var(--accent);
}
</style>
