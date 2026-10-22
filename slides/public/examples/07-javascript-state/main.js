import {
  createRegistrationStore,
  filterRegistrations,
} from './state.js';
import {
  clearStoredRegistrations,
  hasStoredRegistrations,
  loadRegistrations,
  probeStorageQuota,
  saveRegistrations,
  writeStoredDemoValue,
} from './storage.js';
import {
  renderRegistrations,
  renderStateOutput,
  renderSummary,
} from './view.js';
import { mountClosureDemo, mountObjectDemo, mountReceiverDemo } from './mechanisms.js';
import { mountCopyDemo } from './copy-demo.js';
import { mountMigrationDemo, mountConflictDemo } from './persistence-demos.js';
import { mountIndexeddbDemo } from './indexeddb-demo.js';

const root = document.querySelector('#app');
const parameters = new URLSearchParams(window.location.search);
const demo = parameters.get('demo') || 'full';
const embedded = parameters.get('embedded') === '1';

document.body.classList.toggle('embedded', embedded);

if (demo === 'closures') {
  mountClosureDemo(root);
} else if (demo === 'receivers') {
  mountReceiverDemo(root);
} else if (demo === 'objects') {
  mountObjectDemo(root);
} else if (demo === 'copies') {
  mountCopyDemo(root);
} else if (demo === 'migration') {
  mountMigrationDemo(root);
} else if (demo === 'conflict') {
  mountConflictDemo(root);
} else if (demo === 'indexeddb-rollback') {
  mountIndexeddbDemo(root, 'rollback');
} else if (demo === 'indexeddb-index') {
  mountIndexeddbDemo(root, 'indexes');
} else {
  mountRegistrationDemo(root, demo === 'state' ? 'state' : 'storage');
}

function sampleRegistrations() {
  return [
    { id: 'a', name: 'Анна', email: 'anna@meetup.example', count: 1 },
    { id: 'b', name: 'Борис', email: 'boris@meetup.example', count: 2 },
    { id: 'c', name: 'Вера', email: 'vera@meetup.example', count: 1 },
  ];
}

