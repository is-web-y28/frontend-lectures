<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import VClickGap from '@slidev/client/builtin/VClickGap.vue'
import { markdownToPlainText } from '../markdown'
import MarkdownText from './MarkdownText.vue'

type Option = {
  label: string
  correct: boolean
}

const props = defineProps<{
  question: string
  options: Option[]
  explanation: string
}>()

const { $clicks } = useSlideContext()
const isRevealed = computed(() => $clicks.value >= 1)

const questionText = computed(() => markdownToPlainText(props.question))
</script>

<template>
  <section class="quiz" :aria-label="`Вопрос: ${questionText}`">
    <VClickGap :size="2" />

    <h3><MarkdownText inline :source="question" /></h3>
    <div class="options" role="list" aria-label="Варианты ответа">
      <div
        v-for="option in options"
        :key="option.label"
        class="option"
        :class="{ correct: isRevealed && option.correct }"
        :aria-label="isRevealed && option.correct ? `${markdownToPlainText(option.label)}. Верный ответ` : undefined"
        role="listitem"
      >
        <span><MarkdownText inline :source="option.label" /></span>
      </div>
    </div>

    <Transition name="quiz-feedback">
      <p v-if="isRevealed" class="feedback" role="status">
        <strong>Почему:</strong> <MarkdownText inline :source="explanation" />
      </p>
    </Transition>
  </section>
</template>

<style scoped>
.quiz {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: 0.5rem;
  padding: 1rem 1.2rem;
}

.quiz h3 {
  font-size: 1.2rem;
  margin: 0 0 0.8rem;
}

.options {
  display: grid;
  gap: 0.55rem;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
}

.option {
  align-items: center;
  background: color-mix(in oklab, var(--fg) 4%, var(--surface-bg));
  border: var(--surface-border);
  border-radius: 0.35rem;
  color: var(--fg);
  display: flex;
  font: inherit;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0.7rem;
  text-align: left;
  transition: background-color 180ms ease, border-color 180ms ease, border-width 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.option.correct {
  background: color-mix(in oklab, var(--good) 15%, var(--surface-bg));
  border-color: var(--good);
  border-width: 2px;
  box-shadow: 0 0.2rem 0.6rem color-mix(in srgb, var(--good) 18%, transparent);
  transform: translateY(-0.08rem);
}

.feedback {
  margin: 0.85rem 0 0;
}

.quiz-feedback-enter-active,
.quiz-feedback-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.quiz-feedback-enter-from,
.quiz-feedback-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem);
}

@media (prefers-reduced-motion: reduce) {
  .option,
  .quiz-feedback-enter-active,
  .quiz-feedback-leave-active {
    transition: none;
  }
}
</style>
