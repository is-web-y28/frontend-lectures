<template>
  <section
    class="container-demo"
    aria-label="Одна карточка в широком и узком контейнерах"
  >
    <section class="host host-main" aria-label="Широкий основной контейнер">
      <p class="host-label">main · широкий контейнер</p>
      <article class="event-card">
        <div class="event-card__body">
          <div class="media" aria-hidden="true">CSS</div>
          <div>
            <p class="eyebrow">18:00 · Основной зал</p>
            <h3>Modern CSS: условия интерфейса</h3>
            <p>
              Изображение и текст становятся двумя зонами, когда ширина самой
              карточки это позволяет.
            </p>
          </div>
        </div>
      </article>
    </section>

    <aside class="host host-aside" aria-label="Узкий боковой контейнер">
      <p class="host-label">aside · узкий контейнер</p>
      <article class="event-card">
        <div class="event-card__body">
          <div class="media" aria-hidden="true">CSS</div>
          <div>
            <p class="eyebrow">18:00 · Основной зал</p>
            <h3>Modern CSS: условия интерфейса</h3>
            <p>
              Та же карточка остаётся в одной колонке и читается без отдельного
              viewport breakpoint.
            </p>
          </div>
        </div>
      </article>
    </aside>

    <p class="hint">
      Условие принадлежит карточке: query меняет её потомка, а не измеряемый
      контейнер.
    </p>
  </section>
</template>

<style scoped>
.container-demo {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(13rem, 0.6fr);
  gap: 0.7rem;
  color: var(--fg);
}

.host {
  min-width: 0;
  border: 2px dashed color-mix(in oklab, var(--accent) 45%, var(--fg-dim));
  border-radius: 0.65rem;
  padding: 0.65rem;
}

.host-aside {
  border-color: color-mix(in oklab, var(--good) 55%, var(--fg-dim));
}

.host-label,
.eyebrow,
.hint {
  margin: 0 0 0.45rem;
  color: var(--fg-dim);
  font-size: 0.72rem;
}

.event-card {
  container-type: inline-size;
  border: var(--surface-border);
  border-radius: 0.5rem;
  background: var(--surface-bg);
  padding: 0.7rem;
}

.event-card__body {
  display: grid;
  gap: 0.65rem;
}

.media {
  display: grid;
  min-height: 5rem;
  place-items: center;
  border-radius: 0.35rem;
  background: color-mix(in oklab, var(--accent) 17%, var(--surface-bg));
  color: var(--accent-deep, var(--accent));
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.event-card h3,
.event-card p {
  margin: 0;
}

.event-card h3 {
  font-size: 0.98rem;
}

.event-card p:not(.eyebrow) {
  margin-top: 0.35rem;
  color: var(--fg-dim);
  font-size: 0.78rem;
}

.hint {
  grid-column: 1 / -1;
  margin: 0;
}

@container (min-width: 24rem) {
  .event-card__body {
    align-items: center;
    grid-template-columns: 6rem minmax(0, 1fr);
  }

  .media {
    min-height: 6rem;
  }
}
</style>
