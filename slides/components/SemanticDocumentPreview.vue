<template>
  <section class="semantic-document-preview" aria-label="Предпросмотр семантической HTML-страницы мероприятия">
    <iframe
      src="/examples/01-web-html/index.html"
      title="Семантическая HTML-страница мероприятия"
    ></iframe>
    <a href="/examples/01-web-html/index.html" target="_blank" rel="noreferrer">
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
