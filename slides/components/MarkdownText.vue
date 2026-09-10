<script setup lang="ts">
import { computed } from 'vue'
import { renderInlineMarkdown, renderMarkdown } from '../markdown'

const props = withDefaults(defineProps<{
  source: string
  inline?: boolean
}>(), {
  inline: false,
})

const content = computed(() => props.inline
  ? renderInlineMarkdown(props.source)
  : renderMarkdown(props.source))
</script>

<template>
  <component :is="inline ? 'span' : 'div'" class="markdown-text" v-html="content" />
</template>

<style scoped>
.markdown-text :deep(code) {
  background: var(--lecture-accent-soft);
  border-radius: 0.2rem;
  color: var(--lecture-accent);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  padding: 0.05em 0.22em;
}

.markdown-text :deep(p:first-child) {
  margin-top: 0;
}

.markdown-text :deep(p:last-child) {
  margin-bottom: 0;
}
</style>
