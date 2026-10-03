<template>
  <section class="typography-demo" aria-label="Сравнение читаемости текста в карточке">
    <article class="card cramped">
      <p class="label">До: правила есть, читать трудно</p>
      <h3>Frontend Meetup</h3>
      <p>Вечерняя встреча для тех, кто создаёт интерфейсы и хочет обсуждать решения, а не только инструменты.</p>
      <a href="#program">Открыть программу</a>
    </article>

    <article class="card readable">
      <p class="label">После: текст задаёт ритм карточки</p>
      <h3>Frontend Meetup</h3>
      <p>Вечерняя встреча для тех, кто создаёт интерфейсы и хочет обсуждать решения, а не только инструменты.</p>
      <a href="#program">Открыть программу</a>
    </article>

    <p class="check"><strong>Проверка чтения:</strong> основной текст <code>#334155</code> на белом фоне — контраст 10.35:1; ссылка дополнительно подчёркнута.</p>
  </section>
</template>

<style scoped>
.typography-demo {
  display: grid;
  flex: 1;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
  min-height: 0;
  width: 100%;
}

.card {
  background: var(--lecture-surface);
  border: 1px solid var(--lecture-border);
  border-radius: 0.5rem;
  color: #334155;
  margin: 0;
  padding: 1.25rem;
}

.card h3 {
  color: #172033;
  margin: 0 0 0.75rem;
}

.card p:not(.label) {
  margin: 0 0 1rem;
}

.label {
  color: var(--lecture-muted);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin: 0 0 1rem;
  text-transform: uppercase;
}

.cramped {
  font-family: Arial, sans-serif;
  font-size: 0.88rem;
  line-height: 1.15;
}

.cramped a {
  color: #334155;
  text-decoration: none;
}

.readable {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 1rem;
  line-height: 1.5;
}

.readable p:not(.label) {
  max-width: 65ch;
}

.readable a {
  color: #075985;
  font-weight: 700;
  text-decoration-line: underline;
  text-decoration-thickness: 0.1em;
  text-underline-offset: 0.15em;
}

.check {
  color: var(--lecture-muted);
  font-size: 0.82rem;
  grid-column: 1 / -1;
  line-height: 1.4;
  margin: 0;
}

.check strong {
  color: var(--lecture-ink);
}
</style>
