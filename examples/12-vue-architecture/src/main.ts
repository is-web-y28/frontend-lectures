import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { makeRouter } from './router'
import { makeI18n } from './i18n'
import { demoKey, readDemo } from './demo'
import {
  diagnosticsKey, makeDiagnostics, makeHttpRegistrationsApi, registrationsApiKey,
} from '@/features/registrations'
import LegacyNavigation from './pages/LegacyNavigation.vue'
import meetupRows from '../../../slides/public/examples/10-async-http/registrations.json'
import './styles.css'

const mode = readDemo(location.search)
if (new URLSearchParams(location.search).has('embedded')) {
  document.documentElement.dataset.embedded = ''
}

if (mode === 'legacy') {
  createApp(LegacyNavigation).mount('#app')
} else {
  const diagnostics = makeDiagnostics(mode === 'contract' ? 'wrapped-array' : 'ok')
  const client = mode === 'routes'
    ? { list: async (id: string) => id === 'frontend-meetup' ? meetupRows : [] }
    : makeHttpRegistrationsApi(diagnostics)
  const router = makeRouter(mode)
  const app = createApp(App, { mode })

  app.use(router)
  app.use(createPinia())
  app.use(makeI18n(mode === 'fallback'))
  app.provide(demoKey, mode)
  app.provide(diagnosticsKey, diagnostics)
  app.provide(registrationsApiKey, client)

  void router.isReady().then(() => app.mount('#app'))
}
