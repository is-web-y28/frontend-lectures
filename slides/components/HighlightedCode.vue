<script setup lang="ts">
import { createBundledHighlighter, createSingletonShorthands } from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'
import { ref, watchEffect } from 'vue'

const createHighlighter = createBundledHighlighter({
  langs: {
    css: () => import('@shikijs/langs/css'),
    html: () => import('@shikijs/langs/html'),
    http: () => import('@shikijs/langs/http'),
  },
  themes: {
    'vitesse-dark': () => import('@shikijs/themes/vitesse-dark'),
    'vitesse-light': () => import('@shikijs/themes/vitesse-light'),
  },
  engine: () => createJavaScriptRegexEngine(),
})
const { codeToHtml } = createSingletonShorthands(createHighlighter)

const props = withDefaults(defineProps<{
  code: string
  lang?: 'css' | 'html' | 'http' | 'text'
  strikeLines?: number[]
}>(), {
  lang: 'text',
  strikeLines: () => [],
})

const highlighted = ref('')
let renderVersion = 0

watchEffect(async () => {
  const version = ++renderVersion
  const strikeLines = new Set(props.strikeLines)
  let line = 0
  let html = await codeToHtml(props.code, {
    lang: props.lang,
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
    defaultColor: false,
  })

  html = html.replace('class="shiki ', 'class="shiki slidev-code component-code-block ')
  html = html.replace(/<span class="line">/g, (match) => {
    line += 1
    return strikeLines.has(line) ? '<span class="line code-line-loser">' : match
  })

  if (version === renderVersion)
    highlighted.value = html
})
</script>

<template>
  <div class="highlighted-code slidev-code-line-numbers">
    <div v-if="highlighted" v-html="highlighted" />
    <pre v-else class="shiki slidev-code component-code-block"><code>{{ code }}</code></pre>
  </div>
</template>

<style scoped>
.highlighted-code {
  min-width: 0;
}

.highlighted-code :deep(pre) {
  margin: 0;
}

.highlighted-code :deep(.code-line-loser) {
  text-decoration: line-through 2px #b91c1c;
}

</style>
