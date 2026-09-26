<template>
  <section class="transform-flow" aria-label="Transform сдвигает карточку визуально, но сохраняет её место в потоке">
    <div class="flow-label">нормальный поток</div>
    <div class="scene">
      <div class="slot"><span>место карточки</span></div>
      <div class="card transformed"><strong>Карточка</strong><small><code>translateY(-0.75rem)</code></small></div>
      <div class="neighbor"><strong>Следующий элемент</strong><small>не занимает освободившееся место</small></div>
    </div>
    <div class="legend"><i></i><span>Пунктир — место, которое раскладка продолжает резервировать.</span></div>
  </section>
</template>

<style scoped>
.transform-flow {
  display: grid;
  gap: 0.55rem;
  align-content: center;
  width: 100%;
  padding: 0.8rem;
  border: var(--surface-border);
  border-radius: 0.7rem;
  background: color-mix(in oklab, var(--surface-bg) 94%, var(--accent));
}

.flow-label {
  color: var(--fg-dim);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.scene {
  position: relative;
  display: grid;
  gap: 0.65rem;
  padding: 1rem 0.8rem 0.7rem;
}

.slot,
.card,
.neighbor {
  min-height: 3rem;
  border-radius: 0.45rem;
  padding: 0.55rem;
}

.slot {
  display: grid;
  place-items: end;
  border: 2px dashed var(--accent);
  background: color-mix(in oklab, var(--accent) 5%, transparent);
  color: var(--accent);
  font-size: 0.62rem;
  font-weight: 700;
}

.card {
  display: grid;
  position: absolute;
  inset: 1rem 0.8rem auto;
  z-index: 1;
  min-height: 3rem;
  align-content: center;
  border: 1px solid color-mix(in oklab, var(--accent) 48%, var(--border));
  background: var(--surface-bg);
  box-shadow: 0 0.55rem 1rem color-mix(in oklab, var(--fg) 10%, transparent);
  transform: translateY(-0.75rem);
}

.card strong,
.neighbor strong {
  color: var(--fg);
  font-size: 0.72rem;
}

.card small,
.neighbor small {
  color: var(--fg-dim);
  font-size: 0.58rem;
}

.neighbor {
  display: grid;
  gap: 0.15rem;
  align-content: center;
  border: var(--surface-border);
  background: color-mix(in oklab, var(--fg) 5%, var(--surface-bg));
}

.legend {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  color: var(--fg-dim);
  font-size: 0.62rem;
  line-height: 1.3;
}

.legend i {
  width: 1.2rem;
  border-top: 2px dashed var(--accent);
}
</style>
