<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import bootstrapCss from '../public/examples/05-css-organization/generated/bootstrap.css?raw'
import meetupCss from '../public/examples/05-css-organization/generated/meetup.css?raw'
import tailwindCss from '../public/examples/05-css-organization/generated/tailwind.css?raw'
import HighlightedCode from './HighlightedCode.vue'

type FrameworkMode = 'bem' | 'bootstrap' | 'tailwind'

const props = withDefaults(defineProps<{
  initialMode?: FrameworkMode
}>(), {
  initialMode: 'bem',
})

const selectedMode = ref<FrameworkMode>(props.initialMode)
const narrowPreview = ref(false)
const registrationDisabled = ref(false)
const bootstrapCustomized = ref(false)
const registrationStatus = ref('Нажмите нативную кнопку в карточке.')
const previewFrame = ref<HTMLIFrameElement | null>(null)
let registrationButton: HTMLButtonElement | null = null

const description = 'Разбираем каскад, слои и правила, которые помогают команде не потерять CSS через полгода.'

const modes: Array<{
  id: FrameworkMode
  label: string
  frameworkLabel: string
  css: string
}> = [
  {
    id: 'bem',
    label: 'BEM + Sass',
    frameworkLabel: 'Sass → собственный BEM',
    css: meetupCss,
  },
  {
    id: 'bootstrap',
    label: 'Bootstrap',
    frameworkLabel: 'Bootstrap 5',
    css: bootstrapCss,
  },
  {
    id: 'tailwind',
    label: 'Tailwind',
    frameworkLabel: 'Tailwind CSS',
    css: tailwindCss,
  },
]

const activeMode = computed(() => modes.find((mode) => mode.id === selectedMode.value) ?? modes[0])

const bootstrapStyle = computed(() => bootstrapCustomized.value
  ? ' style="--bs-btn-padding-x: 1.25rem; --bs-btn-border-radius: 0.75rem;"'
  : '')

const cardMarkup = computed(() => {
  const disabled = registrationDisabled.value ? ' disabled' : ''

  if (selectedMode.value === 'bem') {
    return `<main class="css-tools-page" style="padding: 0.75rem 0;">
  <article class="meetup-card" aria-labelledby="bem-title">
    <p class="meetup-card__label">Sass → собственный BEM</p>
    <h2 class="meetup-card__title" id="bem-title">Frontend Meetup</h2>
    <p class="meetup-card__meta">18 октября · 19:00 · онлайн</p>
    <p class="meetup-card__description">${description}</p>
    <button class="meetup-card__action" id="registration-action" type="button"${disabled}>Зарегистрироваться</button>
  </article>
</main>`
  }

  if (selectedMode.value === 'bootstrap') {
    return `<article class="card shadow-sm" aria-labelledby="bootstrap-title">
  <div class="card-body p-4">
    <p class="text-uppercase fw-semibold small text-primary mb-2">Bootstrap</p>
    <h2 class="card-title h3" id="bootstrap-title">Frontend Meetup</h2>
    <p class="card-subtitle text-body-secondary mb-3">18 октября · 19:00 · онлайн</p>
    <p class="card-text">${description}</p>
    <button class="btn btn-primary registration-action" id="registration-action" type="button"${bootstrapStyle.value}${disabled}>Зарегистрироваться</button>
  </div>
</article>`
  }

  return `<article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="tailwind-title">
  <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-teal-700">Tailwind</p>
  <h2 class="m-0 text-2xl font-bold text-slate-950" id="tailwind-title">Frontend Meetup</h2>
  <p class="mb-4 mt-2 text-sm text-slate-600">18 октября · 19:00 · онлайн</p>
  <p class="mb-5 leading-6 text-slate-700">${description}</p>
  <button class="inline-flex rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white no-underline transition enabled:hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700" id="registration-action" type="button"${disabled}>Зарегистрироваться</button>
</article>`
})

const iframeDocument = computed(() => `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${activeMode.value.css}</style>
  <style>html { font-size: 12px; }</style>
</head>
<body>
${cardMarkup.value}
</body>
</html>`)

const markupCode = computed(() => cardMarkup.value)

const customizationCode = computed(() => bootstrapCustomized.value
  ? '<button class="btn btn-primary registration-action"\n  style="--bs-btn-padding-x: 1.25rem;\n         --bs-btn-border-radius: 0.75rem;">'
  : '<button class="btn btn-primary registration-action">')

function resetRegistrationStatus() {
  registrationStatus.value = registrationDisabled.value
    ? 'У кнопки установлен нативный disabled: она не получает фокус и не срабатывает.'
    : 'Нажмите нативную кнопку в карточке.'
}

function selectMode(mode: FrameworkMode) {
  selectedMode.value = mode
  resetRegistrationStatus()
}

function toggleRegistrationDisabled() {
  registrationDisabled.value = !registrationDisabled.value
  resetRegistrationStatus()
}

function toggleBootstrapCustomization() {
  bootstrapCustomized.value = !bootstrapCustomized.value
  resetRegistrationStatus()
}

function onRegistrationClick() {
  registrationStatus.value = `Регистрация выбрана: ${activeMode.value.frameworkLabel}.`
}

function handleFrameLoad() {
  registrationButton?.removeEventListener('click', onRegistrationClick)
  registrationButton = previewFrame.value?.contentDocument?.getElementById('registration-action') as HTMLButtonElement | null
  registrationButton?.addEventListener('click', onRegistrationClick)
}

