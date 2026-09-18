<template>
  <section class="selector-demo" aria-label="Различие составного селектора и селектора потомка">
    <div class="code-row">
      <code>article.event-card</code>
      <span>один элемент, который одновременно article и .event-card</span>
    </div>
    <article class="article-target">
      <span class="tag">article.event-card</span>
      <section class="descendant-target">
        <span class="tag">section.event-card</span>
        Программа Frontend Meetup
      </section>
    </article>
    <div class="code-row">
      <code>article .event-card</code>
      <span>потомок .event-card внутри article</span>
    </div>
  </section>
</template>

<style scoped>
.selector-demo {
  display: grid;
  flex: 1;
  gap: 0.7rem;
  margin-top: 0.8rem;
  min-height: 0;
  width: 100%;
}

.code-row {
  align-items: center;
  color: var(--lecture-muted);
  display: flex;
  font-size: 0.78rem;
  gap: 0.7rem;
}


.code-row code {
  color: var(--fg-dim);
}

.article-target {
  background: #e0f2fe;
  border: 3px solid #075985;
  border-radius: 0.5rem;
  color: #172033;
  min-height: 8rem;
  padding: 1rem;
}

.descendant-target {
  background: #fef3c7;
  border: 1px solid #d97706;
  border-radius: 0.35rem;
  margin-top: 0.8rem;
  padding: 0.9rem;
}

.tag {
  display: block;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.7rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
}
</style>
