export const events = [
  { id: 'frontend-meetup', title: 'Frontend Meetup', startsAt: '2026-12-04T17:00:00Z' },
  { id: 'css-workshop', title: 'CSS Workshop', startsAt: '2026-12-11T17:00:00Z' },
] as const

export function findEvent(eventId: string) {
  return events.find(event => event.id === eventId)
}
