import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { initialRows, totalIn } from './localModel'
import type { Draft } from './localModel'

export const useLocalRegistrationsStore = defineStore('local-registrations', () => {
  const rowsByEventId = ref(initialRows())
  const nextId = ref(3)
  const totalSeats = computed(() => Object.values(rowsByEventId.value).reduce((sum, rows) => sum + totalIn(rows), 0))

  function add(eventId: string, draft: Draft) {
    const rows = rowsByEventId.value[eventId]
    const name = draft.name.trim()
    const { count } = draft
    if (!Array.isArray(rows) || !name || !Number.isInteger(count) || count < 1 || count > 5) return
    const id = nextId.value++
    rows.push({ id, name, count })
  }

  function remove(eventId: string, id: number) {
    const rows = rowsByEventId.value[eventId]
    if (Array.isArray(rows)) rowsByEventId.value[eventId] = rows.filter(row => row.id !== id)
  }

  return { rowsByEventId, nextId, totalSeats, add, remove }
})
