import './styles.css';
import {
  createRegistrationDetails,
  patchRegistrationDetails,
  previewRegistration,
  type RegistrationDetails,
  type RegistrationDraft,
  type RegistrationStatus,
} from './registration-contracts';
import {
  appTitle,
  handlePreviewClick,
  importedMeetupImageUrl,
  publicBuildInfoUrl,
} from './tooling';
import { seededRegistrations } from './model';
import { parseRegistrations } from './storage';
import { createRegistrationStore, filterRegistrations } from './state';
import { element, renderRegistrations, setStatus, showJson } from './view';

type AuthoredFragment = string | HTMLElement;

function inlineCode(text: string): HTMLElement {
  const node = element('code');
  node.textContent = text;
  return node;
}

function pageHeader(
  title: string | AuthoredFragment[],
  description: AuthoredFragment[],
): HTMLElement {
  const header = element('header');
  const eyebrow = element('p', 'eyebrow');
  const heading = element('h1');
  const lead = element('p', 'lead');
  eyebrow.textContent = 'Лекция 08 · инструменты и TypeScript';
  if (typeof title === 'string') heading.textContent = title;
  else heading.append(...title);
  lead.append(...description);
  header.append(eyebrow, heading, lead);
  return header;
}

function panel(title: AuthoredFragment[]): HTMLElement {
  const section = element('section', 'panel');
  const heading = element('h2');
  heading.append(...title);
  section.append(heading);
  return section;
}

function mountSumDemo(mountPoint: HTMLElement): void {
  const demo = element('div', 'demo');
  const card = panel(['Один символ меняет результат']);
  const label = element('label');
  const input = element('input');
  const actions = element('div', 'actions');
  const stringButton = element('button');
  const numberButton = element('button', 'secondary');
  const equation = element('p', 'equation');
  const explanation = element('p', 'hint');

  label.htmlFor = 'sum-value';
  label.textContent = 'Значение из поля формы';
  input.id = 'sum-value';
  input.type = 'text';
  input.inputMode = 'numeric';
  input.value = '2';
  stringButton.type = 'button';
  stringButton.textContent = 'Строка из поля';
  numberButton.type = 'button';
  numberButton.textContent = 'Число из поля';
  explanation.append(
    'Значение ',
    inlineCode('input.value'),
    ' приходит из DOM строкой. ',
    inlineCode('Number(...)'),
    ' создаёт число только в явной точке преобразования.',
  );

  const renderString = (): void => {
    const fromInput = input.value;
    const total = 0 + fromInput;
    equation.textContent = `0 + ${JSON.stringify(fromInput)} = ${JSON.stringify(total)}`;
  };
  const renderNumber = (): void => {
    const fromInput = input.value;
    const parsed = Number(fromInput);
    equation.textContent = `0 + Number(${JSON.stringify(fromInput)}) = ${String(0 + parsed)}`;
  };

  stringButton.addEventListener('click', renderString);
  numberButton.addEventListener('click', renderNumber);
  input.addEventListener('input', renderString);
  equation.textContent = 'Сначала прогноз, затем выберите способ чтения.';

  actions.append(stringButton, numberButton);
  card.append(label, input, actions, equation, explanation);
  demo.append(
    pageHeader(
      ['Сумма начинается на границе типов'],
      [
        'TypeScript видит строку до преобразования, браузер возвращает строку в рантайме.',
      ],
    ),
    card,
  );
  mountPoint.replaceChildren(demo);
}

