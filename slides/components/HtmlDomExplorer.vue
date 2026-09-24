<script setup lang="ts">
import { computed, ref } from 'vue'
import MarkdownText from './MarkdownText.vue'

type Entry = {
  id: string
  source: string
  dom: string
  depth: number
  description: string
}

const entries: Entry[] = [
  { id: 'html', source: '<html lang="ru">', dom: 'html', depth: 1, description: 'Корневой элемент документа. Атрибут `lang` сохраняется в DOM как свойство элемента.' },
  { id: 'head', source: '  <head>', dom: 'head', depth: 2, description: 'Узел с метаданными. Он находится в `DOM`, хотя его содержимое не видно в основной области страницы.' },
  { id: 'title', source: '    <title>Frontend Meetup</title>', dom: 'title', depth: 3, description: 'Элемент `title` остаётся узлом DOM; браузер использует его текст для названия вкладки.' },
  { id: 'body', source: '  <body>', dom: 'body', depth: 2, description: 'Контейнер отображаемого содержания страницы.' },
  { id: 'header', source: '    <header>', dom: 'header', depth: 3, description: 'Семантическая область `header` становится самостоятельным элементом DOM.' },
  { id: 'nav', source: '      <nav aria-label="Навигация">', dom: 'nav', depth: 4, description: 'Навигация вложена в `header`: эта связь вложенности сохраняется в DOM-дереве.' },
  { id: 'link', source: '        <a href="#program">Программа</a>', dom: 'a', depth: 5, description: 'Ссылка — узел `a` с атрибутом `href` и текстовым содержимым.' },
  { id: 'main', source: '    <main>', dom: 'main', depth: 3, description: 'Главное уникальное содержание страницы — сосед `header` внутри `body`.' },
  { id: 'h1', source: '      <h1>Frontend Meetup</h1>', dom: 'h1', depth: 4, description: 'Заголовок становится дочерним узлом `main`; его текст доступен через DOM.' },
]

const sourceLines = [
  { source: '<!doctype html>' },
  { id: 'html', source: '<html lang="ru">' },
  { id: 'head', source: '  <head>' },
  { id: 'title', source: '    <title>Frontend Meetup</title>' },
  { source: '  </head>' },
  { id: 'body', source: '  <body>' },
  { id: 'header', source: '    <header>' },
  { id: 'nav', source: '      <nav aria-label="Навигация">' },
  { id: 'link', source: '        <a href="#program">Программа</a>' },
  { source: '      </nav>' },
  { source: '    </header>' },
  { id: 'main', source: '    <main>' },
  { id: 'h1', source: '      <h1>Frontend Meetup</h1>' },
  { source: '    </main>' },
  { source: '  </body>' },
  { source: '</html>' },
]

const selectedId = ref('html')
const selected = computed(() => entries.find(entry => entry.id === selectedId.value) ?? entries[0])
</script>

<template>
  <section class="explorer" aria-label="Связь исходного HTML и DOM">
    <div class="column">
      <h3>Корректный HTML-фрагмент</h3>
      <template v-for="line in sourceLines" :key="line.source">
        <button
          v-if="line.id"
          type="button"
          class="code-line"
          :class="{ selected: selectedId === line.id }"
          :aria-pressed="selectedId === line.id"
          @click="selectedId = line.id"
        >
          {{ line.source }}
        </button>
        <span v-else class="code-line static-line">{{ line.source }}</span>
      </template>
    </div>

    <div class="column">
      <h3>DOM-дерево в памяти</h3>
      <p class="dom-root">#document</p>
      <p class="dom-doctype">&lt;!DOCTYPE html&gt;</p>
      <button
        v-for="entry in entries"
        :key="entry.id"
        type="button"
        class="dom-node"
        :class="{ selected: selectedId === entry.id }"
        :style="{ paddingLeft: `${entry.depth * 0.9 + 0.35}rem` }"
        :aria-pressed="selectedId === entry.id"
        @click="selectedId = entry.id"
      >
        {{ entry.dom }}
      </button>
    </div>

    <p class="description" role="status" aria-live="polite">
      <strong>{{ selected.dom }}:</strong> <MarkdownText inline :source="selected.description" />
    </p>
  </section>
</template>

<style scoped>
.explorer {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
}

.column {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 0.5rem;
  padding: 0.8rem;
}

.column h3 {
  font-size: 1.1rem;
  margin: 0 0 0.6rem;
}

.code-line,
.dom-node {
  background: transparent;
  border: 0;
  border-radius: 0.25rem;
  color: var(--fg);
  cursor: pointer;
  display: block;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.7rem;
  line-height: 1.2;
  padding: 0.06rem 0.3rem;
  text-align: left;
  white-space: pre;
  width: 100%;
}

.static-line,
.dom-root,
.dom-doctype {
  color: var(--fg-dim);
  cursor: default;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.7rem;
  line-height: 1.2;
  margin: 0;
  padding: 0.06rem 0.3rem;
}

.dom-doctype {
  padding-left: 1.25rem;
}

.code-line:hover,
.code-line:focus-visible,
.dom-node:hover,
.dom-node:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 1px;
}

.selected {
  background: color-mix(in oklab, var(--accent) 14%, var(--surface-bg));
  color: var(--accent);
  font-weight: 700;
}

.description {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 0.5rem;
  font-size: 0.85rem;
  grid-column: 1 / -1;
  line-height: 1.25;
  margin: 0;
  padding: 0.5rem 0.7rem;
}
</style>
