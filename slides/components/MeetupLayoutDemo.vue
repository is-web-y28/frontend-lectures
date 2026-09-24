<script setup>
const events = [
  { title: 'Welcome talk', text: 'Открытие митапа', badge: 'Бесплатно' },
  { title: 'CSS Layout', text: 'Поток, Flexbox и Grid', badge: 'Новое' },
  { title: 'Grid в production', text: 'Разбор реального интерфейса' },
]
</script>

<template>
  <section class="meetup-demo" aria-label="Собранный пример Frontend Meetup">
    <div class="legend">
      <span class="flow">поток</span>
      <span class="flex">Flexbox</span>
      <span class="grid">Grid</span>
      <span class="position">positioning</span>
    </div>

    <header class="header">
      <strong>Frontend Meetup</strong>
      <nav aria-label="Навигация">
        <a href="#program">Программа</a>
        <a href="#register">Регистрация</a>
      </nav>
    </header>

    <div class="page-grid">
      <aside class="sidebar">Начало в 18:00<br><a href="#register">Зарегистрироваться</a></aside>

      <section id="program" class="schedule">
        <h3>День 1</h3>
        <div class="card-grid">
          <article v-for="event in events" :key="event.title" class="event-card">
            <span v-if="event.badge" class="badge">{{ event.badge }}</span>
            <strong>{{ event.title }}</strong>
            <p>{{ event.text }}</p>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.meetup-demo {
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 0.55rem;
  color: #1e293b;
  font-size: 0.72rem;
}

.legend,
.header,
.header nav {
  display: flex;
  align-items: center;
}

.legend {
  flex-wrap: wrap;
  gap: 0.35rem;
}

.legend span {
  border: 1px solid currentColor;
  border-radius: 999px;
  padding: 0.1rem 0.4rem;
}

.flow { color: #64748b; }
.flex { color: #2563eb; }
.grid { color: #16a34a; }
.position { color: #dc2626; }

.header {
  justify-content: space-between;
  gap: 1rem;
  border: 2px solid #60a5fa;
  border-radius: 0.5rem;
  padding: 0.55rem 0.75rem;
}

.header nav {
  gap: 0.6rem;
}

.header a,
.sidebar a {
  color: #0369a1;
  text-decoration: none;
}

.page-grid {
  display: grid;
  grid-template-columns: minmax(7rem, 0.45fr) minmax(0, 1fr);
  gap: 0.65rem;
  border: 2px solid #86efac;
  border-radius: 0.5rem;
  padding: 0.65rem;
}

.sidebar {
  align-self: start;
  position: sticky;
  top: 0;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  padding: 0.55rem;
}

.schedule {
  min-width: 0;
}

.schedule h3 {
  position: sticky;
  top: 0;
  z-index: 1;
  margin: 0 0 0.45rem;
  border-bottom: 1px solid #cbd5e1;
  background: white;
  padding: 0.25rem 0;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.45rem;
}

.event-card {
  position: relative;
  min-width: 0;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  padding: 0.55rem;
}

.event-card p {
  margin: 0.25rem 0 0;
  color: #475569;
}

.badge {
  position: absolute;
  inset-block-start: 0.3rem;
  inset-inline-end: 0.3rem;
  border: 1px solid #fca5a5;
  border-radius: 999px;
  background: #fef2f2;
  color: #b91c1c;
  padding: 0.05rem 0.25rem;
  font-size: 0.58rem;
}

@media (max-width: 700px) {
  .page-grid,
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