function mountAppDemo(mountPoint: HTMLElement, integrated = false): void {
  const store = createRegistrationStore(seededRegistrations());
  const demo = element('div', 'demo');
  const layout = element('div', 'layout');
  const controls = panel(['Новая заявка']);
  const listPanel = panel(['Заявки Frontend Meetup']);
  const form = element('form', 'form-grid');
  const nameLabel = element('label');
  const nameInput = element('input');
  const emailLabel = element('label');
  const emailInput = element('input');
  const countLabel = element('label');
  const countInput = element('input');
  const actions = element('div', 'actions');
  const submit = element('button');
  const reset = element('button', 'secondary');
  const status = element('p', 'status');
  const queryLabel = element('label');
  const queryInput = element('input');
  const summary = element('p', 'hint');
  const registrations = element('div');
  const stateOutput = element('pre', 'readout');
  let importDetails: HTMLDetailsElement | undefined;
  let resetImportState: (() => void) | undefined;

  nameLabel.htmlFor = 'registration-name';
  nameLabel.textContent = 'Имя';
  nameInput.id = 'registration-name';
  nameInput.name = 'name';
  nameInput.autocomplete = 'name';
  nameInput.required = true;
  emailLabel.htmlFor = 'registration-email';
  emailLabel.textContent = 'Почта';
  emailInput.id = 'registration-email';
  emailInput.name = 'email';
  emailInput.type = 'email';
  emailInput.autocomplete = 'email';
  emailInput.required = true;
  countLabel.htmlFor = 'registration-count';
  countLabel.textContent = 'Участников';
  countInput.id = 'registration-count';
  countInput.name = 'count';
  countInput.type = 'number';
  countInput.min = '1';
  countInput.max = '5';
  countInput.step = '1';
  countInput.value = '1';
  countInput.required = true;
  submit.type = 'submit';
  submit.textContent = 'Добавить заявку';
  reset.type = 'button';
  reset.textContent = 'Сбросить к трём заявкам';
  status.setAttribute('aria-live', 'polite');
  queryLabel.htmlFor = 'registration-query';
  queryLabel.textContent = 'Поиск по имени или почте';
  queryInput.id = 'registration-query';
  queryInput.type = 'search';
  queryInput.autocomplete = 'off';
  stateOutput.setAttribute('aria-label', 'Текущее состояние заявок');

  const render = (focusRemoveIndex?: number): void => {
    const all = store.getAll();
    const visible = filterRegistrations(all, queryInput.value);
    const removeButtons = renderRegistrations(registrations, visible, (id) => {
      const removalIndex = visible.findIndex(
        (registration) => registration.id === id,
      );
      if (store.remove(id)) {
        setStatus(status, 'Заявка удалена.', 'success');
      }
      render(removalIndex);
    });
    summary.textContent = `Показано: ${visible.length} из ${all.length}.`;
    showJson(stateOutput, all);

    if (focusRemoveIndex !== undefined) {
      const nextButton =
        removeButtons[Math.min(focusRemoveIndex, removeButtons.length - 1)];
      if (nextButton) {
        nextButton.focus();
      } else {
        nameInput.focus();
      }
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const count = Number(countInput.value);
    nameInput.setCustomValidity(name ? '' : 'Введите имя.');
    countInput.setCustomValidity(
      Number.isInteger(count) && count >= 1 && count <= 5
        ? ''
        : 'Введите целое число от 1 до 5.',
    );
    emailInput.value = email;

    if (!form.reportValidity()) {
      setStatus(status, 'Заявка не добавлена: исправьте поля формы.', 'error');
      return;
    }

    store.add({ id: crypto.randomUUID(), name, email, count });
    form.reset();
    countInput.value = '1';
    setStatus(status, 'Заявка добавлена.', 'success');
    render();
    nameInput.focus();
  });
  nameInput.addEventListener('input', () => nameInput.setCustomValidity(''));
  countInput.addEventListener('input', () => countInput.setCustomValidity(''));

  queryInput.addEventListener('input', () => render());
  reset.addEventListener('click', () => {
    store.reset(seededRegistrations());
    form.reset();
    countInput.value = '1';
    queryInput.value = '';
    nameInput.setCustomValidity('');
    countInput.setCustomValidity('');
    resetImportState?.();
    setStatus(
      status,
      'Восстановлены три исходные заявки и очищен поиск.',
      'success',
    );
    render();
  });

  if (integrated) {
    const details = element('details', 'import-details');
    importDetails = details;
    const importSummary = element('summary');
    const importContent = element('div', 'import-content');
    const importLabel = element('label');
    const importTextarea = element('textarea');
    const fixtureRow = element('div', 'fixture-row');
    const badJsonButton = element('button', 'secondary');
    const goodJsonButton = element('button', 'secondary');
    const importButton = element('button');
    const importStatus = element('p', 'status');

    importSummary.textContent = 'JSON на границе';
    importLabel.htmlFor = 'registration-import-json';
    importLabel.textContent = 'JSON для импорта';
    importTextarea.id = 'registration-import-json';
    importTextarea.spellcheck = false;
    importTextarea.value = fixtures.good;
    badJsonButton.type = 'button';
    badJsonButton.textContent = 'Подставить ошибочный JSON';
    goodJsonButton.type = 'button';
    goodJsonButton.textContent = 'Подставить корректный JSON';
    importButton.type = 'button';
    importButton.textContent = 'Проверить и импортировать';
    importStatus.setAttribute('aria-live', 'polite');

    badJsonButton.addEventListener('click', () => {
      importTextarea.value = fixtures.countString;
    });
    goodJsonButton.addEventListener('click', () => {
      importTextarea.value = fixtures.good;
    });
    importButton.addEventListener('click', () => {
      const parsed = parseRegistrations(importTextarea.value);
      if (!parsed.ok) {
        importStatus.replaceChildren(
          'Импорт отменён: ',
          inlineCode(parsed.message),
          ' Память не менялась.',
        );
        importStatus.dataset.tone = 'error';
        return;
      }

      store.reset(parsed.value);
      queryInput.value = '';
      setStatus(
        importStatus,
        `Импорт выполнен. Заявок: ${parsed.value.length}.`,
        'success',
      );
      render();
    });
    resetImportState = () => {
      details.open = false;
      importTextarea.value = fixtures.good;
      setStatus(importStatus, '');
    };

    fixtureRow.append(badJsonButton, goodJsonButton);
    importContent.append(
      importLabel,
      importTextarea,
      fixtureRow,
      importButton,
      importStatus,
    );
    details.append(importSummary, importContent);
  }

  actions.append(submit, reset);
  form.append(
    nameLabel,
    nameInput,
    emailLabel,
    emailInput,
    countLabel,
    countInput,
    actions,
  );
  controls.append(form, status);
  listPanel.append(queryLabel, queryInput, summary, registrations, stateOutput);
  if (importDetails) listPanel.append(importDetails);
  layout.append(controls, listPanel);
  demo.append(
    pageHeader('Заявки Frontend Meetup', [
      'Форма и список используют типизированную модель ',
      inlineCode('Registration'),
      '; состояние живёт в фабрике.',
    ]),
    layout,
  );
  mountPoint.replaceChildren(demo);
  render();
}

