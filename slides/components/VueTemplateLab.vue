<script setup lang="ts">
import { compile } from '@vue/compiler-dom'
import * as VueRuntime from 'vue'
import { computed, defineComponent, reactive, ref } from 'vue'
import type { VNode } from 'vue'

const examples = [
  { id: 'text', label: 'Текст', template: '<p>Заявка: {{ name }}</p>' },
  { id: 'attribute', label: 'Атрибут', template: '<button :disabled="!enabled">Добавить</button>' },
  { id: 'condition', label: 'Условие', template: '<p v-if="isOpen">Регистрация открыта</p>' },
]
const exampleId = ref('text')
const showFullCode = ref(false)
const state = reactive({ name: 'Анна', enabled: true, isOpen: true })
const example = computed(() => examples.find(item => item.id === exampleId.value)!)
const compiled = computed(() => {
  const { code } = compile(example.value.template, { mode: 'function', hoistStatic: false })
  // Only the three authored templates above are compiled and executed.
  const render = new Function('Vue', code)(VueRuntime) as (context: typeof state, cache: unknown[]) => VNode
  return { code, render }
})
const displayedCode = computed(() => showFullCode.value
  ? compiled.value.code
  : compiled.value.code.split('\n')
      .filter(line => !/^\s*const (?:_Vue|\{)/.test(line))
      .join('\n').trim())
const Preview = defineComponent({
  name: 'CompiledTemplatePreview',
  setup: () => () => compiled.value.render(state, []),
})

function reset() {
  exampleId.value = 'text'
  showFullCode.value = false
  state.name = 'Анна'
  state.enabled = true
  state.isOpen = true
}
</script>

<template>
  <section class="template-lab" aria-label="Шаблон, JavaScript компилятора и результат">
    <header>
      <label>Пример <select v-model="exampleId"><option v-for="item in examples" :key="item.id" :value="item.id">{{ item.label }}</option></select></label>
      <button type="button" :aria-pressed="showFullCode" @click="showFullCode = !showFullCode">Показать весь код</button>
      <button type="button" @click="reset">Начать заново</button>
    </header>
    <div class="lab-stage">
      <section class="lab-panel">
        <h3>1 · Шаблон</h3>
        <pre><code>{{ example.template }}</code></pre>
        <label v-if="exampleId === 'text'">Данные: <code>name</code><input v-model="state.name" aria-label="Имя в данных"></label>
        <label v-else-if="exampleId === 'attribute'"><input v-model="state.enabled" type="checkbox"> Разрешить добавление</label>
        <label v-else><input v-model="state.isOpen" type="checkbox"> Регистрация открыта</label>
        <p class="hint">Меняем данные. Шаблон остаётся тем же.</p>
      </section>
      <section class="lab-panel compiled-panel">
        <h3>2 · JavaScript компилятора</h3>
        <p class="hint">{{ showFullCode ? 'Полный вывод компилятора Vue' : 'Служебные объявления помощников скрыты' }}</p>
        <pre aria-label="JavaScript компилятора"><code>{{ displayedCode }}</code></pre>
      </section>
      <section class="lab-panel">
        <h3>3 · Результат в DOM</h3>
        <div class="preview" aria-label="Результат шаблона"><Preview /></div>
        <p class="hint">Выполняется показанная функция <code>render</code>; Vue обновляет реальный DOM.</p>
      </section>
    </div>
  </section>
</template>

<style scoped>
.template-lab { display: flex; flex: 1; flex-direction: column; min-height: 0; gap: .7rem; color: var(--fg); font-size: .75rem; }
header { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem; }
header label { margin-right: auto; }
.lab-stage { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.4fr) minmax(0, .85fr); flex: 1; min-height: 0; gap: .7rem; }
.lab-panel { padding: .8rem; min-width: 0; overflow: auto; border: var(--surface-border); border-radius: .5rem; background: var(--surface-bg); }
h3 { margin: 0 0 .8rem; font-size: .75rem; }
pre { margin: .5rem 0 1rem; padding: .5rem; white-space: pre-wrap; overflow-wrap: anywhere; font-size: .58rem; line-height: 1.55; }
.compiled-panel pre { padding: 0; background: transparent; border: 0; }
label { display: block; margin: .5rem 0; }
button, input, select, .preview :deep(button) { color: var(--fg); background: var(--surface-bg); border: var(--surface-border); border-radius: .3rem; padding: .3rem .45rem; font: inherit; }
button, .preview :deep(button) { cursor: pointer; }
input:not([type=checkbox]) { display: block; width: 100%; box-sizing: border-box; margin-top: .3rem; }
:focus-visible, .preview :deep(:focus-visible) { outline: 3px solid var(--accent); outline-offset: 2px; }
.preview { min-height: 5rem; padding: .6rem 0; }
.preview :deep(p) { margin: .5rem 0; }
.preview :deep(button:disabled) { cursor: not-allowed; opacity: .45; }
.hint { color: var(--fg-dim); font-size: .65rem; line-height: 1.5; margin: .5rem 0; }
@media (max-width: 600px) { .lab-stage { grid-template-columns: 1fr; overflow: auto; } .lab-panel { overflow: visible; } }
</style>
