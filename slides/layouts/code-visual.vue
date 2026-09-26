<script setup>
import { useSlideContext } from "@slidev/client";

const { $frontmatter } = useSlideContext();
</script>

<template>
  <SlideFrame mode="topic">
    <div class="code-visual-layout">
      <div class="code-visual-code">
        <slot />
      </div>
      <div class="code-visual-result">
        <slot name="visual" />
      </div>
    </div>
    <p
      v-if="$frontmatter.takeaway"
      class="code-visual-takeaway"
      v-html="$frontmatter.takeaway"
    ></p>
  </SlideFrame>
</template>

<style scoped>
.code-visual-layout {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: var(--sp-6);
  align-items: stretch;
  min-height: 0;
}

.code-visual-code,
.code-visual-result {
  min-width: 0;
}

.code-visual-code {
  display: flex;
  align-items: center;
}

.code-visual-code :deep(.slidev-code-wrapper) {
  max-width: 100%;
  overflow-x: auto;
}

.code-visual-code :deep(pre) {
  width: 100%;
  margin: 0;
}

.code-visual-result {
  display: flex;
  align-items: stretch;
}

.code-visual-result :deep(> *) {
  flex: 1;
  min-width: 0;
}

.code-visual-takeaway {
  margin: var(--sp-4) 0 0;
  color: var(--fg-dim);
  font-size: 0.78rem;
  line-height: 1.35;
  text-align: center;
}
</style>
