import { inject, ref } from 'vue'
import type { InjectionKey } from 'vue'
import { loadRegistrations, parseRegistrations, wait } from '../../../../../../slides/public/examples/10-async-http/registration-client.js'
import meetupUrl from '../../../../../../slides/public/examples/10-async-http/registrations.json?url&no-inline'
import workshopUrl from '../../../../../../slides/public/examples/10-async-http/empty.json?url&no-inline'
import invalidUrl from '../../../../../../slides/public/examples/10-async-http/shape.json?url&no-inline'
import envelopeUrl from './registrations-envelope.json?url&no-inline'

export type ApiRegistration = { id: string; name: string; count: number }
export type ResponseMode = 'ok' | 'slow' | '503' | 'invalid' | 'wrapped-array' | 'wrapped-items'

export interface RegistrationsApi {
  list(eventId: string, signal: AbortSignal): Promise<ApiRegistration[]>
}

export const registrationsApiKey: InjectionKey<RegistrationsApi> = Symbol('registrations-api')
export const diagnosticsKey = Symbol('registrations-diagnostics')

export class UnavailableError extends Error {}

const sourceByEvent = new Map([
  ['frontend-meetup', meetupUrl],
  ['css-workshop', workshopUrl],
])

function parseRegistrationEnvelope(body: unknown): ApiRegistration[] {
  if (!body || typeof body !== 'object' || !('items' in body)) {
    throw new Error('Ожидался объект с items')
  }
  return parseRegistrations(body.items)
}

export function makeDiagnostics(initial: ResponseMode = 'ok') {
  const response = ref(initial)
  const log = ref<string[]>([])
  function report(message: string) {
    log.value = [message, ...log.value.slice(0, 5)]
  }
  return { response, log, report }
}

export type Diagnostics = ReturnType<typeof makeDiagnostics>

export function makeHttpRegistrationsApi(diagnostics: Diagnostics): RegistrationsApi {
  return {
    async list(eventId, signal) {
      const source = sourceByEvent.get(eventId)
      if (!source) throw new Error('Unknown event')

      const mode = diagnostics.response.value
      await wait(mode === 'slow' && eventId === 'frontend-meetup' ? 2500 : 350, signal)
      if (mode === '503') throw new UnavailableError('HTTP 503 (имитация)')
      if (eventId === 'frontend-meetup' && (mode === 'wrapped-array' || mode === 'wrapped-items')) {
        const parse = mode === 'wrapped-items' ? parseRegistrationEnvelope : undefined
        return loadRegistrations(envelopeUrl, signal, parse)
      }
      return loadRegistrations(mode === 'invalid' ? invalidUrl : source, signal)
    },
  }
}

export function useRegistrationsApi() {
  const api = inject(registrationsApiKey)
  if (!api) throw new Error('RegistrationsApi provider is required')
  return api
}

export const emptyRegistrationsApi: RegistrationsApi = { list: async () => [] }
