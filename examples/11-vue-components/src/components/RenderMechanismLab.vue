<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import RenderProbe from './RenderProbe.vue'
const count = ref(1)
const tag = ref<'p' | 'section'>('p')
const revision = ref(0)
const busy = ref(false)
const events = ref<string[]>([])
const snapshot = ref('')
const probe = useTemplateRef<InstanceType<typeof RenderProbe>>('probe')
const stage = useTemplateRef<HTMLElement>('stage')
let observer: MutationObserver | undefined
let pending: MutationRecord[] = []
function describe() {
  const element = probe.value?.getElement()
  snapshot.value = `Экземпляр ${probe.value?.instanceId ?? 'нет'} · ${element?.tagName.toLowerCase() ?? 'нет'} · data-count=${element?.getAttribute('data-count') ?? 'нет'}`
}
onMounted(() => {
  observer = new MutationObserver(records => pending.push(...records))
  if (stage.value) observer.observe(stage.value, { attributes: true, characterData: true, childList: true, subtree: true })
  describe()
})
onUnmounted(() => observer?.disconnect())
async function change(kind: 'value' | 'tag' | 'key') {
  if (busy.value) return
  busy.value = true
  const before = probe.value?.getElement()
  const beforeSpan = before?.querySelector('span')
  const owner = probe.value?.instanceId
  pending = []
  observer?.takeRecords()
  if (kind === 'value') count.value++
  if (kind === 'tag') tag.value = tag.value === 'p' ? 'section' : 'p'
  if (kind === 'key') revision.value++
  await nextTick()
  pending.push(...(observer?.takeRecords() ?? []))
  const after = probe.value?.getElement()
  const sameRoot = before === after
  const sameSpan = beforeSpan === after?.querySelector('span')
  const sameOwner = owner === probe.value?.instanceId
  const attributes = [...new Set(pending.filter(r => r.type === 'attributes').map(r => r.attributeName))].join(', ') || 'нет'
  const text = pending.filter(r => r.type === 'characterData').length
  const added = pending.reduce((n, r) => n + r.addedNodes.length, 0)
  const removed = pending.reduce((n, r) => n + r.removedNodes.length, 0)
  const label = kind === 'value' ? 'Значение' : kind === 'tag' ? 'Тип корня' : 'Key компонента'
  events.value.push(`${label}: root before === after → ${sameRoot}; span → ${sameSpan}; экземпляр → ${sameOwner}`)
  events.value.push(`MutationObserver: атрибуты ${attributes}; characterData ${text}; добавлено ${added}, удалено ${removed}`)
  describe()
  busy.value = false
}
</script>
<template>
  <div>
    <p class="notice">Сравнение настоящих ссылок DOM и идентификаторов экземпляров. MutationObserver наблюдает только сцену; результат не задан заранее.</p>
    <div class="controls">
      <button type="button" :disabled="busy" @click="change('value')">Изменить текст и атрибут</button>
      <button type="button" :disabled="busy" @click="change('tag')">Сменить p ↔ section</button>
      <button type="button" :disabled="busy" @click="change('key')">Сменить key компонента</button>
    </div>
    <div ref="stage" class="panel render-stage"><RenderProbe ref="probe" :key="revision" :tag="tag" :count="count" /></div>
    <p role="status">{{ snapshot }}</p>
    <ol class="event-log" aria-label="Наблюдения DOM"><li v-for="(event, i) in events" :key="i">{{ event }}</li></ol>
  </div>
</template>
<style scoped>
.render-stage :deep(p), .render-stage :deep(section) { display: flex; gap: 16px; padding: 12px; border: 1px solid var(--surface-border, #b9c6c8); border-radius: 6px; }
.render-stage :deep(.is-emphasized) { border-color: var(--accent, #bd4831); background: color-mix(in srgb, var(--accent, #bd4831) 10%, transparent); }
</style>
