<template>
  <section class="keyframe-sequence" aria-label="Три состояния CSS-анимации от 0 до 100 процентов">
    <article class="frame start"><span class="percent">0%</span><div class="notice">Уведомление</div><small>opacity: 0<br>translateY(.5rem)</small></article>
    <span class="arrow" aria-hidden="true">→</span>
    <article class="frame middle"><span class="percent">50%</span><div class="notice">Уведомление</div><small>opacity: .6<br>translateY(.2rem)</small></article>
    <span class="arrow" aria-hidden="true">→</span>
    <article class="frame finish"><span class="percent">100%</span><div class="notice">Уведомление</div><small>opacity: 1<br>translateY(0)</small></article>
  </section>
</template>

<style scoped>
.keyframe-sequence {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 0.4rem;
  align-items: center;
  width: 100%;
  padding: 0.8rem;
  border: var(--surface-border);
  border-radius: 0.7rem;
  background: color-mix(in oklab, var(--surface-bg) 94%, var(--accent));
}

.frame {
  display: grid;
  gap: 0.55rem;
  min-width: 0;
  text-align: center;
}

.percent {
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 800;
}

.notice {
  border-inline-start: 0.22rem solid var(--accent);
  border-radius: 0.35rem;
  background: var(--surface-bg);
  color: var(--fg);
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.55rem 0.35rem;
}

.start .notice {
  opacity: 0.18;
  transform: translateY(0.5rem);
}

.middle .notice {
  opacity: 0.6;
  transform: translateY(0.2rem);
}

.finish .notice {
  opacity: 1;
  transform: translateY(0);
}

.frame small {
  color: var(--fg-dim);
  font-family: var(--font-mono);
  font-size: 0.52rem;
  line-height: 1.4;
}

.arrow {
  color: var(--accent);
  font-size: 1rem;
  font-weight: 800;
}
</style>
