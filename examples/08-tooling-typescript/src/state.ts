import type { Registration } from './model';

function copyRegistration(registration: Registration): Registration {
  return { ...registration };
}

export interface RegistrationStore {
  getAll(): Registration[];
  add(registration: Registration): void;
  remove(id: string): boolean;
  reset(registrations: Registration[]): void;
}

/** The factory keeps its state private while exposing a small typed API. */
export function createRegistrationStore(
  initial: Registration[] = [],
): RegistrationStore {
  let registrations = initial.map(copyRegistration);

  return {
    getAll: () => registrations.map(copyRegistration),
    add: (registration) => {
      registrations = [...registrations, copyRegistration(registration)];
    },
    remove: (id) => {
      const before = registrations.length;
      registrations = registrations.filter(
        (registration) => registration.id !== id,
      );
      return registrations.length !== before;
    },
    reset: (next) => {
      registrations = next.map(copyRegistration);
    },
  };
}

/** A class can offer the same API; the demo continues with the factory above. */
export class RegistrationStoreClass implements RegistrationStore {
  #registrations: Registration[];

  constructor(initial: Registration[] = []) {
    this.#registrations = initial.map(copyRegistration);
  }

  getAll(): Registration[] {
    return this.#registrations.map(copyRegistration);
  }

  add(registration: Registration): void {
    this.#registrations.push(copyRegistration(registration));
  }

  remove(id: string): boolean {
    const index = this.#registrations.findIndex(
      (registration) => registration.id === id,
    );
    if (index === -1) return false;
    this.#registrations.splice(index, 1);
    return true;
  }

  reset(registrations: Registration[]): void {
    this.#registrations = registrations.map(copyRegistration);
  }
}

export function filterRegistrations(
  registrations: Registration[],
  query: string,
): Registration[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return registrations;

  return registrations.filter(
    ({ name, email }) =>
      name.toLocaleLowerCase().includes(normalized) ||
      email.toLocaleLowerCase().includes(normalized),
  );
}
