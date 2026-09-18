<template>
  <section class="comparison" aria-label="Один документ с базовым и авторским оформлением">
    <article class="document browser-view">
      <p class="label">Только браузер</p>
      <h2>Frontend Meetup</h2>
      <p>17 сентября · 19:00</p>
      <a href="#program">Открыть программу</a>
    </article>
    <article class="document author-view">
      <p class="label">С авторским CSS</p>
      <h2>Frontend Meetup</h2>
      <p>17 сентября · 19:00</p>
      <a href="#program">Открыть программу</a>
    </article>
    <p class="caption">HTML одинаковый: меняется только представление. У первого варианта тоже есть базовые стили браузера.</p>
  </section>
</template>

<style scoped>
.comparison {
  display: grid;
  flex: 1;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
  min-height: 0;
  width: 100%;
  margin-top: 1rem;
}

.document {
  border: 1px solid var(--lecture-border);
  min-height: 11rem;
  padding: 1rem;
}

.browser-view {
  background: #ffffff;
  color: #000000;
  font-family: initial;
}

.browser-view h2 {
  font-size: 1.5em;
  font-family: initial;
}

.browser-view a {
  color: #0000ee;
  text-decoration: underline;
  font-family: initial;
}

.author-view {
  background: #f0f9ff;
  border: 2px solid #7dd3fc;
  border-radius: 0.5rem;
  color: #172033;
  font-family: system-ui, sans-serif;
}

.author-view h2 {
  color: #075985;
  font-size: 1.55rem;
  margin-top: 1.4rem;
}

.author-view a {
  color: #075985;
  font-weight: 700;
}

.label {
  color: #475569;
  font-family: system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin: 0;
  text-transform: uppercase;
}

.caption {
  color: var(--lecture-muted);
  font-size: 0.83rem;
  grid-column: 1 / -1;
  margin: 0;
}
</style>
