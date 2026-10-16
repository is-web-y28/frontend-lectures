export const STORAGE_KEY = 'frontend-meetup:lecture07:v1';

function getStorage() {
  // Reading localStorage may itself throw when browser privacy settings forbid it.
  return window.localStorage;
}

function validateRegistrations(value) {
  if (!Array.isArray(value)) {
    throw new TypeError('Ожидался массив заявок.');
  }

  const ids = new Set();

  return value.map((record, index) => {
    if (record === null || typeof record !== 'object' || Array.isArray(record)) {
      throw new TypeError(`Заявка ${index + 1} должна быть объектом.`);
    }

    const { id, name, email, count } = record;
    if (typeof id !== 'string' || !id.trim()) {
      throw new TypeError(`У заявки ${index + 1} нет непустого строкового id.`);
    }
    if (ids.has(id)) {
      throw new TypeError(`Идентификатор «${id}» повторяется.`);
    }
    if (typeof name !== 'string' || !name.trim() || name !== name.trim()) {
      throw new TypeError(`У заявки ${index + 1} некорректное имя.`);
    }
    if (typeof email !== 'string' || !email.trim()) {
      throw new TypeError(`У заявки ${index + 1} некорректная почта.`);
    }
    if (!Number.isInteger(count) || count < 1 || count > 5) {
      throw new TypeError(`У заявки ${index + 1} некорректно число участников.`);
    }

    ids.add(id);
    return { id, name, email, count };
  });
}

export function loadRegistrations() {
  const raw = getStorage().getItem(STORAGE_KEY);

  if (raw === null) {
    return [];
  }

  return validateRegistrations(JSON.parse(raw));
}

export function hasStoredRegistrations() {
  return getStorage().getItem(STORAGE_KEY) !== null;
}

export function writeStoredDemoValue(value) {
  getStorage().setItem(STORAGE_KEY, value);
}

export function probeStorageQuota() {
  const storage = getStorage();
  const probeKey = `${STORAGE_KEY}:quota-probe`;
  const probeValue = 'x'.repeat(8 * 1024 * 1024);

  try {
    storage.setItem(probeKey, probeValue);
  } finally {
    storage.removeItem(probeKey);
  }
}

export function saveRegistrations(records) {
  const validRecords = validateRegistrations(records);
  getStorage().setItem(STORAGE_KEY, JSON.stringify(validRecords));
}

export function clearStoredRegistrations() {
  getStorage().removeItem(STORAGE_KEY);
}