function isRegistrationStatus(value: string): value is RegistrationStatus {
  return value === 'draft' || value === 'confirmed' || value === 'cancelled';
}

function mountTypesDemo(mountPoint: HTMLElement): void {
  const demo = element('div', 'demo');
  const layout = element('div', 'layout');
  const controls = panel(['Создание расширенной заявки']);
  const previewPanel = panel(['Выбранная заявка']);
  const form = element('form', 'form-grid');
  const nameLabel = element('label');
  const nameInput = element('input');
  const commentToggleLabel = element('label', 'checkbox-label');
  const commentToggle = element('input');
  const commentLabel = element('label');
  const commentInput = element('input');
  const commentField = element('div');
  const statusLabel = element('label');
  const statusSelect = element('select', 'code-select');
  const actions = element('div', 'actions');
  const createButton = element('button');
  const updateButton = element('button', 'secondary');
  const deselectButton = element('button', 'secondary');
  const status = element('p', 'status');
  const selectionLabel = element('p', 'hint');
  const commentReadout = element('p', 'hint');
  const previewOutput = element('pre', 'readout');
  const selectedOutput = element('pre', 'readout');
  let selected: RegistrationDetails | null = null;

  nameLabel.htmlFor = 'details-name';
  nameLabel.textContent = 'Имя';
  nameInput.id = 'details-name';
  nameInput.value = 'Анна';
  nameInput.required = true;
  commentToggle.id = 'details-comment-enabled';
  commentToggle.type = 'checkbox';
  commentToggleLabel.htmlFor = commentToggle.id;
  commentToggleLabel.textContent = 'Добавить комментарий';
  commentToggleLabel.prepend(commentToggle);
  commentLabel.htmlFor = 'details-comment';
  commentLabel.textContent = 'Комментарий';
  commentInput.id = 'details-comment';
  commentInput.disabled = true;
  commentField.append(commentLabel, commentInput);
  statusLabel.htmlFor = 'details-status';
  statusLabel.textContent = 'Статус заявки';
  for (const value of ['draft', 'confirmed', 'cancelled']) {
    const option = element('option');
    option.value = value;
    option.textContent = value;
    statusSelect.append(option);
  }
  statusSelect.value = 'draft';
  createButton.type = 'button';
  createButton.textContent = 'Создать заявку';
  updateButton.type = 'button';
  updateButton.textContent = 'Применить статус';
  deselectButton.type = 'button';
  deselectButton.textContent = 'Снять выбор';
  status.setAttribute('aria-live', 'polite');
  previewOutput.setAttribute('aria-label', 'Предпросмотр RegistrationPreview');
  selectedOutput.setAttribute(
    'aria-label',
    'Полная выбранная RegistrationDetails',
  );

  const render = (): void => {
    updateButton.disabled = selected === null;
    selectionLabel.textContent = `Выбрана: ${selected?.name ?? 'Не выбрана'}`;
    if (!selected || !Object.hasOwn(selected, 'comment')) {
      commentReadout.textContent = 'Комментарий не указан';
    } else if (selected.comment === '') {
      commentReadout.textContent = 'Комментарий: «» (пустая строка)';
    } else {
      commentReadout.textContent = `Комментарий: ${selected.comment}`;
    }
    showJson(previewOutput, selected ? previewRegistration(selected) : null);
    showJson(selectedOutput, selected);
  };

  commentToggle.addEventListener('change', () => {
    commentInput.disabled = !commentToggle.checked;
    if (!commentToggle.checked) commentInput.value = '';
  });
  createButton.addEventListener('click', () => {
    const selectedStatus = statusSelect.value;
    const name = nameInput.value.trim();
    if (!name) {
      setStatus(status, 'Введите имя для заявки.', 'error');
      nameInput.focus();
      return;
    }
    if (!isRegistrationStatus(selectedStatus)) {
      setStatus(status, 'Статус не входит в доверенный набор.', 'error');
      return;
    }

    const draft: RegistrationDraft = {
      name,
      email: 'anna@meetup.example',
      count: 1,
      status: selectedStatus,
    };
    if (commentToggle.checked) draft.comment = commentInput.value;
    selected = createRegistrationDetails(draft);
    setStatus(status, 'Заявка создана с новым UUID.', 'success');
    render();
  });
  updateButton.addEventListener('click', () => {
    const selectedStatus = statusSelect.value;
    if (!selected) {
      setStatus(status, 'Сначала выберите заявку.', 'error');
      return;
    }
    if (!isRegistrationStatus(selectedStatus)) {
      setStatus(status, 'Статус не входит в доверенный набор.', 'error');
      return;
    }
    selected = patchRegistrationDetails(selected, { status: selectedStatus });
    status.replaceChildren(
      'Статус обновлён доверенным ',
      inlineCode('RegistrationPatch'),
      '.',
    );
    status.dataset.tone = 'success';
    render();
  });
  deselectButton.addEventListener('click', () => {
    selected = null;
    setStatus(status, 'Выбор снят.', 'success');
    render();
  });

  actions.append(createButton, updateButton, deselectButton);
  form.append(
    nameLabel,
    nameInput,
    commentToggleLabel,
    commentField,
    statusLabel,
    statusSelect,
    actions,
  );
  controls.append(form, status);
  previewPanel.append(
    selectionLabel,
    commentReadout,
    previewOutput,
    selectedOutput,
  );
  layout.append(controls, previewPanel);
  demo.append(
    pageHeader(
      ['Контракт расширенной заявки'],
      [
        inlineCode('RegistrationDetails'),
        ' добавляет статус и необязательный комментарий, не меняя исходный ',
        inlineCode('Registration'),
        '.',
      ],
    ),
    layout,
  );
  mountPoint.replaceChildren(demo);
  render();
}

