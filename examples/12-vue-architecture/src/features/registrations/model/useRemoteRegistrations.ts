import { computed, ref, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'
import { UnavailableError } from '../api/registrationsApi'
import type { ApiRegistration, RegistrationsApi } from '../api/registrationsApi'

type Result = { eventId: string; rows: ApiRegistration[] }
type Phase = 'idle' | 'loading' | 'success' | 'unavailable' | 'error'

export function useRemoteRegistrations(eventId: Ref<string | undefined>, api: RegistrationsApi, report: (message: string) => void) {
  const result = shallowRef<Result>()
  const phase = ref<Phase>('idle')
  const revision = ref(0)
  const current = computed(() => result.value?.eventId === eventId.value ? result.value : undefined)
  const hasData = computed(() => current.value !== undefined)
  const rows = computed(() => current.value?.rows ?? [])

  watch([eventId, revision], async ([id], _previous, onCleanup) => {
    if (result.value?.eventId !== id) result.value = undefined
    if (!id) {
      phase.value = 'idle'
      return
    }

    const controller = new AbortController()
    const { signal } = controller
    onCleanup(() => controller.abort())
    phase.value = 'loading'
    report(`${id} · загрузка`)

    try {
      const records = await api.list(id, signal)
      if (signal.aborted) return
      result.value = { eventId: id, rows: records }
      phase.value = 'success'
      report(`${id} · получено записей: ${records.length}`)
    } catch (error) {
      if (signal.aborted) {
        report(`${id} · чтение отменено`)
        return
      }
      phase.value = error instanceof UnavailableError ? 'unavailable' : 'error'
      report(`${id} · ${error instanceof Error ? error.message : 'ошибка'}`)
    }
  }, { immediate: true })

  function refresh() {
    revision.value++
  }

  return { rows, phase, hasData, refresh }
}
