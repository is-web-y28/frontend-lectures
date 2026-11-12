<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import HighlightedCode from './HighlightedCode.vue'
import source from '../public/examples/05-css-organization/source/scenario.scss?raw'
import artifact from '../public/examples/05-css-organization/generated/scenario.css?raw'

const moved = ref(false)
const featured = ref(false)
const disabled = ref(false)
const artifactEnabled = ref(true)
const showSource = ref(false)
const layeredOverride = ref(false)
const overrideEnabled = ref(false)
const frame = ref<HTMLIFrameElement | null>(null)
const measured = ref('Читаем DOM…')
const overrideCss = computed(() => {
  if (!overrideEnabled.value) return ''
  const rule = '.event-card { border-color: #7c3aed; }'
  return layeredOverride.value ? `@layer overrides { ${rule} }` : rule
})
const card = computed(() => `<article id="event-card" class="event-card${featured.value ? ' event-card_featured' : ''}"><h2>Frontend Meetup</h2><p>Каскад без сюрпризов · 18:00</p><button class="event-card__action" type="button"${disabled.value ? ' disabled' : ''}>Зарегистрироваться</button></article>`)
const document = computed(() => `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>
* { box-sizing: border-box; }
body { margin: 0; padding: 10px; background: white; color: #172033; font: 14px/1.4 system-ui, sans-serif; }
main, aside { min-height: 65px; padding: 8px; border: 1px dashed #94a3b8; margin-bottom: 8px; }
h2 { font-size: 18px; margin: 0; } p { margin: 8px 0; }
${artifactEnabled.value ? artifact : ''}
${overrideCss.value}
</style></head><body><main aria-label="Основная программа">main .agenda${moved.value ? '' : card.value}</main><aside aria-label="Боковая колонка">aside .sidebar${moved.value ? card.value : ''}</aside></body></html>`)
watch(document, () => { measured.value = 'Читаем DOM…' })
function readStyle(event: Event) {
  const current = event.currentTarget as HTMLIFrameElement
  if (current !== frame.value) return
  const card = current.contentDocument?.getElementById('event-card')
  const button = current.contentDocument?.querySelector('button')
  if (!card || !button) return
  measured.value = `border ${getComputedStyle(card).borderTopColor}; shadow ${getComputedStyle(card).boxShadow === 'none' ? 'none' : 'есть'}; disabled ${button.disabled}`
}
function reset() {
  moved.value = featured.value = disabled.value = showSource.value = layeredOverride.value = overrideEnabled.value = false
  artifactEnabled.value = true
}
</script>

<template>
  <section class="organization-scenario" aria-label="Общий сценарий организации CSS">
    <div class="controls">
      <button type="button" :aria-pressed="moved" @click="moved = !moved">В aside</button>
      <button type="button" :aria-pressed="featured" @click="featured = !featured">_featured</button>
      <button type="button" :aria-pressed="artifactEnabled" @click="artifactEnabled = !artifactEnabled">CSS-артефакт</button>
      <button type="button" :aria-pressed="showSource" @click="showSource = !showSource">Исходник Sass</button>
      <button type="button" :aria-pressed="overrideEnabled" @click="overrideEnabled = !overrideEnabled">Внешнее правило</button>
      <button type="button" :aria-pressed="layeredOverride" @click="layeredOverride = !layeredOverride">В слой overrides</button>
      <button type="button" :aria-pressed="disabled" @click="disabled = !disabled">Регистрация закрыта</button>
      <button type="button" @click="reset">Начать заново</button>
    </div>
    <div class="demo-grid">
      <div class="preview-panel">
        <div class="iframe-stage"><iframe ref="frame" :srcdoc="document" sandbox="allow-same-origin" title="Перенос, каскад и состояние одной карточки" @load="readStyle" /></div>
        <output aria-live="polite">{{ measured }}</output>
      </div>
      <div class="code-panel">
        <p>{{ showSource ? 'source/scenario.scss' : 'generated/scenario.css' }}</p>
        <HighlightedCode :code="showSource ? source : artifact" :lang="showSource ? 'scss' : 'css'" />
        <HighlightedCode v-if="overrideCss" :code="overrideCss" lang="css" />
        <p><code>npm run build:css-examples</code> · переключатель подключает готовый CSS; Sass выполняется в терминале.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.organization-scenario { display: flex; flex: 1; flex-direction: column; min-height: 0; gap: 0.6rem; }
.controls { display: flex; flex-wrap: wrap; gap: 0.35rem; }
button { background: var(--surface-bg); border: var(--surface-border); border-radius: 999px; color: var(--fg); font: inherit; font-size: 0.65rem; padding: 0.3rem 0.5rem; cursor: pointer; }
button[aria-pressed='true'] { background: color-mix(in oklab, var(--accent) 15%, var(--surface-bg)); border-color: var(--accent); }
button:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
.demo-grid { display: grid; flex: 1; min-height: 0; gap: 0.7rem; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
.preview-panel { display: flex; flex-direction: column; gap: 0.4rem; min-height: 0; }
.iframe-stage { flex: 1; position: relative; min-height: 180px; border: var(--surface-border); border-radius: 0.5rem; overflow: hidden; }
iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
output, .code-panel p { font-size: 0.67rem; color: var(--fg-dim); margin: 0; }
.code-panel { min-width: 0; min-height: 0; overflow: auto; padding: 0.5rem; border: var(--surface-border); border-radius: 0.5rem; background: var(--surface-bg); }
.code-panel :deep(pre) { font-size: 0.6rem; line-height: 1.3; }
</style>
