<script setup lang="ts">
import { computed, ref } from 'vue'
import HighlightedCode from './HighlightedCode.vue'

const narrow = ref(false)
const longText = ref(false)
const singleColumn = ref(false)

const layoutCss = computed(() => `.header nav {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.page-grid {
  display: grid;
  grid-template-columns: ${singleColumn.value ? '1fr' : '100px minmax(0, 1fr)'};
}
.card-grid {
  display: grid;
  grid-template-columns: ${singleColumn.value ? '1fr' : 'repeat(3, minmax(0, 1fr))'};
}
.event-card { position: relative; min-width: 0; }
.event-card p { overflow-wrap: anywhere; }
.badge { position: absolute; top: 6px; right: 6px; }
.schedule h3 { position: sticky; top: 0; z-index: 1; }`)

const iframeDocument = computed(() => `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><base href="about:srcdoc"><style>
* { box-sizing: border-box; }
html { scroll-behavior: auto; }
body { margin: 0; padding: 12px; color: #1e293b; background: white; font: 14px/1.45 system-ui, sans-serif; }
a { color: #0369a1; }
a:focus-visible, [tabindex]:focus-visible { outline: 3px solid #c2410c; outline-offset: 3px; }
.header { border: 2px solid #60a5fa; padding: 10px; margin-bottom: 10px; }
.header nav { margin-top: 8px; }
.page-grid { align-items: start; gap: 10px; }
.sidebar { border: 1px solid #94a3b8; border-radius: 6px; padding: 8px; }
.schedule { min-width: 0; }
.schedule h3 { margin: 0 0 8px; padding: 6px; background: #dcfce7; border-bottom: 2px solid #16a34a; }
.card-grid { gap: 8px; }
.event-card { border: 2px solid #16a34a; border-radius: 6px; padding: 32px 8px 8px; }
.event-card p { margin: 8px 0 0; }
.badge { background: #fef2f2; color: #991b1b; border: 1px solid #dc2626; padding: 1px 4px; font-size: 11px; }
.registration { margin-top: 12px; padding: 10px; border: 2px solid #94a3b8; }
${layoutCss.value}
</style></head><body>
<header class="header"><strong>Frontend Meetup</strong><nav aria-label="Навигация"><a href="#program">Программа</a><a href="#register">Регистрация</a><a href="#details">Подробности</a></nav></header>
<div class="page-grid"><aside class="sidebar">Начало в 18:00<br>Зал «Код»</aside>
<section class="schedule" aria-labelledby="program"><h3 id="program" tabindex="-1">День 1</h3><div class="card-grid">
<article class="event-card"><span class="badge">Бесплатно</span><strong>Welcome talk</strong><p>${longText.value ? 'Открытие митапа: сначала обсудим путь документа, затем проверим раскладку на длинном содержимом. Материалы: frontend-meetup.example.org/program/very-long-registration-token' : 'Открытие митапа'}</p></article>
<article class="event-card"><span class="badge">Новое</span><strong>CSS Layout</strong><p>Поток, Flexbox и Grid</p></article>
<article class="event-card"><strong>Grid в production</strong><p>Разбор реального интерфейса</p></article>
</div><p id="details" tabindex="-1">Содержание остаётся в исходном порядке. В этом примере нет автоматического breakpoint.</p></section></div>
<section id="register" class="registration" tabindex="-1"><h3>Регистрация</h3><p>Переход привёл к этой области; отправку формы здесь не реализуем.</p><a href="#program">Вернуться к программе</a></section>
</body></html>`)

function reset() {
  narrow.value = false
  longText.value = false
  singleColumn.value = false
}
</script>

<template>
  <section class="meetup-demo" aria-label="Итоговая проверка раскладки Frontend Meetup">
    <div class="controls" aria-label="Условия раскладки">
      <button type="button" :aria-pressed="longText" @click="longText = !longText">Длинный текст</button>
      <button type="button" :aria-pressed="narrow" @click="narrow = !narrow">Узкая область</button>
      <button type="button" :aria-pressed="singleColumn" @click="singleColumn = !singleColumn">Одна колонка</button>
      <button type="button" @click="reset">Начать заново</button>
    </div>
    <p class="legend">Серый — поток · синий — Flexbox · зелёный — Grid и sticky · красный — absolute</p>
    <div class="demo-grid">
      <div class="preview-stage" aria-label="Прокручиваемая область примера">
        <iframe :srcdoc="iframeDocument" :style="{ width: narrow ? '360px' : '100%' }" sandbox="allow-same-origin" title="Страница Meetup: программа и регистрация" />
      </div>
      <div class="code-panel">
        <HighlightedCode :code="layoutCss" lang="css" />
        <p>Ширина и схема колонок меняются отдельно. Прокрутите страницу и перейдите к регистрации клавиатурой.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.meetup-demo { display: flex; flex: 1; flex-direction: column; min-height: 0; gap: 0.55rem; }
.controls { display: flex; flex-wrap: wrap; gap: 0.4rem; }
button { border: var(--surface-border); border-radius: 999px; background: var(--surface-bg); color: var(--fg); cursor: pointer; font: inherit; font-size: 0.7rem; padding: 0.35rem 0.65rem; }
button[aria-pressed='true'] { background: var(--accent); color: var(--bg, white); }
button:focus-visible, .preview-stage:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.legend { margin: 0; color: var(--fg-dim); font-size: 0.65rem; }
.demo-grid { display: grid; flex: 1; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 0.7rem; min-height: 0; }
.preview-stage { border: var(--surface-border); border-radius: 0.5rem; min-height: 0; position: relative; overflow: auto; }
iframe { border: 0; display: block; height: 100%; min-height: 230px; max-width: 100%; position: absolute; inset: 0; }
.code-panel { min-width: 0; min-height: 0; overflow: auto; background: var(--surface-bg); border: var(--surface-border); border-radius: 0.5rem; padding: 0.6rem; }
.code-panel :deep(pre) { font-size: 0.62rem; line-height: 1.4; }
.code-panel p { font-size: 0.7rem; color: var(--fg-dim); }
</style>
