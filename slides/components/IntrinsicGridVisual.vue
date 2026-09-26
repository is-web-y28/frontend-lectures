<template>
  <section class="intrinsic-grid" aria-label="Число колонок Grid при трёх доступных ширинах">
    <div class="sample narrow">
      <span class="sample-label">узко · 1 колонка</span>
      <div class="cards"><span>A</span><span>B</span><span>C</span></div>
    </div>
    <div class="sample medium">
      <span class="sample-label">средне · 2 колонки</span>
      <div class="cards"><span>A</span><span>B</span><span>C</span></div>
    </div>
    <div class="sample wide">
      <span class="sample-label">широко · 3 колонки</span>
      <div class="cards"><span>A</span><span>B</span><span>C</span></div>
    </div>
  </section>
</template>

<style scoped>
.intrinsic-grid {
  display: grid;
  gap: 0.65rem;
  align-content: center;
  width: 100%;
  padding: 0.8rem;
  border: var(--surface-border);
  border-radius: 0.7rem;
  background: color-mix(in oklab, var(--surface-bg) 94%, var(--accent));
}

.sample {
  display: grid;
  gap: 0.3rem;
}

.sample.narrow { width: 38%; }
.sample.medium { width: 69%; }
.sample.wide { width: 100%; }

.sample-label {
  color: var(--fg-dim);
  font-size: 0.68rem;
  font-weight: 700;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
  gap: 0.35rem;
}

.cards span {
  display: grid;
  min-height: 2rem;
  place-items: center;
  border: 1px solid color-mix(in oklab, var(--accent) 48%, var(--border));
  border-radius: 0.4rem;
  background: var(--surface-bg);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 800;
}
</style>
