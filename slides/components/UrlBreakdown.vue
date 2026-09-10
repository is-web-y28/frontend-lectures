<script setup lang="ts">
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import VClickGap from '@slidev/client/builtin/VClickGap.vue'
import MarkdownText from './MarkdownText.vue'

type Segment = {
  label: string
  value: string
  description: string
  effect: string
}

const segments: Segment[] = [
  {
    label: 'Схема',
    value: 'https://',
    description: 'Задаёт способ взаимодействия с ресурсом. HTTPS защищает данные при передаче между браузером и сервером.',
    effect: 'Браузер выберет защищённое HTTPS-соединение.',
  },
  {
    label: 'Хост',
    value: 'events.example.org',
    description: 'Доменное имя сервера. Его ещё нужно превратить в `IP-адрес` через DNS.',
    effect: 'Браузер спросит DNS, где находится этот сервер.',
  },
  {
    label: 'Путь',
    value: '/program',
    description: 'Указывает ресурс, который нужен на сервере: в этом случае раздел программы.',
    effect: 'Этот путь попадёт в HTTP-запрос к серверу.',
  },
  {
    label: 'Параметры',
    value: '?day=2',
    description: 'Передают серверу дополнительные условия запроса: здесь нужен второй день программы.',
    effect: 'Сервер сможет вернуть версию программы для второго дня.',
  },
  {
    label: 'Фрагмент',
    value: '#workshops',
    description: 'Указывает место внутри уже загруженного HTML-документа.',
    effect: 'Браузер найдёт элемент с `id=\"workshops\"` и прокрутит страницу к нему.',
  },
]

const { $clicks } = useSlideContext()
const activeIndex = computed(() => Math.min(Math.max($clicks.value, 0), segments.length - 1))
const activeSegment = computed(() => segments[activeIndex.value])
</script>

<template>
  <section class="url-breakdown" aria-label="Пошаговый разбор URL">
    <VClickGap :size="segments.length" />

    <p class="address" aria-label="https events example org program day 2 workshops">
      <span
        v-for="(segment, index) in segments"
        :key="segment.label"
        class="segment"
        :class="{ active: index === activeIndex }"
        :aria-current="index === activeIndex ? 'step' : undefined"
      >
        {{ segment.value }}
      </span>
    </p>

    <ol class="legend" aria-label="Части URL">
      <li
        v-for="(segment, index) in segments"
        :key="segment.label"
        :class="{ active: index === activeIndex }"
      >
        {{ index + 1 }}. {{ segment.label }}
      </li>
    </ol>

    <Transition name="url-detail" mode="out-in">
      <div :key="activeSegment.label" class="details" role="status" aria-live="polite">
        <p class="eyebrow">{{ activeSegment.label }}</p>
        <h3>{{ activeSegment.value }}</h3>
        <p><MarkdownText inline :source="activeSegment.description" /></p>
        <p class="effect"><strong>Что происходит:</strong> <MarkdownText inline :source="activeSegment.effect" /></p>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.url-breakdown {
  background: var(--lecture-surface);
  border: 1px solid var(--lecture-border);
  border-radius: 0.5rem;
  margin-top: 1.25rem;
  padding: 1rem 1.2rem;
}

.address {
  display: flex;
  flex-wrap: wrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 1.35rem;
  line-height: 1.45;
  margin: 0;
}

.segment {
  border-bottom: 0.18rem solid transparent;
  border-radius: 0.2rem;
  color: var(--lecture-muted);
  padding: 0.05rem 0.12rem;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease;
}

.segment.active {
  background: var(--lecture-accent-soft);
  border-color: var(--lecture-accent);
  color: var(--lecture-accent);
  font-weight: 700;
  transform: translateY(-0.08rem);
}

.legend {
  display: grid;
  gap: 0.45rem;
  grid-template-columns: repeat(5, 1fr);
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
}

.legend li {
  color: var(--lecture-muted);
  font-size: 0.82rem;
  transition: color 180ms ease, font-weight 180ms ease;
}

.legend li.active {
  color: var(--lecture-accent);
  font-weight: 700;
}

.details {
  border-top: 1px solid var(--lecture-border);
  margin-top: 1rem;
  padding-top: 0.85rem;
}

.eyebrow {
  color: var(--lecture-accent);
  font-size: 0.8rem;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
}

h3 {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 1.25rem;
  margin: 0.15rem 0 0.4rem;
}

.details p {
  margin: 0;
}

.effect {
  background: var(--lecture-surface-raised);
  border-radius: 0.3rem;
  margin-top: 0.7rem !important;
  padding: 0.55rem 0.7rem;
}

.url-detail-enter-active,
.url-detail-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.url-detail-enter-from,
.url-detail-leave-to {
  opacity: 0;
  transform: translateY(0.35rem);
}

@media (prefers-reduced-motion: reduce) {
  .segment,
  .legend li,
  .url-detail-enter-active,
  .url-detail-leave-active {
    transition: none;
  }
}

@media (max-width: 760px) {
  .legend {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
