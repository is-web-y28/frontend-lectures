'use strict';

(() => {
  const app = document.querySelector('#app');
  const modes = new Set([
    'types',
    'functions',
    'dom',
    'disclosure',
    'events',
    'form',
    'full',
    'multiple',
    'form-data',
    'replacement',
    'reset',
    'delegation',
  ]);
  const requestedMode = new URLSearchParams(window.location.search).get('demo');
  const mode = modes.has(requestedMode) ? requestedMode : 'full';
  if (new URLSearchParams(window.location.search).get('embedded') === '1') {
    document.body.classList.add('embedded');
  }
  const talks = [
    { title: 'HTML', minutes: 20 },
    { title: 'CSS', minutes: 25 },
  ];

  function getTotalMinutes(talks) {
    let total = 0;
    for (const talk of talks) total += talk.minutes;
    return total;
  }

  // Удобно для консоли на слайде: getTotalMinutes(talks).
  window.talks = talks;
  window.getTotalMinutes = getTotalMinutes;


  function layout(title, lead, content) {
    app.innerHTML = `
      <header class="page-header">
        <p class="eyebrow">Frontend Meetup · лекция 6</p>
        <h1 class="event-title">${title}</h1>
        <p>${lead}</p>
      </header>
      ${content}
    `;
  }

  function resultText(value) {
    if (Number.isNaN(value)) return 'NaN';
    if (typeof value === 'string') return `«${value}»`;
    return String(value);
  }

  function valueWithType(value) {
    return `${resultText(value)} · ${typeof value}`;
  }

  function renderTypes() {
    layout(
      'Добавим одного участника',
      'Исходное количество — 2. Предскажите результат каждого выражения, затем сравните значения и их типы.',
      `
        <section class="panel types-panel" aria-labelledby="types-title">
          <h2 id="types-title">Добавим одного участника</h2>
          <label for="types-value">Количество участников</label>
          <input id="types-value" type="number" value="2" inputmode="numeric" aria-describedby="types-hint" />
          <div class="button-row" aria-label="Два способа добавить участника">
            <button type="button" data-types-action="raw">Добавить без Number</button>
            <button type="button" data-types-action="number">Добавить с Number</button>
          </div>
          <output class="readout code-readout" id="types-result" for="types-value" aria-live="polite"></output>
          <p class="hint" id="types-hint">Поле не меняется: сравниваем вычисления, не отправляем заявку.</p>
        </section>
      `,
    );
    const input = document.querySelector('#types-value');
    const result = document.querySelector('#types-result');
    function showInput() {
      result.textContent = `input.value: ${valueWithType(input.value)}\nВыберите способ добавить одного участника.`;
    }
    input.addEventListener('input', showInput);
    document.querySelectorAll('[data-types-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const useNumber = button.dataset.typesAction === 'number';
        const expression = useNumber ? 'Number(input.value) + 1' : 'input.value + 1';
        const value = useNumber ? Number(input.value) + 1 : input.value + 1;
        result.textContent = `input.value: ${valueWithType(input.value)}\nВыражение: ${expression}\nРезультат: ${valueWithType(value)}`;
      });
    });
    showInput();
  }

  function renderFunctions() {
    layout(
      'Функция считает программу',
      'Одна функция получает массив докладов и возвращает сумму минут. Снимки показывают входные данные до и после настоящего вызова.',
      `
        <section class="panel" aria-labelledby="program-title">
          <h2 id="program-title">Программа Meetup</h2>
          <ul class="talk-list" id="program-list"></ul>
          <div class="button-row" aria-label="Варианты программы">
            <button type="button" data-program="empty">Пустая программа</button>
            <button type="button" data-program="one">Один доклад</button>
            <button type="button" data-program="two">Два доклада</button>
            <button type="button" data-program="repeat">Повторить вызов</button>
            <button type="button" class="secondary" data-program="reset">Сбросить</button>
          </div>
          <output class="readout code-readout" id="program-result" aria-label="Наблюдения функции" aria-live="polite"></output>
          <p class="hint">В консоли страницы доступны <code>talks</code> и <code>getTotalMinutes(talks)</code>. Снимки показывают название и длительность докладов до и после вызовов; это наблюдение на выбранных входах, не доказательство отсутствия любых побочных эффектов.</p>
        </section>
      `,
    );
    const cases = { empty: [], one: [talks[0]], two: talks, reset: talks };
    const list = document.querySelector('#program-list');
    const result = document.querySelector('#program-result');
    let program = talks;
    function describeProgram(items) {
      return JSON.stringify(items.map(({ title, minutes }) => ({ title, minutes })));
    }
    function showProgram(nextProgram, repeat = false) {
      program = nextProgram;
      list.replaceChildren();
      program.forEach((talk) => {
        const item = document.createElement('li');
        item.textContent = `${talk.title} — ${talk.minutes} мин.`;
        list.append(item);
      });
      if (program.length === 0) {
        const item = document.createElement('li');
        item.textContent = 'Докладов пока нет.';
        list.append(item);
      }
      const before = describeProgram(program);
      const firstTotal = getTotalMinutes(program);
      const afterFirst = describeProgram(program);
      if (repeat) {
        const secondTotal = getTotalMinutes(program);
        const afterSecond = describeProgram(program);
        result.textContent = `Вход до вызовов: ${before}\nВызов 1: ${firstTotal} · ${typeof firstTotal}\nВход после вызова 1: ${afterFirst}\nВызов 2 с тем же входом: ${secondTotal} · ${typeof secondTotal}\nВход после вызова 2: ${afterSecond}`;
        return;
      }
      result.textContent = `Вход до вызова: ${before}\ngetTotalMinutes(program): ${firstTotal} · ${typeof firstTotal}\nВход после вызова: ${afterFirst}`;
    }
    document.querySelectorAll('[data-program]').forEach((button) => {
      button.addEventListener('click', () => {
        const selectedCase = button.dataset.program;
        showProgram(selectedCase === 'repeat' ? program : cases[selectedCase], selectedCase === 'repeat');
      });
    });
    showProgram(talks);
  }

  function renderDom() {
    layout(
      'DOM: текст — не HTML',
      'Собираем элемент через DOM API: <code>textContent</code>, <code>createElement</code> и <code>append</code>.',
      `
        <section class="panel" aria-labelledby="dom-title">
          <h2 id="dom-title">Добавить доклад</h2>
          <label for="talk-title">Название доклада</label>
          <input id="talk-title" value="&lt;strong&gt;Новый доклад&lt;/strong&gt;" />
          <div class="button-row">
            <button type="button" id="add-talk">Добавить доклад</button>
            <button type="button" class="secondary" id="reset-talks">Сбросить</button>
          </div>
          <ul class="talk-list" id="program-list"><li>HTML — 20 мин.</li><li>CSS — 25 мин.</li></ul>
          <p class="hint">Начальная разметка демонстрации содержит два <code>li</code>. Введённые угловые скобки остаются обычным текстом в живом DOM.</p>
        </section>
      `,
    );
    const input = document.querySelector('#talk-title');
    const list = document.querySelector('#program-list');
    const initial = ['HTML — 20 мин.', 'CSS — 25 мин.'];
    function resetList() {
      list.replaceChildren(...initial.map((text) => {
        const item = document.createElement('li');
        item.textContent = text;
        return item;
      }));
      input.value = '<strong>Новый доклад</strong>';
    }
    document.querySelector('#add-talk').addEventListener('click', () => {
      const item = document.createElement('li');
      item.textContent = input.value;
      list.append(item);
      input.focus();
    });
    document.querySelector('#reset-talks').addEventListener('click', resetList);
  }

  function disclosureCard(id, title, description) {
    return `
      <article class="event-card" id="${id}-card">
        <h2>${title}</h2>
        <button type="button" class="event-toggle" id="${id}-toggle" aria-expanded="false" aria-controls="${id}-details">
          Подробности
        </button>
        <div class="event-details" id="${id}-details" hidden>
          <p>${description}</p>
        </div>
        <output class="instrument" id="${id}-state"></output>
      </article>
    `;
  }

  function observeDisclosure(button, panel, output) {
    output.textContent = `aria-expanded: ${button.getAttribute('aria-expanded')}; hidden: ${panel.hidden}`;
  }


  function toggleDisclosure(button) {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const nextExpanded = !isExpanded;
    button.setAttribute('aria-expanded', String(nextExpanded));
    panel.hidden = !nextExpanded;
    observeDisclosure(button, panel, document.querySelector(`#${button.id.replace('-toggle', '-state')}`));
  }

  function toggleEventDetails(event) {
    toggleDisclosure(event.currentTarget);
  }

  function renderDisclosure() {
    layout(
      'Кнопка работает мышью и с клавиатуры',
      'Один обработчик click меняет состояние раскрытия независимо от способа активации кнопки.',
      `
        <section class="disclosure-demo" aria-label="Проверка кнопки раскрытия">
          <p class="hint">Откройте мышью → закройте через <code>Enter</code> → откройте через <code>Space</code>.</p>
          ${disclosureCard('event', 'Frontend Meetup', '18 октября · 19:00 · онлайн. Разбираем JavaScript в браузере.')}
        </section>
      `,
    );
    const button = document.querySelector('#event-toggle');
    const panel = document.querySelector('#event-details');
    const output = document.querySelector('#event-state');
    button.addEventListener('click', toggleEventDetails);
    observeDisclosure(button, panel, output);
  }

  function renderEvents() {
    layout(
      'Событие: путь, действие и распространение',
      'Нажмите вложенный текст или активируйте кнопку с клавиатуры. Журнал записывает настоящие слушатели и нативную отправку формы.',
      `
        <section class="panel event-probe-panel" aria-labelledby="events-title">
          <h2 id="events-title">Наблюдение за click</h2>
          <div class="event-options" aria-label="Действия обработчика кнопки">
            <label class="check-row" for="cancel-event-action"><input id="cancel-event-action" type="checkbox" /> Отменить действие</label>
            <label class="check-row" for="stop-event-propagation"><input id="stop-event-propagation" type="checkbox" /> Остановить распространение</label>
          </div>
          <p class="hint">Флажки находятся вне формы-наблюдателя: они не создают записей. Отмена отменяемого <code>click</code> не отправит форму; остановка распространения сама по себе не отменяет отправку.</p>
          <form id="event-probe-form">
            <div class="event-observer" id="event-probe-outer">
              <button type="submit" id="event-probe"><span>Нажмите вложенный текст</span></button>
            </div>
          </form>
          <button type="button" class="secondary" id="reset-event-probe">Сбросить</button>
          <output class="readout code-readout" id="event-probe-result" aria-live="polite">Ожидает настоящий click.</output>
        </section>
      `,
    );
    const form = document.querySelector('#event-probe-form');
    const outer = document.querySelector('#event-probe-outer');
    const button = document.querySelector('#event-probe');
    const cancelAction = document.querySelector('#cancel-event-action');
    const stopPropagation = document.querySelector('#stop-event-propagation');
    const result = document.querySelector('#event-probe-result');
    let submitCount = 0;
    let entries = [];
    function targetDescription(event) {
      const target = event.target;
      return target.id ? `${target.tagName.toLowerCase()}#${target.id}` : target.tagName.toLowerCase();
    }
    function currentTargetDescription(event) {
      const currentTarget = event.currentTarget;
      return currentTarget.id
        ? `${currentTarget.tagName.toLowerCase()}#${currentTarget.id}`
        : currentTarget.tagName.toLowerCase();
    }
    function record(listener, event) {
      const phase = ['none', 'capture', 'target', 'bubble'][event.eventPhase];
      entries.push(`${listener} (${phase}): target ${targetDescription(event)}; currentTarget ${currentTargetDescription(event)}`);
    }
    function showLog() {
      const submitLine = submitCount === 0
        ? 'Отправок формы: 0; нативная отправка не запустилась.'
        : `Отправок формы: ${submitCount}; обработчик submit отменил навигацию.`;
      result.textContent = [...entries, submitLine].join('\n');
    }
    outer.addEventListener('click', (event) => {
      record('capture на внешнем контейнере', event);
    }, true);
    button.addEventListener('click', (event) => {
      record('обработчик кнопки', event);
      if (cancelAction.checked) {
        event.preventDefault();
        entries.push(`preventDefault(): defaultPrevented ${event.defaultPrevented}`);
      }
      if (stopPropagation.checked) {
        event.stopPropagation();
        entries.push(`stopPropagation(): cancelBubble ${event.cancelBubble}`);
      }
    });
    outer.addEventListener('click', (event) => {
      record('bubble на внешнем контейнере', event);
    });
    form.addEventListener('submit', (event) => {
      submitCount += 1;
      record(`submit формы №${submitCount}`, event);
      event.preventDefault();
      showLog();
    });
    button.addEventListener('click', () => {
      window.setTimeout(showLog, 0);
    });
    document.querySelector('#reset-event-probe').addEventListener('click', () => {
      cancelAction.checked = false;
      stopPropagation.checked = false;
      submitCount = 0;
      entries = [];
      result.textContent = 'Ожидает настоящий click.';
    });
  }


  function registrationForm() {
    return `
      <section class="panel registration" aria-labelledby="registration-title">
        <h2 id="registration-title">Регистрация на Meetup</h2>
        <p>Заявка добавляется на эту страницу: сервера и постоянного хранения здесь нет.</p>
        <form id="registration-form" class="registration-form">
          <label for="name">Имя</label>
          <input id="name" name="name" autocomplete="name" required aria-describedby="name-error" />
          <p class="field-error" id="name-error" hidden></p>
          <label for="email">Почта</label>
          <input id="email" name="email" type="email" autocomplete="email" required />
          <label for="count">Количество участников</label>
          <input id="count" name="count" type="number" min="1" max="5" step="1" value="2" required />
          <div class="button-row">
            <button type="submit">Добавить заявку</button>
            <button type="reset" class="secondary">Сбросить</button>
          </div>
        </form>
        <output class="readout" id="form-status">Готово к локальной отправке.</output>
        <ul class="application-list" id="applications" aria-label="Локальные заявки"></ul>
      </section>
    `;
  }

  function activateRegistrationForm() {
    const form = document.querySelector('#registration-form');
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const countInput = document.querySelector('#count');
    const nameError = document.querySelector('#name-error');
    const formStatus = document.querySelector('#form-status');
    const applications = document.querySelector('#applications');
    function clearNameError() {
      nameInput.setCustomValidity('');
      nameInput.removeAttribute('aria-invalid');
      nameError.textContent = '';
      nameError.hidden = true;
    }
    nameInput.addEventListener('input', clearNameError);
    function handleSubmit(event) {
      event.preventDefault();
      if (nameInput.value.trim() === '') {
        const message = 'Введите имя, не только пробелы';
        nameInput.setCustomValidity(message);
        nameInput.setAttribute('aria-invalid', 'true');
        nameError.textContent = message;
        nameError.hidden = false;
        nameInput.reportValidity();
        return;
      }
      const application = {
        name: nameInput.value.trim(),
        email: emailInput.value,
        count: Number(countInput.value),
      };
      const item = document.createElement('li');
      item.textContent = `${application.name} · ${application.email} · ${application.count}`;
      applications.append(item);
      form.reset();
      formStatus.textContent = 'Заявка добавлена локально';
      nameInput.focus();
    }
    form.addEventListener('submit', handleSubmit);
    form.addEventListener('reset', clearNameError);
  }

  function renderForm() {
    layout(
      'Форма и нативная валидация',
      'Попробуйте Enter, пустые обязательные поля и имя из пробелов. Успех явно локальный.',
      registrationForm(),
    );
    activateRegistrationForm();
  }

  function renderMultiple() {
    layout(
      'Две независимые карточки',
      'Каждая кнопка находит свою панель по <code>aria-controls</code>; обработчик читает <code>event.currentTarget</code>.',
      `
        <section class="cards" aria-label="События">
          ${disclosureCard('html-event', 'HTML Meetup', 'Семантика, формы и доступность.')}
          ${disclosureCard('css-event', 'CSS Meetup', 'Каскад, слои и адаптивность.')}
          <div class="button-row"><button type="button" class="secondary" id="reset-multiple">Сбросить обе карточки</button></div>
        </section>
      `,
    );
    const buttons = [...document.querySelectorAll('.event-toggle')];
    function reset() {
      buttons.forEach((button) => {
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        button.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
        observeDisclosure(button, panel, document.querySelector(`#${button.id.replace('-toggle', '-state')}`));
      });
    }
    buttons.forEach((button) => button.addEventListener('click', toggleEventDetails));
    document.querySelector('#reset-multiple').addEventListener('click', reset);
    reset();
  }

  function renderFormData() {
    layout(
      'FormData видит успешные поля',
      'Меняйте поля: снимок ниже построен из настоящего <code>new FormData(form)</code>. Отключённые и hidden-поля ведут себя по нативным правилам.',
      `
        <section class="panel" aria-labelledby="form-data-title">
          <h2 id="form-data-title">Данные регистрации</h2>
          <form id="form-data-form">
            <label for="form-data-name">Имя</label>
            <input id="form-data-name" name="name" value="Аня" />
            <label for="form-data-email">Email</label>
            <input id="form-data-email" name="email" type="email" value="anya@example.test" />
            <label for="form-data-count">Количество мест</label>
            <input id="form-data-count" name="count" type="number" min="1" max="5" value="2" />
            <label class="check-row" for="form-data-updates"><input id="form-data-updates" name="updates" type="checkbox" value="yes" /> Получать новости</label>
            <label for="form-data-internal">Внутреннее поле (отключено)</label>
            <input id="form-data-internal" name="internal" value="Не включается в набор" disabled />
            <input name="source" value="meetup" type="hidden" />
            <div class="button-row">
              <button type="button" id="inspect-form-data">Собрать FormData</button>
              <button type="reset" class="secondary">Сбросить</button>
            </div>
          </form>
          <output class="readout code-readout" id="form-data-result"></output>
          <p class="hint">Отключённое <code>internal</code> отсутствует. Скрытое <code>source</code> включается в набор.</p>
        </section>
      `,
    );
    const form = document.querySelector('#form-data-form');
    const result = document.querySelector('#form-data-result');
    function inspect() {
      const pairs = [...new FormData(form).entries()].map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
      result.textContent = pairs.join('\n');
    }
    document.querySelector('#inspect-form-data').addEventListener('click', inspect);
    form.addEventListener('input', inspect);
    form.addEventListener('change', inspect);
    form.addEventListener('reset', () => window.requestAnimationFrame(inspect));
    inspect();
  }

  function renderReplacement() {
    layout(
      'Та же картинка — другой DOM-узел',
      'Сначала измените только заголовок, затем пересоздайте карточку. После каждого изменения проверьте кнопку.',
      `
        <section class="panel" aria-label="Идентичность DOM-узла">
          <div class="button-row">
            <button type="button" id="change-title">Изменить заголовок</button>
            <button type="button" id="replace-card">Пересоздать карточку</button>
          </div>
          ${disclosureCard('identity', 'HTML Meetup', 'Программа и регистрация на Frontend Meetup.')}
          <output class="readout code-readout" id="node-identity" aria-live="polite"></output>
          <p class="hint">Обработчик установлен напрямую на исходную кнопку. Новые кнопки автоматически его не получают.</p>
        </section>
      `,
    );
    const card = document.querySelector('#identity-card');
    const savedButton = card.querySelector('.event-toggle');
    const output = document.querySelector('#node-identity');
    savedButton.addEventListener('click', toggleEventDetails);
    function inspect() {
      const currentButton = card.querySelector('.event-toggle');
      output.textContent =
        `savedButton === currentButton: ${savedButton === currentButton}\n` +
        `savedButton.isConnected: ${savedButton.isConnected}`;
      observeDisclosure(
        currentButton,
        document.querySelector('#identity-details'),
        document.querySelector('#identity-state'),
      );
    }
    document.querySelector('#change-title').addEventListener('click', () => {
      card.querySelector('h2').textContent = 'CSS Meetup';
      inspect();
    });
    document.querySelector('#replace-card').addEventListener('click', () => {
      // Только фиксированная учебная разметка, не пользовательский ввод.
      card.innerHTML = `
        <h2>CSS Meetup</h2>
        <button type="button" class="event-toggle" id="identity-toggle" aria-expanded="false" aria-controls="identity-details">Подробности</button>
        <div class="event-details" id="identity-details" hidden><p>Программа и регистрация на Frontend Meetup.</p></div>
        <output class="instrument" id="identity-state"></output>
      `;
      inspect();
    });
    inspect();
  }

  function renderReset() {
    layout(
      'Сбросить — не значит очистить',
      'В HTML задано value="2". Введите 4 и предскажите результат нативного сброса.',
      `
        <section class="panel" aria-label="Текущее и начальное значение">
          <form id="reset-form">
            <label for="reset-count">Количество участников</label>
            <input id="reset-count" name="count" type="number" min="1" max="5" value="2" />
            <div class="button-row"><button type="reset">Сбросить</button></div>
          </form>
          <output class="readout code-readout" id="reset-values" aria-live="polite"></output>
          <p class="hint">Снимок читает реальные свойства поля. Ввод меняет .value, а reset возвращает начальное значение.</p>
        </section>
      `,
    );
    const form = document.querySelector('#reset-form');
    const input = document.querySelector('#reset-count');
    const output = document.querySelector('#reset-values');
    function inspect() {
      output.textContent =
        `input.value: ${JSON.stringify(input.value)}\n` +
        `input.defaultValue: ${JSON.stringify(input.defaultValue)}\n` +
        `input.getAttribute('value'): ${JSON.stringify(input.getAttribute('value'))}`;
    }
    form.addEventListener('submit', (event) => event.preventDefault());
    input.addEventListener('input', inspect);
    // reset-событие предшествует восстановлению значений контролов.
    form.addEventListener('reset', () => window.requestAnimationFrame(inspect));
    inspect();
  }

  function renderDelegation() {
    layout(
      'Новая карточка — новый обработчик?',
      'Слева слушатели установлены на исходные кнопки, справа — один слушатель на контейнере. Добавьте карточки и сравните.',
      `
        <section class="panel" aria-label="Прямые слушатели и делегирование">
          <div class="button-row"><button type="button" id="add-cards">Добавить карточки</button></div>
          <div class="demo-comparison">
            <section aria-labelledby="direct-title">
              <h2 id="direct-title">Прямые слушатели</h2>
              <div id="direct-cards" class="cards"></div>
              <output class="instrument" id="direct-log" aria-live="polite">Ожидаем click исходной кнопки.</output>
            </section>
            <section aria-labelledby="delegated-title">
              <h2 id="delegated-title">Делегирование</h2>
              <div id="delegated-cards" class="cards"></div>
              <output class="instrument" id="delegated-log" aria-live="polite">Ожидаем click внутри контейнера.</output>
            </section>
          </div>
          <p class="hint">Нажмите вложенный знак ⓘ, затем проверьте Enter на новой кнопке. target может быть span, а не button.</p>
        </section>
      `,
    );
    const direct = document.querySelector('#direct-cards');
    const delegated = document.querySelector('#delegated-cards');
    let nextCard = 0;
    function addPair() {
      nextCard += 1;
      for (const container of [direct, delegated]) {
        const id = `${container.id}-${nextCard}`;
        const article = document.createElement('article');
        article.className = 'event-card';
        // ID и текст задаёт демонстрация; непроверенного ввода здесь нет.
        article.innerHTML = `
          <h3>Meetup ${nextCard}</h3>
          <button type="button" class="event-toggle" id="${id}-toggle" aria-expanded="false" aria-controls="${id}-details"><span class="event-icon" aria-hidden="true">ⓘ</span> Подробности</button>
          <div class="event-details" id="${id}-details" hidden><p>Независимые подробности этой карточки.</p></div>
          <output class="instrument" id="${id}-state"></output>
        `;
        container.append(article);
        observeDisclosure(
          article.querySelector('button'),
          article.querySelector('.event-details'),
          article.querySelector('output'),
        );
      }
    }
    addPair();
    for (const button of direct.querySelectorAll('.event-toggle')) {
      button.addEventListener('click', (event) => {
        toggleEventDetails(event);
        document.querySelector('#direct-log').textContent =
          `target: ${event.target.tagName}; currentTarget: ${event.currentTarget.id}`;
      });
    }
    delegated.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest('.event-toggle');
      if (!button || !delegated.contains(button)) return;
      toggleDisclosure(button);
      document.querySelector('#delegated-log').textContent =
        `target: ${event.target.tagName}; currentTarget: ${event.currentTarget.id}; button: ${button.id}`;
    });
    document.querySelector('#add-cards').addEventListener('click', addPair);
  }

  function renderFull() {
    layout(
      'Frontend Meetup',
      'Небольшая настоящая страница: программа считается функцией, детали раскрываются, форма отправляет локальную заявку.',
      `
        <section class="panel" aria-labelledby="full-program-title">
          <h2 id="full-program-title">Программа</h2>
          <ul class="talk-list" id="program-list"><li>HTML — 20 мин.</li><li>CSS — 25 мин.</li></ul>
          <p class="total">Всего: <strong>${getTotalMinutes(talks)} минут</strong></p>
        </section>
        <section class="panel" aria-labelledby="full-event-title">
          <h2 id="full-event-title">О событии</h2>
          ${disclosureCard('event', 'Frontend Meetup', '18 октября · 19:00 · онлайн. Обсудим, как JavaScript изменяет браузерный DOM.')}
          <div class="button-row"><button type="button" class="secondary" id="reset-full-disclosure">Сбросить детали</button></div>
        </section>
        ${registrationForm()}
      `,
    );
    const button = document.querySelector('#event-toggle');
    const panel = document.querySelector('#event-details');
    const output = document.querySelector('#event-state');
    button.addEventListener('click', toggleEventDetails);
    document.querySelector('#reset-full-disclosure').addEventListener('click', () => {
      button.setAttribute('aria-expanded', 'false');
      panel.hidden = true;
      observeDisclosure(button, panel, output);
    });
    observeDisclosure(button, panel, output);
    activateRegistrationForm();
  }

  const renderers = {
    types: renderTypes,
    functions: renderFunctions,
    dom: renderDom,
    disclosure: renderDisclosure,
    events: renderEvents,
    form: renderForm,
    full: renderFull,
    multiple: renderMultiple,
    'form-data': renderFormData,
    replacement: renderReplacement,
    reset: renderReset,
    delegation: renderDelegation,
  };

  renderers[mode]();
  console.log('Лекция 06: JavaScript подключён');
})();