onBeforeUnmount(() => {
  registrationButton?.removeEventListener('click', onRegistrationClick)
  registrationButton = null
})
</script>

<template>
  <section class="framework-compare-demo" aria-label="Сравнение BEM, Bootstrap и Tailwind для карточки мероприятия">
    <header class="demo-header">
      <div>
        <p class="eyebrow">Три реальных CSS-артефакта</p>
        <h3>Один смысл — разная разметка и CSS</h3>
      </div>
      <div class="controls" aria-label="Управление сравнением CSS-подходов">
        <button
          v-for="mode in modes"
          :key="mode.id"
          type="button"
          :class="{ selected: selectedMode === mode.id }"
          :aria-pressed="selectedMode === mode.id"
          @click="selectMode(mode.id)"
        >
          {{ mode.label }}
        </button>
        <button
          type="button"
          :class="{ selected: narrowPreview }"
          :aria-pressed="narrowPreview"
          @click="narrowPreview = !narrowPreview"
        >
          {{ narrowPreview ? 'Широкий предпросмотр' : 'Узкий предпросмотр' }}
        </button>
        <button
          type="button"
          :class="{ selected: registrationDisabled }"
          :aria-pressed="registrationDisabled"
          @click="toggleRegistrationDisabled"
        >
          {{ registrationDisabled ? 'Включить регистрацию' : 'Отключить регистрацию' }}
        </button>
        <button
          v-if="selectedMode === 'bootstrap'"
          type="button"
          :class="{ selected: bootstrapCustomized }"
          :aria-pressed="bootstrapCustomized"
          @click="toggleBootstrapCustomization"
        >
          {{ bootstrapCustomized ? 'Стандартные размеры Bootstrap' : 'Настроить --bs-btn-*' }}
        </button>
      </div>
    </header>

    <div class="demo-grid">
      <div class="preview-panel">
        <p class="panel-label">Рендерит только {{ activeMode.frameworkLabel }}</p>
        <div class="iframe-viewport" :class="{ narrow: narrowPreview }">
          <iframe
            :key="`${selectedMode}-${registrationDisabled}-${bootstrapCustomized}`"
            ref="previewFrame"
            :srcdoc="iframeDocument"
            sandbox="allow-same-origin"
            :title="`Карточка Frontend Meetup: ${activeMode.frameworkLabel}`"
            @load="handleFrameLoad"
          />
        </div>
        <p class="status" aria-live="polite">{{ registrationStatus }}</p>
      </div>

      <div class="code-panel">
        <p class="panel-label">Фактическая разметка</p>
        <HighlightedCode :code="markupCode" lang="html" class="markup-code" />
        <div v-if="selectedMode === 'bootstrap'" class="customization-note">
          <p><code>.registration-action</code> меняет публичные переменные кнопки.</p>
          <HighlightedCode :code="customizationCode" lang="html" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.framework-compare-demo {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.7rem;
  min-height: 0;
  width: 100%;
}

.demo-header {
  align-items: end;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.eyebrow,
.panel-label {
  color: var(--fg-dim);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  margin: 0;
  text-transform: uppercase;
}

h3 {
  color: var(--fg);
  font-size: 1.05rem;
  margin: 0.15rem 0 0;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: flex-end;
  max-width: 34rem;
}

.controls button {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 999px;
  color: var(--fg);
  cursor: pointer;
  font: inherit;
  font-size: 0.64rem;
  padding: 0.3rem 0.48rem;
}

.controls button.selected {
  background: color-mix(in oklab, var(--accent) 15%, var(--surface-bg));
  border-color: var(--accent);
  color: var(--accent-deep, var(--accent));
  font-weight: 800;
}

button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.demo-grid {
  display: grid;
  flex: 1;
  gap: 0.7rem;
  grid-template-columns: minmax(17rem, 1fr) minmax(20rem, 1fr);
  min-height: 0;
}

.preview-panel,
.code-panel {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 0.65rem;
  min-height: 0;
  padding: 0.65rem;
}

.preview-panel {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.iframe-viewport {
  align-items: stretch;
  display: flex;
  flex: 1;
  justify-content: center;
  min-height: 0;
}

iframe {
  border: 1px solid var(--border);
  border-radius: 0.42rem;
  flex: 1;
  height: 100%;
  min-height: 0;
  width: 100%;
}

.iframe-viewport.narrow iframe {
  flex: 0 1 19rem;
}

.status {
  color: var(--fg-dim);
  font-size: 0.68rem;
  line-height: 1.3;
  margin: 0;
}

.code-panel {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  overflow: hidden;
}

.markup-code {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.code-panel :deep(pre) {
  font-size: 0.55rem;
  line-height: 1.32;
  margin: 0;
  max-height: 13.4rem;
  overflow: auto;
}

.customization-note {
  border-inline-start: 0.2rem solid var(--accent);
  color: var(--fg-dim);
  font-size: 0.65rem;
  flex-shrink: 0;
  margin-top: auto;
  padding-inline-start: 0.45rem;
}

.customization-note p {
  line-height: 1.3;
  margin: 0 0 0.3rem;
}

.customization-note code {
  color: var(--accent-deep, var(--accent));
}

.customization-note :deep(pre) {
  font-size: 0.52rem;
  max-height: 4rem;
}

@media (max-width: 720px) {
  .demo-header {
    align-items: start;
    flex-direction: column;
  }

  .controls {
    justify-content: start;
  }

  .demo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
