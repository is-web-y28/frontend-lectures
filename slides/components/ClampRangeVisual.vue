<template>
  <section class="clamp-range" aria-label="Минимальная, гибкая и максимальная области функции clamp">
    <div class="scale" aria-hidden="true">
      <span class="zone minimum"></span>
      <span class="zone fluid"></span>
      <span class="zone maximum"></span>
      <i class="mark start"></i>
      <i class="mark end"></i>
    </div>
    <div class="labels">
      <span><strong>2rem</strong><small>минимум</small></span>
      <span><strong>5vw</strong><small>гибкая область</small></span>
      <span><strong>4rem</strong><small>максимум</small></span>
    </div>
    <div class="samples">
      <article class="small"><small>узкое окно</small><strong>Заголовок</strong></article>
      <article class="fluid-size"><small>среднее окно</small><strong>Заголовок</strong></article>
      <article class="large"><small>широкое окно</small><strong>Заголовок</strong></article>
    </div>
  </section>
</template>

<style scoped>
.clamp-range {
  display: grid;
  gap: 0.75rem;
  align-content: center;
  width: 100%;
  padding: 1rem;
  border: var(--surface-border);
  border-radius: 0.7rem;
  background: color-mix(in oklab, var(--surface-bg) 94%, var(--accent));
}

.scale {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  height: 0.7rem;
  overflow: hidden;
  border-radius: 999px;
}

.zone.minimum,
.zone.maximum {
  background: color-mix(in oklab, var(--fg) 12%, var(--surface-bg));
}

.zone.fluid {
  background: linear-gradient(90deg, color-mix(in oklab, var(--accent) 28%, var(--surface-bg)), var(--accent));
}

.mark {
  position: absolute;
  inset-block: -0.2rem;
  width: 2px;
  background: var(--fg);
}

.mark.start { inset-inline-start: 25%; }
.mark.end { inset-inline-start: 75%; }

.labels {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  color: var(--fg-dim);
  font-size: 0.64rem;
  text-align: center;
}

.labels span {
  display: grid;
  gap: 0.1rem;
}

.labels strong {
  color: var(--accent);
  font-family: var(--font-mono);
}

.samples {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.45rem;
  align-items: end;
}

.samples article {
  display: grid;
  gap: 0.3rem;
  min-height: 4.5rem;
  align-content: end;
  padding: 0.45rem;
  border: var(--surface-border);
  border-radius: 0.4rem;
  background: var(--surface-bg);
}

.samples small {
  color: var(--fg-dim);
  font-size: 0.58rem;
}

.samples strong {
  color: var(--fg);
  line-height: 1;
}

.samples .small strong { font-size: 1rem; }
.samples .fluid-size strong { font-size: 1.35rem; }
.samples .large strong { font-size: 1.7rem; }
</style>
