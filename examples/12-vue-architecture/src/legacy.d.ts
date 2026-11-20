declare module '*registration-client.js' {
  type Registration = { id: string; name: string; count: number }
  export function parseRegistrations(value: unknown): Registration[]
  export function loadRegistrations(
    url: string | URL,
    signal?: AbortSignal,
    parse?: (value: unknown) => Registration[],
  ): Promise<Registration[]>
  export function wait(ms: number, signal?: AbortSignal): Promise<void>
}
