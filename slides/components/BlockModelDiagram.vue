<script setup lang="ts">
import VClickGap from '@slidev/client/builtin/VClickGap.vue'
import { useSlideContext } from '@slidev/client'
import { computed } from 'vue'

type Region = 'content' | 'padding' | 'border' | 'margin'
const regions: Region[] = ['content', 'padding', 'border', 'margin']
const { $clicks } = useSlideContext()

const descriptions: Record<Region, string> = {
  content: 'content — место для текста и других дочерних элементов.',
  padding: 'padding — внутренний отступ: свободное место между содержимым и границей.',
  border: 'border — граница элемента.',
  margin: 'margin — внешний отступ: пространство между элементом и соседями.',
}

const activeRegion = computed<Region>(() => regions[Math.min(Math.max($clicks.value, 0), regions.length - 1)] ?? 'content')
const description = computed(() => descriptions[activeRegion.value])
</script>

<template>
  <section class="diagram" aria-label="Схема блочной модели">
    <VClickGap :size="regions.length" />

    <div class="region-controls" aria-label="Области блочной модели">
      <span
        v-for="region in regions"
        :key="region"
        class="region-label"
        :class="{ active: activeRegion === region }"
        :aria-current="activeRegion === region ? 'step' : undefined"
      >
        {{ region }}
      </span>
    </div>

    <div class="model" :class="`active-${activeRegion}`" aria-hidden="true">
      <div class="margin-region region">
        <span>margin</span>
        <div class="border-region region">
          <span>border</span>
          <div class="padding-region region">
            <span>padding</span>
            <div class="content-region region">content<br><small>Frontend Meetup</small></div>
          </div>
        </div>
      </div>
    </div>

    <p class="description" role="status" aria-live="polite">{{ description }}</p>
  </section>
</template>

<style scoped>
.diagram {
  align-items: center;
  display: grid;
  flex: 1;
  gap: 1rem;
  grid-template-columns: 0.55fr 1fr;
  min-height: 0;
  width: 100%;
}

.region-controls {
  display: grid;
  gap: 0.5rem;
}

.region-label {
  background: var(--lecture-surface);
  border: 1px solid var(--lecture-border);
  border-radius: 0.35rem;
  color: var(--lecture-ink);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  padding: 0.55rem 0.7rem;
}

.region-label.active {
  background: var(--lecture-accent-soft);
  border-color: var(--lecture-accent);
  color: var(--lecture-accent);
  font-weight: 700;
}

.model {
  color: #172033;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85rem;
  font-weight: 700;
  justify-self: center;
  min-width: 19rem;
}

.region {
  box-sizing: border-box;
  display: grid;
  place-items: center;
  transition: box-shadow 160ms ease, transform 160ms ease;
}

.margin-region {
  background: #fef3c7;
  min-height: 16rem;
  padding: 1.25rem;
}

.border-region {
  background: #fdba74;
  border: 0.65rem solid #ea580c;
  height: 100%;
  padding: 1rem;
  width: 100%;
}

.padding-region {
  background: #bfdbfe;
  height: 100%;
  padding: 1.5rem;
  width: 100%;
}

.content-region {
  background: #d1fae5;
  height: 100%;
  min-height: 5.5rem;
  text-align: center;
  width: 100%;
}

small {
  font-size: 0.65rem;
  font-weight: 500;
}

.active-margin .margin-region,
.active-border .border-region,
.active-padding .padding-region,
.active-content .content-region {
  box-shadow: 0 0 0 4px #075985, 0 0 0 8px #ffffff;
  transform: scale(1.025);
  z-index: 1;
}

.description {
  color: var(--lecture-muted);
  font-size: 0.85rem;
  grid-column: 1 / -1;
  margin: 0;
}
</style>
