declare module '*registration-model.js' {
  export type Row = { id: string; name: string; count: number }
  export type SearchState = { query: string; rows: Row[]; phase: string; errorText: string; hasData: boolean; fromCache: boolean; savedAt: number; events: string[] }
  export function createRegistrationState(): SearchState
  export function describeRegistrationState(state: SearchState): string
  export function createRegistrationSearch(state: SearchState, load: (query: string, signal: AbortSignal) => Promise<Row[]>): { search: (query?: string, force?: boolean) => Promise<void>; dispose: () => void; report: (message: string) => void }
}
declare module '*registration-client.js' {
  export function createDemoSource(base: URL, conditions: () => {file: string; version: number}, report: (message: string) => void): (query: string, signal: AbortSignal) => Promise<{id: string; name: string; count: number}[]>
}
