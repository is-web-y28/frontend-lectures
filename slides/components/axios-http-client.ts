import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { parseRegistrations } from '../public/examples/10-async-http/registration-client.js'

// #region axios-instance
export function createAxiosClient(baseURL: string) {
  return axios.create({
    baseURL,
    timeout: 5000,
    responseType: 'json',
    transitional: { silentJSONParsing: false },
  })
}
// #endregion axios-instance

// #region axios-load
export async function loadWithAxios(
  api: AxiosInstance,
  path: string,
  signal?: AbortSignal,
) {
  const response = await api.get<unknown>(
    path, { signal },
  )
  return parseRegistrations(response.data)
}
// #endregion axios-load

// #region axios-errors
export function describeAxiosError(error: unknown) {
  if (axios.isCancel(error)) {
    return 'Запрос отменён'
  }
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status && (status < 200 || status >= 300)) {
      return `HTTP ${status}`
    }
    if (error.code === 'ERR_BAD_RESPONSE')
      return 'Не удалось разобрать JSON'
    return error.message
  }
  return error instanceof Error
    ? error.message : String(error)
}
// #endregion axios-errors
