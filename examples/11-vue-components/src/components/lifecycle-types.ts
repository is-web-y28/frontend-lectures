export type LifecycleEntry = { owner: string; hook: string; state: number; dom: string }
export type LifecycleRecorder = (entry: LifecycleEntry) => void
