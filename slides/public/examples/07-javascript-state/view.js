export function renderRegistrations(container, registrations, onRemove) {
  container.replaceChildren();

  if (registrations.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Подходящих заявок нет.';
    container.append(empty);
    return [];
  }

  const removeButtons = [];
  const list = document.createElement('ul');
  list.className = 'registration-list';

  for (const registration of registrations) {
    const item = document.createElement('li');
    item.className = 'registration';

    const details = document.createElement('div');
    const title = document.createElement('strong');
    title.textContent = registration.name;
    const description = document.createElement('span');
    description.textContent = `${registration.email} · участников: ${registration.count}`;
    details.append(title, description);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'secondary remove-button';
    removeButton.textContent = `Удалить ${registration.name}`;
    removeButton.addEventListener('click', () => onRemove(registration.id));

    item.append(details, removeButton);
    list.append(item);
    removeButtons.push(removeButton);
  }

  container.append(list);
  return removeButtons;
}

export function renderSummary(element, visibleCount, totalCount) {
  element.textContent = `Показано: ${visibleCount} из ${totalCount}.`;
}

export function renderStateOutput(element, registrations, query) {
  element.textContent = JSON.stringify(
    {
      registrations,
      query,
    },
    null,
    2,
  );
}
