import type { Registration } from './model';

export function element<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  return node;
}

export function setStatus(
  target: HTMLElement,
  message: string,
  tone: 'success' | 'error' | 'neutral' = 'neutral',
): void {
  target.textContent = message;
  target.dataset.tone = tone;
}

export function renderRegistrations(
  target: HTMLElement,
  registrations: Registration[],
  onRemove: (id: string) => void,
): HTMLButtonElement[] {
  target.replaceChildren();

  if (registrations.length === 0) {
    const empty = element('p', 'empty-state');
    empty.textContent = 'По этому запросу заявок нет.';
    target.append(empty);
    return [];
  }

  const list = element('ul', 'registration-list');
  const removeButtons: HTMLButtonElement[] = [];
  for (const registration of registrations) {
    const item = element('li', 'registration');
    const details = element('div');
    const name = element('strong');
    const meta = element('span');
    const remove = element('button', 'secondary remove-button');

    name.textContent = registration.name;
    meta.textContent = `${registration.email} · участников: ${registration.count}`;
    remove.type = 'button';
    remove.textContent = 'Удалить';
    remove.setAttribute('aria-label', `Удалить заявку: ${registration.name}`);
    remove.addEventListener('click', () => onRemove(registration.id));

    details.append(name, meta);
    item.append(details, remove);
    list.append(item);
    removeButtons.push(remove);
  }
  target.append(list);
  return removeButtons;
}

export function showJson(target: HTMLElement, value: unknown): void {
  target.textContent = JSON.stringify(value, null, 2);
}
