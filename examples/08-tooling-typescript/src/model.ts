export interface Registration {
  id: string;
  name: string;
  email: string;
  count: number;
}

export type Result<T> = { ok: true; value: T } | { ok: false; message: string };

export function success<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function failure<T = never>(message: string): Result<T> {
  return { ok: false, message };
}

export function seededRegistrations(): Registration[] {
  return [
    { id: 'anna', name: 'Анна', email: 'anna@meetup.example', count: 1 },
    { id: 'boris', name: 'Борис', email: 'boris@meetup.example', count: 2 },
    { id: 'vera', name: 'Вера', email: 'vera@meetup.example', count: 1 },
  ];
}
