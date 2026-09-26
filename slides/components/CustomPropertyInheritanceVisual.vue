<template>
  <section class="property-tree" aria-label="Наследование пользовательского свойства двумя поддеревьями">
    <div class="subtree event-tree">
      <div class="node parent"><code>.event-card</code><strong>--accent</strong></div>
      <span class="connector">наследуется</span>
      <div class="children"><div class="node child"><span class="badge">badge</span></div><div class="node child"><span class="link">link</span></div></div>
    </div>

    <div class="subtree workshop-tree">
      <div class="node parent"><code>.workshop-card</code><strong>--accent</strong></div>
      <span class="connector">переопределяется локально</span>
      <div class="children"><div class="node child"><span class="badge">badge</span></div><div class="node child"><span class="link">link</span></div></div>
    </div>
  </section>
</template>

<style scoped>
.property-tree {
  display: grid;
  gap: 0.7rem;
  align-content: center;
  width: 100%;
}

.subtree {
  --local-accent: var(--accent);
  display: grid;
  grid-template-columns: minmax(8rem, 0.8fr) auto minmax(0, 1.2fr);
  gap: 0.45rem;
  align-items: center;
  padding: 0.65rem;
  border: var(--surface-border);
  border-radius: 0.65rem;
  background: color-mix(in oklab, var(--surface-bg) 94%, var(--local-accent));
}

.workshop-tree {
  --local-accent: var(--good, var(--accent));
}

.node {
  min-width: 0;
  border: 1px solid color-mix(in oklab, var(--local-accent) 48%, var(--border));
  border-radius: 0.4rem;
  background: var(--surface-bg);
  padding: 0.45rem;
}

.parent {
  display: grid;
  gap: 0.2rem;
}

.parent code {
  color: var(--fg);
  font-size: 0.66rem;
}

.parent strong {
  color: var(--local-accent);
  font-family: var(--font-mono);
  font-size: 0.68rem;
}

.connector {
  color: var(--fg-dim);
  font-size: 0.57rem;
  text-align: center;
}

.connector::after {
  display: block;
  color: var(--local-accent);
  content: "→";
  font-size: 1rem;
}

.children {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.35rem;
}

.child {
  display: grid;
  min-height: 2.4rem;
  place-items: center;
}

.badge {
  border-radius: 999px;
  background: var(--local-accent);
  color: var(--on-accent, white);
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.18rem 0.4rem;
}

.link {
  color: var(--local-accent);
  font-size: 0.62rem;
  font-weight: 700;
  text-decoration: underline;
}
</style>