function mountToolingDemo(mountPoint: HTMLElement): void {
  const demo = element('div', 'demo');
  const card = panel(['Что Vite подставляет и копирует']);
  const envLabel = element('p');
  const image = element('img', 'tooling-image');
  const imagePath = element('p', 'resource-path');
  const publicLink = element('a');
  const actions = element('div', 'actions');
  const runHandlerButton = element('button');
  const executionReadout = element('p', 'status');
  let executionCount = 0;

  envLabel.append('Название из ', inlineCode('env'), ': ', appTitle);
  image.src = importedMeetupImageUrl;
  image.alt = 'Frontend Meetup';
  imagePath.append(
    'Импортированное изображение: ',
    inlineCode(importedMeetupImageUrl),
  );
  publicLink.href = publicBuildInfoUrl;
  publicLink.textContent = 'Публичный файл';
  publicLink.target = '_blank';
  publicLink.rel = 'noopener';
  runHandlerButton.type = 'button';
  runHandlerButton.textContent = 'Выполнить обработчик';
  executionReadout.setAttribute('aria-live', 'polite');

  const render = (): void => {
    executionReadout.textContent = `Обработчик выполнен: ${executionCount}`;
  };

  runHandlerButton.addEventListener('click', () => {
    executionCount = handlePreviewClick(executionCount);
    render();
  });

  actions.append(runHandlerButton);
  card.append(
    envLabel,
    image,
    imagePath,
    publicLink,
    actions,
    executionReadout,
  );
  demo.append(
    pageHeader(
      ['Ресурсы сборщика в браузере'],
      [
        'Значение ',
        inlineCode('env'),
        ', импортированный SVG и файл из ',
        inlineCode('public'),
        ' проходят разными путями.',
      ],
    ),
    card,
  );
  mountPoint.replaceChildren(demo);
  render();
}

