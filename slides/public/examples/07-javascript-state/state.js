function copyRecord(record) {
  return { ...record };
}

/**
 * Keeps registrations in a closure rather than on an object instance.
 * Every factory call receives an independent variable and independent data.
 */
export function createRegistrationStore(initial = []) {
  let registrations = initial.map(copyRecord);

  return {
    getAll() {
      return registrations.map(copyRecord);
    },

    add(record) {
      registrations = [...registrations, copyRecord(record)];
    },

    remove(id) {
      const index = registrations.findIndex((registration) => registration.id === id);

      if (index === -1) {
        return false;
      }

      registrations = [
        ...registrations.slice(0, index),
        ...registrations.slice(index + 1),
      ];
      return true;
    },
  };
}

/**
 * The class form keeps its data as an own property while sharing methods through
 * RegistrationStore.prototype. It intentionally has the same public API as the factory.
 */
export class RegistrationStore {
  constructor(initial = []) {
    this.registrations = initial.map(copyRecord);
  }

  getAll() {
    return this.registrations.map(copyRecord);
  }

  add(record) {
    this.registrations.push(copyRecord(record));
  }

  remove(id) {
    const index = this.registrations.findIndex((registration) => registration.id === id);

    if (index === -1) {
      return false;
    }

    this.registrations.splice(index, 1);
    return true;
  }
}

export function filterRegistrations(registrations, query) {
  const normalizedQuery = String(query).trim().toLocaleLowerCase();

  if (!normalizedQuery) {
    return registrations.slice();
  }

  return registrations.filter((registration) => {
    const name = String(registration.name).toLocaleLowerCase();
    const email = String(registration.email).toLocaleLowerCase();
    return name.includes(normalizedQuery) || email.includes(normalizedQuery);
  });
}
