<template>
  <section class="container-context" aria-label="Одна карточка в широком main и узком aside">
    <div class="viewport-label"><span>один viewport</span><i></i></div>
    <div class="contexts">
      <section class="host main-host">
        <p class="host-label"><code>main</code> · широкий контейнер</p>
        <article class="event-card">
          <div class="card-body"><span class="thumb"></span><div><strong>Современный CSS</strong><small>Изображение и текст стоят рядом</small></div></div>
        </article>
      </section>

      <aside class="host aside-host">
        <p class="host-label"><code>aside</code> · узкий контейнер</p>
        <article class="event-card">
          <div class="card-body"><span class="thumb"></span><div><strong>Современный CSS</strong><small>Карточка остаётся в одной колонке</small></div></div>
        </article>
      </aside>
    </div>
    <p class="conclusion">Ширина страницы одинакова — доступное пространство компонента различается.</p>
  </section>
</template>

<style scoped>
.container-context {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  justify-content: center;
  gap: 0.7rem;
  width: 100%;
}

.viewport-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--fg-dim);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.viewport-label i {
  flex: 1;
  height: 1px;
  background: color-mix(in oklab, var(--accent) 45%, var(--border));
}

.contexts {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(12rem, 0.75fr);
  gap: 0.75rem;
}

.host {
  container-type: inline-size;
  display: grid;
  gap: 0.55rem;
  align-content: start;
  padding: 0.7rem;
  border: 2px dashed color-mix(in oklab, var(--accent) 48%, var(--border));
  border-radius: 0.65rem;
  background: color-mix(in oklab, var(--surface-bg) 94%, var(--accent));
}

.host-label {
  margin: 0;
  color: var(--fg-dim);
  font-size: 0.68rem;
}

.event-card {
  min-width: 0;
  border: var(--surface-border);
  border-radius: 0.5rem;
  background: var(--surface-bg);
  padding: 0.55rem;
}

.card-body {
  display: grid;
  gap: 0.55rem;
  min-width: 0;
}

.thumb {
  display: block;
  min-height: 3.6rem;
  border-radius: 0.35rem;
  background:
    linear-gradient(145deg, transparent 48%, color-mix(in oklab, var(--accent) 28%, transparent) 49%),
    color-mix(in oklab, var(--accent) 12%, var(--surface-bg));
}

.card-body div {
  display: grid;
  gap: 0.25rem;
  align-content: center;
  min-width: 0;
}

.card-body strong {
  color: var(--fg);
  font-size: 0.78rem;
}

.card-body small {
  color: var(--fg-dim);
  font-size: 0.63rem;
  line-height: 1.3;
}

.conclusion {
  margin: 0;
  color: var(--fg-dim);
  font-size: 0.76rem;
  text-align: center;
}

@container (min-width: 24rem) {
  .card-body {
    grid-template-columns: 5.5rem minmax(0, 1fr);
    align-items: center;
  }
}
</style>
