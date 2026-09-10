<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import VClickGap from '@slidev/client/builtin/VClickGap.vue'
import MarkdownText from './MarkdownText.vue'

type Step = {
  title: string
  label: string
  example: string
  description: string
}

const steps: Step[] = [
  {
    title: 'URL',
    label: '1. URL',
    example: 'https://events.example.org/program?day=2',
    description: 'Браузер разбирает адрес: по какой схеме работать, к какому хосту обратиться и какой ресурс запросить.',
  },
  {
    title: 'DNS',
    label: '2. DNS',
    example: 'events.example.org → 203.0.113.42',
    description: 'DNS сопоставляет доменное имя с `IP-адресом` сервера, к которому браузер сможет подключиться.',
  },
  {
    title: 'HTTP-запрос',
    label: '3. Запрос',
    example: 'GET /program?day=2 HTTP/1.1',
    description: 'Браузер в роли клиента просит сервер передать ресурс по указанному пути.',
  },
  {
    title: 'HTTP-ответ',
    label: '4. Ответ',
    example: '200 OK\nContent-Type: text/html',
    description: 'Сервер возвращает статус, заголовки и тело ответа. В этом случае телом служит `HTML`-документ.',
  },
  {
    title: 'Отрисовка',
    label: '5. DOM',
    example: 'HTML → DOM → страница',
    description: 'Браузер разбирает `HTML`, запрашивает связанные ресурсы и строит страницу, которую видит пользователь.',
  },
]

const { $clicks } = useSlideContext()
const activeIndex = computed(() => Math.min(Math.max($clicks.value, 0), steps.length - 1))
const activeStep = computed(() => steps[activeIndex.value])
</script>

<template>
  <section class="request-flow" aria-label="Этапы загрузки веб-страницы">
    <VClickGap :size="steps.length" />

    <ol class="steps" aria-label="Этапы загрузки">
      <li
        v-for="(step, index) in steps"
        :key="step.title"
        class="step"
        :class="{ active: index === activeIndex }"
        :aria-current="index === activeIndex ? 'step' : undefined"
      >
        {{ step.label }}
      </li>
    </ol>

    <Transition name="flow-detail" mode="out-in">
      <div :key="activeStep.title" class="details" role="status" aria-live="polite">
        <div>
          <h3>{{ activeStep.title }}</h3>
          <p><MarkdownText inline :source="activeStep.description" /></p>
        </div>
        <pre><code>{{ activeStep.example }}</code></pre>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.request-flow {
  background: var(--lecture-surface);
  border: 1px solid var(--lecture-border);
  border-radius: 0.5rem;
  margin-top: 1.5rem;
  padding: 1rem 1.2rem;
}

.steps {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(5, 1fr);
  list-style: none;
  margin: 0;
  padding: 0;
}

.step {
  background: var(--lecture-surface-raised);
  border: 1px solid var(--lecture-border-strong);
  border-radius: 0.35rem;
  color: var(--lecture-muted);
  padding: 0.55rem 0.45rem;
  text-align: center;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.step.active {
  background: var(--lecture-accent-soft);
  border: 2px solid var(--lecture-accent);
  color: var(--lecture-accent);
  font-weight: 700;
  transform: translateY(-0.08rem);
}

.details {
  align-items: center;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
  margin-top: 1rem;
}

.eyebrow {
  color: var(--lecture-accent);
  font-size: 0.8rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
}

h3 {
  font-size: 1.25rem;
  margin: 0.2rem 0 0.4rem;
}

.details p:last-child {
  margin: 0;
}

pre {
  margin: 0;
}

.flow-detail-enter-active,
.flow-detail-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.flow-detail-enter-from,
.flow-detail-leave-to {
  opacity: 0;
  transform: translateY(0.35rem);
}

@media (prefers-reduced-motion: reduce) {
  .step,
  .flow-detail-enter-active,
  .flow-detail-leave-active {
    transition: none;
  }
}

@media (max-width: 760px) {
  .steps {
    grid-template-columns: repeat(2, 1fr);
  }

  .details {
    grid-template-columns: 1fr;
  }
}
</style>
