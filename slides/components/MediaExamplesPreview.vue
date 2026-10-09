<script setup lang="ts">
import { ref } from 'vue'
import { onSlideLeave } from '@slidev/client'

const preview = ref<HTMLIFrameElement | null>(null)
const exampleUrl = `${import.meta.env.BASE_URL}examples/01-web-html/media.html`

onSlideLeave(() => {
  const document = preview.value?.contentDocument
  if (!document) return
  for (const media of document.querySelectorAll<HTMLMediaElement>('audio, video')) {
    media.pause()
  }
})
</script>

<template>
  <section class="media-examples-preview" aria-label="Рабочие примеры audio, video и track">
    <div class="iframe-stage">
      <iframe
        ref="preview"
        :src="exampleUrl"
        title="Нативные проигрыватели и русские субтитры"
        allowfullscreen
      ></iframe>
    </div>
    <a :href="exampleUrl" target="_blank" rel="noreferrer">Открыть пример в новой вкладке</a>
  </section>
</template>

<style scoped>
.media-examples-preview {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.6rem;
}

.iframe-stage {
  position: relative;
  height: 20rem;
}

iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: var(--surface-border);
  border-radius: var(--radius-sm);
  background: var(--surface-bg);
}

a {
  align-self: flex-start;
  color: var(--accent);
  font-size: 0.75rem;
}
</style>