const fixtures = {
  good: '[\n  {"id":"dasha","name":"Даша","email":"dasha@meetup.example","count":2}\n]',
  syntax: '[{"id":"dasha",]',
  shape: '{"id":"dasha"}',
  countString:
    '[{"id":"dasha","name":"Даша","email":"dasha@meetup.example","count":"2"}]',
  range:
    '[{"id":"dasha","name":"Даша","email":"dasha@meetup.example","count":6}]',
  duplicate:
    '[{"id":"dasha","name":"Даша","email":"dasha@meetup.example","count":1},{"id":"dasha","name":"Денис","email":"denis@meetup.example","count":2}]',
};

type FixtureName = keyof typeof fixtures;

const fixtureNames: FixtureName[] = [
  'good',
  'syntax',
  'shape',
  'countString',
  'range',
  'duplicate',
];

function mountBoundaryDemo(mountPoint: HTMLElement): void {
  const store = createRegistrationStore(seededRegistrations());
  const demo = element('div', 'demo');
  const layout = element('div', 'layout');
  const importPanel = panel(['Непроверенный JSON на границе']);
  const statePanel = panel(['Память после попытки импорта']);
  const label = element('label');
  const textarea = element('textarea');
  const fixtureRow = element('div', 'fixture-row');
  const importButton = element('button');
  const status = element('p', 'status');
  const output = element('pre', 'readout');

  label.htmlFor = 'json-boundary';
  label.textContent = 'JSON на границе';
  textarea.id = 'json-boundary';
  textarea.spellcheck = false;
  textarea.value = fixtures.good;
  importButton.type = 'button';
  importButton.textContent = 'Проверить и импортировать';
  status.setAttribute('aria-live', 'polite');
  output.setAttribute('aria-label', 'Заявки в памяти');

  const render = (): void => showJson(output, store.getAll());
  const chooseFixture = (fixture: FixtureName): void => {
    textarea.value = fixtures[fixture];
    setStatus(status, 'Подготовлен новый JSON; память пока не менялась.');
  };
  const fixtureLabels: Record<FixtureName, string> = {
    good: 'Корректный JSON',
    syntax: 'Синтаксическая ошибка',
    shape: 'Неверная структура',
    countString: 'count строкой',
    range: 'count вне диапазона',
    duplicate: 'Повтор id',
  };

  for (const fixture of fixtureNames) {
    const button = element('button', 'secondary');
    button.type = 'button';
    if (fixture === 'countString') {
      button.append(inlineCode('count'), ' строкой');
    } else if (fixture === 'range') {
      button.append(inlineCode('count'), ' вне диапазона');
    } else if (fixture === 'duplicate') {
      button.append('Повтор ', inlineCode('id'));
    } else {
      button.textContent = fixtureLabels[fixture];
    }
    button.addEventListener('click', () => chooseFixture(fixture));
    fixtureRow.append(button);
  }
  importButton.addEventListener('click', () => {
    const parsed = parseRegistrations(textarea.value);
    if (parsed.ok) {
      store.reset(parsed.value);
      status.replaceChildren(
        `Импорт выполнен. Заявок: ${parsed.value.length}; `,
        inlineCode('Result.ok === true'),
        '.',
      );
      status.dataset.tone = 'success';
      render();
      return;
    }
    status.replaceChildren(
      'Импорт отменён: ',
      inlineCode(parsed.message),
      ' Память не менялась.',
    );
    status.dataset.tone = 'error';
  });

  importPanel.append(label, textarea, fixtureRow, importButton, status);
  statePanel.append(output);
  layout.append(importPanel, statePanel);
  demo.append(
    pageHeader(
      [
        'Сначала ',
        inlineCode('unknown'),
        ', потом ',
        inlineCode('Registration[]'),
      ],
      [
        'JSON может быть синтаксически верным и всё равно не подходить модели. Импорт меняет память только после ',
        inlineCode('Result.ok'),
        '.',
      ],
    ),
    layout,
  );
  mountPoint.replaceChildren(demo);
  render();
}

