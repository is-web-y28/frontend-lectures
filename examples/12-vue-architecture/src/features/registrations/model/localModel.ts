export type Draft = { name: string; count: number }
export type LocalRegistration = Draft & { id: number }
export type RowsByEventId = Record<string, LocalRegistration[]>

export function initialRows(): RowsByEventId {
  return {
    'frontend-meetup': [
      { id: 1, name: 'Анна', count: 2 },
      { id: 2, name: 'Борис', count: 1 },
    ],
    'css-workshop': [],
  }
}

export function totalIn(rows: LocalRegistration[]) {
  return rows.reduce((sum, row) => sum + row.count, 0)
}
