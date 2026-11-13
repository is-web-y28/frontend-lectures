<script setup lang="ts">
import { nextTick, onUnmounted, ref, useTemplateRef } from 'vue'
import LifecycleProbe from './LifecycleProbe.vue'
const visible = ref(false)
const keep = ref(false)
const cleanup = ref(true)
const events = ref<string[]>([])
const stage = useTemplateRef<HTMLDivElement>('stage')
const handlers = new Set<() => void>()
function trace(message: string) { events.value.push(message) }
function listen(fn: () => void) {
  const cleanOnExit = cleanup.value
  window.addEventListener('meetup11-pulse', fn)
  handlers.add(fn)
  return () => {
    if (cleanOnExit) { window.removeEventListener('meetup11-pulse', fn); handlers.delete(fn); trace('Подписка снята') }
    else trace('Учебный режим: подписка оставлена')
  }
}
async function toggle() {
  visible.value = !visible.value
  trace(`Сразу: поле ${stage.value?.querySelector('input') ? 'есть' : 'отсутствует'}`)
  await nextTick()
  trace(`После nextTick: поле ${stage.value?.querySelector('input') ? 'есть' : 'отсутствует'}`)
  if (visible.value) stage.value?.querySelector('input')?.focus()
}
function pulse() {
  events.value.push('— одно событие —')
  window.dispatchEvent(new Event('meetup11-pulse'))
}
function reset() {
  visible.value = false
  for (const fn of handlers) window.removeEventListener('meetup11-pulse', fn)
  handlers.clear()
  events.value = []
}
onUnmounted(reset)
</script>
<template>
  <div>
    <p class="notice">Событие действительно отправляется в window. Сброс снимает и намеренно оставленные подписки.</p>
    <div class="controls">
      <label class="inline"><input v-model="keep" type="checkbox" :disabled="visible" @change="reset"> Сохранять через v-show</label>
      <label class="inline"><input v-model="cleanup" type="checkbox" :disabled="visible"> Очищать подписку при unmount</label>
      <button type="button" @click="toggle">{{ visible ? 'Скрыть' : 'Открыть' }}</button>
      <button type="button" @click="pulse">Отправить событие</button>
      <button type="button" @click="reset">Сбросить подписки</button>
    </div>
    <div ref="stage" class="panel">
      <LifecycleProbe v-if="keep || visible" v-show="visible" :listen="listen" :trace="trace" />
      <p v-if="!visible">Панель скрыта</p>
    </div>
    <ol class="event-log" aria-label="Журнал жизненного цикла"><li v-for="(event, i) in events" :key="i">{{ event }}</li></ol>
  </div>
</template>
