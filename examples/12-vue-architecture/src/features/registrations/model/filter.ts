import type { LocationQueryValue } from 'vue-router'

export function readMinSeats(value: LocationQueryValue | LocationQueryValue[] | undefined) {
  return value === '2' ? 2 : 1
}
