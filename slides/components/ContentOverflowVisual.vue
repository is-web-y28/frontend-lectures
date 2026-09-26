<template>
  <section class="overflow-visual" aria-label="Сравнение переполнения и корректного переноса длинной ссылки">
    <article class="case bad">
      <header><strong>Без ограничения</strong><span>потомок расширяет Grid</span></header>
      <div class="container"><div class="card"><span class="token">https://example.dev/events/frontend/registration</span></div></div>
    </article>

    <article class="case good">
      <header><strong>С ограничением</strong><span>карточка сжимается, токен переносится</span></header>
      <div class="container"><div class="card"><span class="token">https://example.dev/events/frontend/registration</span></div></div>
    </article>
  </section>
</template>

<style scoped>
.overflow-visual {
  display: grid;
  gap: 0.7rem;
  align-content: center;
  width: 100%;
}

.case {
  display: grid;
  grid-template-columns: minmax(8rem, 0.75fr) minmax(0, 1.25fr);
  gap: 0.6rem;
  align-items: center;
  padding: 0.65rem;
  overflow: hidden;
  border: var(--surface-border);
  border-radius: 0.65rem;
  background: color-mix(in oklab, var(--surface-bg) 94%, var(--accent));
}

header {
  display: grid;
  gap: 0.14rem;
}

header strong {
  color: var(--fg);
  font-size: 0.76rem;
}

header span {
  color: var(--fg-dim);
  font-size: 0.62rem;
  line-height: 1.3;
}

.container {
  width: 72%;
  min-width: 0;
  border: 2px dashed color-mix(in oklab, var(--accent) 42%, var(--border));
  border-radius: 0.4rem;
  padding: 0.35rem;
}

.card {
  min-width: 0;
  border-radius: 0.3rem;
  background: var(--surface-bg);
  padding: 0.4rem;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  line-height: 1.35;
}

.bad .token {
  white-space: nowrap;
}

.good .token {
  overflow-wrap: anywhere;
}

.bad .container::after {
  display: block;
  margin-top: 0.2rem;
  color: var(--accent);
  content: "переполнение →";
  font-size: 0.58rem;
  font-weight: 700;
  text-align: end;
}
</style>
