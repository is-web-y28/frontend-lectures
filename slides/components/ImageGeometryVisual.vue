<template>
  <section class="image-geometry" aria-label="Сравнение исходного кадра и рамки с object-fit cover">
    <figure>
      <div class="frame source-frame">
        <div class="scene">
          <span class="sun"></span>
          <span class="speaker"></span>
          <span class="stage"></span>
        </div>
      </div>
      <figcaption><strong>Исходник 4:3</strong><span>Весь кадр сохраняется</span></figcaption>
    </figure>

    <span class="arrow" aria-hidden="true">→</span>

    <figure>
      <div class="frame crop-frame">
        <div class="scene cropped">
          <span class="sun"></span>
          <span class="speaker"></span>
          <span class="stage"></span>
        </div>
      </div>
      <figcaption><strong>Рамка 16:9</strong><span><code>cover</code> обрезает края</span></figcaption>
    </figure>
  </section>
</template>

<style scoped>
.image-geometry {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 0.65rem;
  align-items: center;
  padding: 0.8rem;
  border: var(--surface-border);
  border-radius: 0.7rem;
  background: color-mix(in oklab, var(--surface-bg) 92%, var(--accent));
}

figure {
  display: grid;
  gap: 0.55rem;
  min-width: 0;
  margin: 0;
}

.frame {
  position: relative;
  overflow: hidden;
  border: 2px solid color-mix(in oklab, var(--accent) 52%, var(--border));
  border-radius: 0.5rem;
  background: var(--surface-raised, var(--surface-bg));
}

.source-frame {
  aspect-ratio: 4 / 3;
}

.crop-frame {
  aspect-ratio: 16 / 9;
}

.scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background:
    linear-gradient(to bottom, color-mix(in oklab, var(--accent) 14%, var(--surface-bg)) 0 58%, transparent 58%),
    var(--surface-bg);
}

.scene.cropped {
  inset-inline: -18%;
}

.sun {
  position: absolute;
  inset: 14% 12% auto auto;
  width: 1.65rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: color-mix(in oklab, var(--accent) 58%, var(--surface-bg));
}

.stage {
  position: absolute;
  inset: auto 0 0;
  height: 42%;
  background: color-mix(in oklab, var(--fg) 12%, var(--surface-bg));
  clip-path: polygon(0 34%, 34% 18%, 64% 40%, 100% 10%, 100% 100%, 0 100%);
}

.speaker {
  position: absolute;
  z-index: 1;
  inset: 38% auto auto 45%;
  width: 12%;
  height: 42%;
  border-radius: 999px 999px 0 0;
  background: var(--accent);
}

.speaker::before {
  position: absolute;
  inset: -28% 8% auto;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--accent);
  content: "";
}

.arrow {
  color: var(--accent);
  font-size: 1.4rem;
  font-weight: 800;
}

figcaption {
  display: grid;
  gap: 0.12rem;
  color: var(--fg-dim);
  font-size: 0.7rem;
  line-height: 1.3;
  text-align: center;
}

figcaption strong {
  color: var(--fg);
  font-size: 0.78rem;
}
</style>
