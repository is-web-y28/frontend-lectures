export {
  diagnosticsKey,
  emptyRegistrationsApi,
  makeDiagnostics,
  makeHttpRegistrationsApi,
  registrationsApiKey,
  useRegistrationsApi,
} from './api/registrationsApi'
export type { Diagnostics } from './api/registrationsApi'
export { readMinSeats } from './model/filter'
export { initialRows, totalIn } from './model/localModel'
export type { Draft } from './model/localModel'
export { useLocalRegistrationsStore } from './model/localStore'
export { useRemoteRegistrations } from './model/useRemoteRegistrations'
export { default as LocalRegistrationList } from './ui/LocalRegistrationList.vue'
export { default as RegistrationForm } from './ui/RegistrationForm.vue'
