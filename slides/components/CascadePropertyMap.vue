<script setup lang="ts">
import HighlightedCode from './HighlightedCode.vue'

const baseRule = `a {
  color: #0369a1;
  text-decoration-thickness: 0.1em;
}`

const classRule = `.nav-link {
  color: #172033;
  text-decoration: none;
}`
</script>

<template>
  <section class="cascade-map" aria-label="Каскад по отдельным свойствам">
    <div class="rules" aria-label="Подходящие правила">
      <p class="eyebrow">Оба правила подходят ссылке class="nav-link"</p>
      <HighlightedCode class="rule" :code="baseRule" lang="css" :strike-lines="[2]" />
      <HighlightedCode class="rule winner" :code="classRule" lang="css" />
    </div>

    <div class="computed" aria-label="Итоговые значения">
      <p class="eyebrow">Computed: по одному победителю на свойство</p>
      <dl>
        <div>
          <dt>color</dt>
          <dd><code>#172033</code><span>← .nav-link</span></dd>
        </div>
        <div>
          <dt>text-decoration</dt>
          <dd><code>none</code><span>← .nav-link</span></dd>
        </div>
        <div>
          <dt>text-decoration-thickness</dt>
          <dd><code>0.1em</code><span>← a</span></dd>
        </div>
      </dl>
      <p class="hint">Зачёркнутый <code>color</code> проиграл только для <code>color</code>, не всё правило.</p>
    </div>
  </section>
</template>

<style scoped>
.cascade-map {
  display: grid;
  flex: 1;
  gap: 1rem;
  grid-template-columns: 1.05fr 0.95fr;
  min-height: 0;
  width: 100%;
}

.rules,
.computed {
  background: var(--lecture-surface);
  border: 1px solid var(--lecture-border);
  border-radius: 0.5rem;
  padding: 0.9rem;
}

.eyebrow {
  color: var(--lecture-muted);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin: 0 0 0.7rem;
  text-transform: uppercase;
}

.rule {
  margin-top: 0.6rem;
}

.rule.winner {
  box-shadow: inset 3px 0 #075985;
}


dl {
  margin: 0;
}

dl > div {
  border-top: 1px solid var(--lecture-border);
  display: grid;
  gap: 0.4rem;
  grid-template-columns: 1.2fr 1fr;
  padding: 0.6rem 0;
}

dt {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 700;
}

dd {
  display: grid;
  gap: 0.15rem;
  margin: 0;
}

dd span,
.hint {
  color: var(--lecture-muted);
  font-size: 0.72rem;
}

dd code,
.hint code {
  color: var(--fg-dim);
}

.hint {
  line-height: 1.35;
  margin: 0.7rem 0 0;
}
</style>
