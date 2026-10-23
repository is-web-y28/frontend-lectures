import { failure, success } from './model';
import type { Registration, Result } from './model';

function requiredText(
  value: unknown,
  field: string,
  position: number,
): Result<string> {
  if (typeof value !== 'string' || !value.trim()) {
    return failure(
      `Заявка ${position}: поле «${field}» должно быть непустой строкой.`,
    );
  }

  return success(value.trim());
}

/** Validates the unknown value that crossed the JSON boundary. */
export function validateRegistrations(value: unknown): Result<Registration[]> {
  if (!Array.isArray(value)) {
    return failure('Ожидался массив заявок.');
  }

  const ids = new Set<string>();
  const registrations: Registration[] = [];

  for (const [index, candidate] of value.entries()) {
    const position = index + 1;
    if (
      typeof candidate !== 'object' ||
      candidate === null ||
      Array.isArray(candidate) ||
      !('id' in candidate) ||
      !('name' in candidate) ||
      !('email' in candidate) ||
      !('count' in candidate)
    ) {
      return failure(
        `Заявка ${position} должна быть объектом с полями id, name, email и count.`,
      );
    }

    const id = requiredText(candidate.id, 'id', position);
    if (!id.ok) return id;
    if (ids.has(id.value)) {
      return failure(
        `Заявка ${position}: идентификатор «${id.value}» уже встречался.`,
      );
    }

    const name = requiredText(candidate.name, 'name', position);
    if (!name.ok) return name;
    const email = requiredText(candidate.email, 'email', position);
    if (!email.ok) return email;

    const count = candidate.count;
    if (
      typeof count !== 'number' ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > 5
    ) {
      return failure(`Заявка ${position}: «count» — целое число от 1 до 5.`);
    }

    ids.add(id.value);
    registrations.push({
      id: id.value,
      name: name.value,
      email: email.value,
      count,
    });
  }

  return success(registrations);
}

export function parseRegistrations(json: string): Result<Registration[]> {
  try {
    const parsed: unknown = JSON.parse(json);
    return validateRegistrations(parsed);
  } catch (error: unknown) {
    const detail =
      error instanceof SyntaxError
        ? error.message
        : 'неизвестная ошибка разбора';
    return failure(`JSON не прочитан: ${detail}`);
  }
}
