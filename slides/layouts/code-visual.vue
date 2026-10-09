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
  grid-template-rows: minmax(0, 1fr);
  gap: var(--sp-6);
  align-items: stretch;
  min-height: 0;
  flex: 1;
  margin-block-start: var(--sp-4);
}

.code-visual-code,
.code-visual-result {
  min-width: 0;
  min-height: 0;
}

.code-visual-code {
  display: flex;
  align-items: stretch;
}

.code-visual-code :deep(.slidev-code-wrapper) {
  width: 100%;
  max-height: 100%;
  overflow: auto;
}

.code-visual-code :deep(pre) {
  width: 100%;
  margin: 0;
  --slidev-code-font-size: 11px;
  --slidev-code-line-height: 13px;
  --slidev-code-padding: 8px;
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