function mountRegistrationDemo(mountPoint, mode) {
  const isPersistent = mode === 'storage';
  let savingBlocked = false;
  let store;

  mountPoint.innerHTML = `
    <div class="demo-page">
      <header class="page-header">
        <p class="eyebrow">Лекция 7 · JavaScript</p>
        <h1>Заявки Frontend Meetup</h1>
        <p>Список на странице — представление состояния, а не его источник.</p>
      </header>

      <section class="panel controls-panel" aria-labelledby="registration-title">
        <h2 id="registration-title">Новая заявка</h2>
        <form id="registration-form" class="registration-form">
          <div>
            <label for="name">Имя</label>
            <input id="name" name="name" type="text" autocomplete="name" required />
          </div>
          <div>
            <label for="email">Почта</label>
            <input id="email" name="email" type="email" autocomplete="email" required />
          </div>
          <div>
            <label for="count">Участников</label>
            <input id="count" name="count" type="number" min="1" max="5" step="1" value="1" required />
          </div>
          <div class="button-row">
            <button type="submit">Добавить заявку</button>
            <button id="seed-data" class="secondary" type="button">Три заявки</button>
          </div>
        </form>
        <p id="status" class="status" aria-live="polite"></p>
      </section>

      <section class="panel list-panel" aria-labelledby="registrations-title">
        <div class="split-header">
          <div>
            <h2 id="registrations-title">Заявки</h2>
            <p id="summary" class="hint"></p>
          </div>
          <button id="reload" class="secondary" type="button">Перезагрузить</button>
        </div>
        <div class="filter-row">
          <label for="query">Поиск по имени или почте</label>
          <div class="filter-controls">
            <input id="query" type="search" autocomplete="off" />
            <button id="clear-query" class="secondary" type="button">Снять фильтр</button>
          </div>
        </div>
        <div id="registrations" aria-live="polite"></div>
      </section>

      <section class="panel diagnostic-panel" aria-labelledby="state-title">
        <h2 id="state-title">Источник данных</h2>
        <p class="hint">Полная коллекция и текущий запрос, а не отфильтрованный DOM.</p>
        <pre id="state-output" class="readout"><code></code></pre>
      </section>

      ${isPersistent ? `
        <section class="panel storage-panel" aria-labelledby="storage-title">
          <h2 id="storage-title">Сохранение браузера</h2>
          <p id="storage-status" class="status" aria-live="polite"></p>
          <div class="button-row">
            <button id="corrupt-json" class="secondary" type="button">Повредить JSON</button>
            <button id="wrong-shape" class="secondary" type="button">Неверная структура</button>
            <button id="clear-storage" class="secondary" type="button">Очистить сохранение</button>
            <button id="quota-check" class="secondary" type="button">Изолированная проба квоты</button>
          </div>
          <p class="hint">Проба квоты использует временный ключ: она не вызывает сохранение заявок и не меняет их основной ключ.</p>
        </section>
      ` : ''}
    </div>
  `;

  const form = mountPoint.querySelector('#registration-form');
  const nameInput = mountPoint.querySelector('#name');
  const emailInput = mountPoint.querySelector('#email');
  const countInput = mountPoint.querySelector('#count');
  const queryInput = mountPoint.querySelector('#query');
  const registrationsElement = mountPoint.querySelector('#registrations');
  const summaryElement = mountPoint.querySelector('#summary');
  const stateOutput = mountPoint.querySelector('#state-output code');
  const status = mountPoint.querySelector('#status');
  const storageStatus = mountPoint.querySelector('#storage-status');

  const setStatus = (message) => {
    status.textContent = message;
  };
  const setStorageStatus = (message) => {
    if (storageStatus) {
      storageStatus.textContent = message;
    }
  };

  if (isPersistent) {
    try {
      const hadStoredValue = hasStoredRegistrations();
      store = createRegistrationStore(loadRegistrations());
      setStorageStatus(
        hadStoredValue
          ? `Сохранение прочитано: ${store.getAll().length} заявок.`
          : 'Сохранения нет: начинаем с пустого списка.',
      );
    } catch (error) {
      store = createRegistrationStore();
      savingBlocked = true;
      setStorageStatus(`Не удалось прочитать сохранение: ${describeError(error)} Новые данные не будут перезаписывать его до «Очистить сохранение».`);
      setStatus('Память начата с пустого списка: сохранённые данные недоступны.');
    }
  } else {
    store = createRegistrationStore(sampleRegistrations());
    const storageName = document.createElement('code');
    storageName.textContent = 'localStorage';
    status.replaceChildren('В памяти три исходные заявки; ', storageName, ' в этом режиме не используется.');
  }

  function visibleRegistrations() {
    return filterRegistrations(store.getAll(), queryInput.value);
  }

  function render(focusRemoveIndex = null) {
    const allRegistrations = store.getAll();
    const visible = filterRegistrations(allRegistrations, queryInput.value);
    const buttons = renderRegistrations(registrationsElement, visible, removeRegistration);
    renderSummary(summaryElement, visible.length, allRegistrations.length);
    renderStateOutput(stateOutput, allRegistrations, queryInput.value);

    if (Number.isInteger(focusRemoveIndex)) {
      const nextButton = buttons[Math.min(focusRemoveIndex, buttons.length - 1)];
      (nextButton || nameInput).focus();
    }
  }

  function persistCurrentState(action) {
    if (!isPersistent) {
      return true;
    }
    if (savingBlocked) {
      setStorageStatus('Сохранение заблокировано: сначала явно очистите недоступные или некорректные данные.');
      return false;
    }

    try {
      saveRegistrations(store.getAll());
      setStorageStatus(`${action} Сохранено ${store.getAll().length} заявок.`);
      return true;
    } catch (error) {
      setStorageStatus(`Не удалось сохранить изменения: ${describeError(error)}`);
      return false;
    }
  }

  function removeRegistration(id) {
    const removalIndex = visibleRegistrations().findIndex((registration) => registration.id === id);

    if (!store.remove(id)) {
      setStatus('Заявка уже отсутствует в источнике данных.');
      render();
      return;
    }

    persistCurrentState('Удаление выполнено в памяти.');
    setStatus('Заявка удалена из памяти. Фокус переведён на следующий доступный элемент.');
    render(removalIndex);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const count = Number(countInput.value);
    nameInput.setCustomValidity(name ? '' : 'Введите имя.');
    emailInput.value = email;
    countInput.setCustomValidity(
      Number.isInteger(count) && count >= 1 && count <= 5
        ? ''
        : 'Введите целое число участников от 1 до 5.',
    );

    if (!form.reportValidity()) {
      setStatus('Заявка не добавлена: исправьте поля формы.');
      return;
    }

    store.add({
      id: crypto.randomUUID(),
      name,
      email,
      count,
    });
    persistCurrentState('Заявка добавлена в память.');
    setStatus('Заявка добавлена в память.');
    form.reset();
    countInput.value = '1';
    render();
    nameInput.focus();
  });

  for (const input of [nameInput, countInput]) {
    input.addEventListener('input', () => input.setCustomValidity(''));
  }

  mountPoint.querySelector('#seed-data').addEventListener('click', () => {
    store = createRegistrationStore(sampleRegistrations());
    persistCurrentState('В памяти восстановлены три заявки.');
    setStatus('В памяти заменён список на три исходные заявки.');
    render();
  });

  queryInput.addEventListener('input', () => render());
  mountPoint.querySelector('#clear-query').addEventListener('click', () => {
    queryInput.value = '';
    render();
    queryInput.focus();
  });
  mountPoint.querySelector('#reload').addEventListener('click', () => window.location.reload());

  if (isPersistent) {
    mountPoint.querySelector('#corrupt-json').addEventListener('click', () => {
      writeDemoValue('{"registrations":');
    });
    mountPoint.querySelector('#wrong-shape').addEventListener('click', () => {
      writeDemoValue('{"registrations":[]}');
    });
    mountPoint.querySelector('#clear-storage').addEventListener('click', () => {
      try {
        clearStoredRegistrations();
        savingBlocked = false;
        setStorageStatus(`Сохранение удалено. В памяти остаётся ${store.getAll().length} заявок; они ещё не записаны заново.`);
      } catch (error) {
        setStorageStatus(`Не удалось очистить сохранение: ${describeError(error)}`);
      }
    });
    mountPoint.querySelector('#quota-check').addEventListener('click', () => {
      try {
        probeStorageQuota();
        setStorageStatus('Пробная строка из 8 388 608 символов записана в отдельный ключ и затем удалена.');
      } catch (error) {
        setStorageStatus(`Запись строки из 8 388 608 символов завершилась ошибкой: ${describeError(error)}`);
      }
    });
  }

  function writeDemoValue(value) {
    try {
      writeStoredDemoValue(value);
      window.location.reload();
    } catch (error) {
      setStorageStatus(`Не удалось изменить сохранение для сценария: ${describeError(error)}`);
    }
  }

  render();
}

function describeError(error) {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
}
