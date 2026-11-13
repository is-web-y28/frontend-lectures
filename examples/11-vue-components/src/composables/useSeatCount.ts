import { computed, ref } from 'vue'
export function useSeatCount() {
  const count = ref(1)
  const canAdd = computed(() => count.value < 5)
  function increment() { if (canAdd.value) count.value++ }
  return { count, canAdd, increment }
}
