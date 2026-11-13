import { computed, onUnmounted, reactive, watch } from 'vue'
import type { Ref } from 'vue'
import { createRegistrationState, createRegistrationSearch, describeRegistrationState } from '../../../../slides/public/examples/10-async-http/registration-model.js'
import { createDemoSource } from '../../../../slides/public/examples/10-async-http/registration-client.js'

export function useRegistrationSearch(query: Ref<string>, file: Ref<string>, base: URL, trace: (message: string) => void) {
  const state = reactive(createRegistrationState())
  const load = createDemoSource(base, () => ({ file: file.value, version: 1 }), message => actions.report(message))
  const actions = createRegistrationSearch(state, load)
  const message = computed(() => describeRegistrationState(state))
  watch(query, value => { void actions.search(value) }, { immediate: true })
  function refresh() { void actions.search(query.value, true) }
  onUnmounted(() => { actions.dispose(); trace('dispose: запрос отменён, экземпляр закрыт') })
  return { state, message, refresh }
}