function mountResultDemo(mountPoint: HTMLElement): void {
  const store = createRegistrationStore(seededRegistrations());
  const demo = element('div', 'demo');
  const layout = element('div', 'layout');
  const resultPanel = panel([
    inlineCode('Result<T>'),
    ' вместо исключения в UI',
  ]);
  const statePanel = panel(['Память и результат']);
  const actions = element('div', 'actions');
  const successButton = element('button');
  const failureButton = element('button', 'secondary');
  const status = element('p', 'status');
  const output = element('pre', 'readout');

  successButton.type = 'button';
  successButton.textContent = 'Проверить успех';
  failureButton.type = 'button';
  failureButton.textContent = 'Проверить ошибку';
  status.setAttribute('aria-live', 'polite');
  output.setAttribute('aria-label', 'Текущее состояние заявок');

  const render = (): void => showJson(output, store.getAll());
  const apply = (json: string): void => {
    const result = parseRegistrations(json);
    if (result.ok) {
      store.reset(result.value);
      status.replaceChildren(
        'Ветка ',
        inlineCode('ok'),
        `: заявки доступны через `,
        inlineCode('value'),
        `. Всего: ${result.value.length}.`,
      );
      status.dataset.tone = 'success';
      render();
      return;
    }
    status.replaceChildren(
      'Ветка ошибки: ',
      inlineCode(result.message),
      ' Состояние сохранено.',
    );
    status.dataset.tone = 'error';
  };

  successButton.addEventListener('click', () => apply(fixtures.good));
  failureButton.addEventListener('click', () => apply(fixtures.countString));
  actions.append(successButton, failureButton);
  resultPanel.append(actions, status);
  statePanel.append(output);
  layout.append(resultPanel, statePanel);
  demo.append(
    pageHeader(
      ['Дискриминируем ', inlineCode('Result<T>')],
      [
        'Обе кнопки запускают настоящий разбор JSON: ветка выбирается по полю ',
        inlineCode('ok'),
        ', а ',
        inlineCode('value'),
        ' доступно только при успехе.',
      ],
    ),
    layout,
  );
  mountPoint.replaceChildren(demo);
  render();
}

const root = document.querySelector('#app');
document.body.classList.toggle(
  'embedded',
  new URLSearchParams(window.location.search).get('embedded') === '1',
);

if (!(root instanceof HTMLElement)) {
  document.body.textContent = 'Не найдено место для демонстрации.';
} else {
  const demo = new URLSearchParams(window.location.search).get('demo');

  if (demo === 'sum') {
    mountSumDemo(root);
  } else if (demo === 'types') {
    mountTypesDemo(root);
  } else if (demo === 'tooling') {
    mountToolingDemo(root);
  } else if (demo === 'boundary') {
    mountBoundaryDemo(root);
  } else if (demo === 'result') {
    mountResultDemo(root);
  } else if (demo === 'full') {
    mountAppDemo(root, true);
  } else {
    mountAppDemo(root);
  }
}
