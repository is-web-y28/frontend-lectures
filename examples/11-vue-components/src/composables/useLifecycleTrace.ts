import { onMounted, onUnmounted } from 'vue'

export function useLifecycleTrace(label: string, report: (message: string) => void) {
  onMounted(() => report(`${label}: mounted`))
  onUnmounted(() => report(`${label}: unmounted`))
}
