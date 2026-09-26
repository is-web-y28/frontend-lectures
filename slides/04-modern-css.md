---
theme: slidev-theme-tahta
title: Современный CSS
themeConfig:
  variant: soft
kicker: "Лекция 4 · Web-разработка: Frontend"
layout: cover
subtitle: "Адаптивная раскладка, пользовательские свойства и безопасное движение"
lineNumbers: true
transition: slide-left
---
<!-- 01 · cover -->

---
layout: statement
kicker: Продолжение лекции 3
title: Раскладка задаёт отношения. CSS задаёт <em>условия</em>, при которых они меняются
---
<!-- 02 · no slide body -->

---
layout: agenda
kicker: Модель лекции
title: Четыре источника изменений интерфейса
items:
  - { topic: Пространство, desc: "Viewport, содержимое и контейнер задают доступную геометрию" }
  - { topic: Содержание, desc: "Текст и изображения должны сохранять смысл при изменении размера" }
  - { topic: Состояние, desc: "Hover, focus, transition и animation сообщают о действии" }
  - { topic: Предпочтение, desc: "Уменьшенное движение сохраняет функцию без обязательного эффекта" }
---
<!-- 03 · Пользовательские свойства не источник изменения, а способ назвать решение. -->

---
layout: default
kicker: Наблюдаемая проблема
title: Одна страница, разные условия
---
<p class="slide-prompt"><strong>Сравните три режима:</strong> где меняются композиция, переполнение и доступность действий?</p>
<ResponsiveLayoutDemo class="full-area-component" />
<!-- 04 · Показать широкий, узкий режим и крупный текст. Называть наблюдаемые поломки, а не CSS-свойства. -->

---
layout: statement
kicker: Точка смены раскладки
title: Не устройства ломаются — ломаются <em>компоненты</em>
---
<p class="fs-lead mw-lead">Breakpoint выбирают по моменту, когда композиция перестаёт выполнять задачу, а не по каталогу устройств.</p>
<!-- 05 · Устройство не является устойчивой причиной для breakpoint. -->

---
layout: code-explain
kicker: Сначала узкая версия
title: Базовая версия читаема уже в одну колонку
notes:
  - "Сетка Grid без <code>grid-template-columns</code> создаёт одну колонку."
  - "Порядок программы и регистрации полезен без условия по ширине."
  - "Широкая версия будет улучшением, а не отдельным документом."
---
```css
.schedule {
  display: grid;
  gap: 1rem;
}
```

---
layout: vs
kicker: Содержание прежде композиции
title: Узкая версия проверяет структуру документа
label: Сначала смысл
left:
  title: Сохраняем
  items:
    - Название и содержание события
    - Действие после связанного содержания
    - Порядок чтения и клавиатурного фокуса
right:
  title: Можно менять
  items:
    - Количество колонок
    - Направление группы действий
    - Плотность отступов и декор
---
<!-- 07 · CSS не должен исправлять неясный документный порядок. -->

---
layout: code-explain
kicker: Система отсчёта
title: Viewport задаёт область, относительно которой строится страница
notes:
  - "Мобильный браузер без meta viewport может использовать широкий виртуальный viewport."
  - "<code>width=device-width</code> связывает ширину раскладки с шириной устройства."
  - "Не запрещаем масштабирование через <code>user-scalable=no</code>."
---
```html
<head>
  <meta
    name="viewport"
    content="width=device-width"
  />
</head>
```

---
layout: reference
kicker: До добавления условия
title: Пять проверок — от геометрии к условию
items:
  - { term: "1. Нормальный поток", desc: "Одна колонка уже сохраняет смысл и читаемость?" }
  - { term: "2. Содержимое", desc: "Потомок может сжаться, а длинная строка — перенестись?" }
  - { term: "3. Flexbox или Grid", desc: "Раскладка уже умеет перенести группу или выбрать колонки?" }
  - { term: "4. Гибкое значение", desc: "Достаточно minmax(), clamp() или max-width?" }
  - { term: "5. Запрос", desc: "Действительно меняется композиция страницы или компонента?" }
---
<!-- 09 · Переполнение содержимого не должно автоматически порождать breakpoint. -->

---
layout: code-explain
kicker: Медиазапрос
title: Условие добавляет правило к базовой раскладке
notes:
  - "До <code>48rem</code> действует одна колонка из базового правила."
  - "После условия сетка получает две равные колонки."
  - "Число выражает наблюдаемую границу этой композиции, а не класс устройства."
---
```css
.schedule {
  display: grid;
  gap: 1rem;
}

@media (min-width: 48rem) {
  .schedule {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---
layout: code-explain
kicker: Mobile first
title: Базовая версия работает; условие добавляет возможность
notes:
  - "Вертикальная группа безопасна при малой ширине."
  - "Условие меняет отношение элементов — <code>flex-direction</code>."
  - "<code>min-width</code> описывает появление пространства, а не каталог устройств."
---
```css
.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 36rem) {
  .actions {
    flex-direction: row;
  }
}
```

---
layout: define
kicker: Единица условия
term: Точка смены раскладки
definition: Ширина, на которой текущая композиция перестала выполнять свою задачу.
points:
  - "<code>rem</code> связан с размером текста: при увеличении шрифта условие сработает раньше."
  - "<code>px</code> остаётся корректным CSS-пикселем, когда именно это выражает требование."
  - "Число не переносится автоматически в другой компонент."
---
<!-- 12 · no slide body -->

---
layout: code-explain
kicker: Диапазон условий
title: Медиавыражение может проверять не только нижнюю границу
notes:
  - "Range syntax читается в том же порядке, что и математический диапазон."
  - "Низкое окно может создать проблему даже при достаточной ширине."
  - "Условие описывает наблюдаемое ограничение среды."
---
```css
@media (30rem <= width <= 60rem) {
  /* правило для диапазона */
}

@media (height < 30rem) {
  .site-header {
    position: static;
  }
}
```

---
layout: reference
kicker: Возможности среды
title: Медиазапросы описывают не только ширину
items:
  - { term: orientation, desc: Геометрия viewport — portrait или landscape }
  - { term: hover, desc: Есть ли устойчивое наведение у основного ввода }
  - { term: pointer, desc: Насколько точен основной указатель }
  - { term: print, desc: Страница выводится на печать }
---
<!-- 14 · Возможность ввода точнее названия устройства. -->

---
layout: default
kicker: Проверка в инструментах разработчика
title: Меняется представление, не документ
---
<p class="slide-prompt"><strong>Проверьте инварианты:</strong> HTML, порядок документа и содержание неизменны; меняется только дополнительное CSS-правило.</p>
<ResponsiveLayoutDemo initial-mode="wide" class="full-area-component" />
<!-- 15 · Показать две ширины: HTML, семантика, Grid и порядок документа остаются; меняется дополнительное правило. -->

---
layout: vs
kicker: Узкая ширина
title: Не скрываем основное содержание ради места
label: Проверка назначения
left:
  title: Плохой ответ
  items:
    - "display: none для расписания"
    - Пользователь теряет нужную информацию
    - Ширина маскирует проблему структуры
right:
  title: Рабочий ответ
  items:
    - Меняем раскладку или плотность
    - Оставляем содержание доступным
    - Скрываем только необязательный декор
---
<!-- 16 · Ширина сама по себе не доказывает, что содержание больше не нужно. -->

---
layout: section
index: "02"
kicker: Адаптивность без медиазапроса
title: Сначала выразить ограничение напрямую
subtitle: "Сначала проверьте <code>max-width</code>, <code>minmax()</code>, перенос строки и способность потомка сжиматься."
---
<!-- 17 · Браузер часто уже умеет выбрать устойчивую геометрию. -->

---
layout: code-visual
kicker: Геометрия изображения
title: CSS управляет рамкой, но не выбирает загружаемый файл
takeaway: "<code>object-fit: cover</code> сохраняет рамку, но может удалить значимые края изображения."
---
```css
.event-card img {
  display: block;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

::visual::
<ImageGeometryVisual />

---
layout: code-explain
kicker: Responsive images
title: Размер слота и размер загружаемого ресурса — разные задачи
notes:
  - "<code>srcset</code> перечисляет доступные ресурсы и их ширину."
  - "<code>sizes</code> сообщает ожидаемую ширину слота."
  - "Браузер учитывает слот, плотность экрана и другие условия выбора."
---
```html
<img
  src="speaker-800.jpg"
  srcset="speaker-480.jpg 480w,
          speaker-800.jpg 800w,
          speaker-1280.jpg 1280w"
  sizes="(min-width: 48rem) 33vw, 100vw"
  alt="Докладчик выступает на сцене"
/>
```

---
layout: code-explain
kicker: Art direction
title: picture выбирает другой кадр для другой композиции
notes:
  - "<code>srcset</code> обычно выбирает размер того же изображения."
  - "<code>picture</code> позволяет предложить другой кадр или формат."
  - "Вложенный <code>img</code> остаётся fallback и источником альтернативного текста."
---
```html
<picture>
  <source
    media="(width < 40rem)"
    srcset="speaker-close.jpg"
  />
  <img
    src="speaker-wide.jpg"
    alt="Докладчик выступает на сцене"
  />
</picture>
```

---
layout: code-visual
kicker: Самонастраивающаяся сетка
title: Независимые карточки сами выбирают число колонок
takeaway: "<code>auto-fit</code> создаёт только помещающиеся колонки; <code>1fr</code> распределяет остаток."
---
```css
.cards {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(
    auto-fit,
    minmax(16rem, 1fr)
  );
}
```

::visual::
<IntrinsicGridVisual />

---
layout: code-visual
kicker: Ограниченный размер
title: clamp() задаёт допустимый диапазон, а не breakpoint
takeaway: "Минимум и максимум ограничивают значение; средний аргумент изменяется вместе с viewport."
---
```css
.page-title {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

::visual::
<ClampRangeVisual />

---
layout: code-visual
kicker: Сжимаемое содержимое
title: Переполнение потомка не всегда требует нового условия
takeaway: "Сначала разрешите элементу сжаться и длинному токену перенестись — новый breakpoint может не понадобиться."
---
```css
.event-card__body {
  min-inline-size: 0;
}

.event-card a {
  overflow-wrap: anywhere;
}
```

::visual::
<ContentOverflowVisual />

---
layout: reference
kicker: Выбор механизма
title: Сначала геометрия, затем условие
items:
  - { term: Нормальный поток, desc: "Содержание уже имеет осмысленный порядок" }
  - { term: Ограничение, desc: "Медиа, потомки и длинные строки умеют сжиматься" }
  - { term: Flexbox или Grid, desc: "Раскладка выражает отношения без списка устройств" }
  - { term: Гибкое значение, desc: "minmax(), clamp() и max-width описывают диапазон" }
  - { term: Запрос, desc: "@media или @container меняет реальную композицию" }
---
<!-- 24 · Итоговая лестница вместо Quiz. -->

---
layout: default
kicker: Условие компонента
title: Viewport не всегда знает ширину <em>компонента</em>
---
<ContainerContextVisual class="full-area-component" />
<!-- 25 · Одна карточка одновременно живёт в широком main и узком aside. -->

---
layout: code-explain
kicker: Container queries
title: Медиазапрос и запрос к контейнеру не конкурируют
notes:
  - "<code>@media</code> отвечает за крупную композицию страницы."
  - "<code>@container</code> меняет внутренность переиспользуемого компонента."
  - "Запрос меняет потомка контейнера; базовая карточка остаётся читаемой без улучшения."
---
```css
.event-card {
  container-type: inline-size;
}

@container (min-width: 38rem) {
  .event-card__body {
    align-items: center;
    grid-template-columns: 9rem 1fr;
  }
}
```

---
layout: section
index: "03"
kicker: Пользовательские свойства CSS
title: Повторяющееся решение заслуживает имени
subtitle: "Имя получает повторяющаяся роль, а не каждое совпавшее число."
---
<!-- 27 · Переменная описывает решение, но не является источником изменения. -->

---
layout: code-explain
kicker: Общие роли
title: Повторяющиеся значения становятся именованными ролями
notes:
  - "<code>:root</code> подходит действительно общим значениям страницы."
  - "Имя описывает роль: отступ, поверхность, граница, акцент."
  - "Единичное число без роли не обязано становиться переменной."
---
```css
:root {
  --space-2: 0.5rem;
  --space-4: 1rem;
  --surface: #ffffff;
  --border: #e7e1d6;
  --accent: #ee5a36;
}
```

---
layout: code-visual
kicker: Наследование
title: Значение карточки доступно её потомкам
takeaway: "Переменная наследуется локально: вариант компонента меняет своё поддерево, а не глобальную палитру."
---
```css
.event-card {
  --accent: #ee5a36;
}

.event-card__badge {
  background: var(--accent);
}

.workshop-card {
  --accent: #16827a;
}
```

::visual::
<CustomPropertyInheritanceVisual />

---
layout: reference
kicker: Область свойства
title: Имя живёт у ближайшего общего предка потребителей
items:
  - { term: ":root", desc: Решение действительно общее для страницы }
  - { term: ".event-card", desc: Роль относится к карточке и её потомкам }
  - { term: ".button", desc: Значение нужно одному компоненту }
  - { term: "Не --blue-1", desc: Имя без роли не объясняет назначение значения }
---
<!-- 30 · Полная система токенов относится к лекции 5. -->

---
layout: code-explain
kicker: Резервное значение
title: Fallback не должен скрывать обязательную ошибку
notes:
  - "<code>1rem</code> используется, когда <code>--card-padding</code> действительно отсутствует."
  - "Fallback уместен для необязательного внешнего контракта."
  - "Обязательное значение определяем явно, чтобы опечатка была заметна."
---
```css
.event-card {
  padding: var(--card-padding, 1rem);
}
```

---
layout: section
index: "04"
kicker: Движение как обратная связь
title: Визуально сдвинуть — не значит переложить
subtitle: "<code>transform</code> меняет отрисовку; Grid, Flexbox и отступы меняют геометрию раскладки."
---
<!-- 32 · Движение дополняет состояние, а не строит основную геометрию. -->

---
layout: code-visual
kicker: Нормальный поток и transform
title: Transform не изменяет место элемента в раскладке
takeaway: "Соседи продолжают раскладываться по исходной геометрии; меняется только визуальное положение карточки."
---
```css
/* соседи реагируют */
.event-card:hover {
  margin-top: -0.75rem;
}

/* только визуальный сдвиг */
.event-card:hover {
  transform: translateY(-0.75rem);
}
```

::visual::
<TransformFlowVisual />

---
layout: code-explain
kicker: Координатные преобразования
title: Transform применяет последовательность функций
notes:
  - "<code>translate()</code> перемещает, <code>rotate()</code> вращает, <code>scale()</code> масштабирует."
  - "Функции применяются последовательно, поэтому их порядок влияет на результат."
  - "<code>transform-origin</code> задаёт точку вращения и масштабирования."
---
```css
.event-card {
  transform:
    translateX(1rem)
    rotate(3deg)
    scale(1.05);
  transform-origin: center;
}
```

---
layout: code-explain
kicker: Плавный переход
title: Transition принадлежит базовому состоянию
notes:
  - "Перечисляем только свойства, которые хотим интерполировать."
  - "Базовое состояние обеспечивает плавный вход и выход."
  - "<code>:focus-within</code> даёт сопоставимую обратную связь с клавиатуры."
---
```css
.event-card {
  transition:
    box-shadow 180ms ease,
    transform 180ms ease;
}

.event-card:hover,
.event-card:focus-within {
  box-shadow: 0 1rem 2rem rgb(0 0 0 / 12%);
  transform: translateY(-0.25rem);
}
```

---
layout: vs
kicker: Два механизма времени
title: Transition и animation отвечают на разные задачи
label: Изменение значения
left:
  title: transition
  items:
    - Интерполирует изменение CSS-состояния
    - Обычно связывает начальное и конечное значения
    - Естественен для hover, focus и open
right:
  title: animation
  items:
    - Имеет собственную временную последовательность
    - Может содержать несколько keyframes
    - Запускается при применении animation
---
<!-- 36 · Transition не «слушает hover»: он реагирует на изменение вычисленного значения. -->

---
layout: reference
kicker: Временная функция
title: Длительность и кривая отвечают на разные вопросы
items:
  - { term: linear, desc: "Постоянная скорость — например, равномерный технический прогресс" }
  - { term: ease, desc: "Спокойный базовый вариант с мягкими началом и концом" }
  - { term: ease-in, desc: "Разгон — подходит элементу, который уходит" }
  - { term: ease-out, desc: "Торможение — подходит появлению и остановке" }
  - { term: ease-in-out, desc: "Переход между двумя устойчивыми состояниями" }
---
<!-- 37 · 180ms — длительность; timing-function распределяет скорость внутри неё. -->

---
layout: default
kicker: Визуальное сравнение
title: Одинаковые начало и конец, разный темп
---
<TimingFunctionDemo class="full-area-component" />
<!-- 38 · Перезапустить, остановить около середины и сравнить семь функций на 20%, 50% и 80%. -->

---
layout: code-explain
kicker: Возможность ввода
title: Hover — возможность устройства, а не обязательный путь
notes:
  - "Обязательное содержание не показываем только по наведению."
  - "Клавиатурный фокус остаётся видимым независимо от движения."
  - "Capability query точнее предположения «телефон» или «компьютер»."
---
```css
@media (hover: hover) and (pointer: fine) {
  .event-card:hover {
    transform: translateY(-0.25rem);
  }
}

.event-card:focus-within {
  box-shadow: 0 0 0 0.2rem var(--accent);
}
```

---
layout: code-visual
kicker: Ключевые кадры
title: Keyframes описывают временную последовательность
takeaway: "Проценты задают промежуточные состояния эффекта; это отдельная временная шкала, а не состояние приложения."
---
```css
@keyframes reveal {
  0% {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  50% {
    opacity: .6;
    transform: translateY(0.2rem);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

::visual::
<KeyframeSequenceVisual />

---
layout: code-explain
kicker: Animation shorthand
title: Одна запись скрывает несколько независимых решений
notes:
  - "<code>name</code> выбирает keyframes, <code>duration</code> задаёт время."
  - "<code>timing-function</code> распределяет скорость, <code>fill-mode</code> управляет крайними значениями."
  - "Бесконечное повторение требует функционального обоснования и возможности остановки."
---
```css
.notice {
  animation: reveal 240ms ease-out both;

  animation-name: reveal;
  animation-duration: 240ms;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}
```

---
layout: panels
kicker: Граница использования движения
title: Анимация не должна быть единственным носителем смысла
panels:
  - { icon: "lucide:triangle-alert", title: Плохо, items: ["Ошибка только через тряску", "Ожидание появления содержания", "Непрерывное декоративное движение"] }
  - { icon: "lucide:bell", title: Хорошо, items: ["Появление уже понятного уведомления", "Ответ на действие", "Дополнение видимого состояния"] }
---
<!-- 42 · Текст, семантика, контраст и фокус существуют независимо от эффекта. -->

---
layout: code-explain
kicker: Предпочтение пользователя
title: Reduced motion отключает эффект, а не интерфейс
notes:
  - "Уведомление, кнопка, текст, порядок и видимый фокус остаются."
  - "Отключаем движение только у затронутых компонентов."
  - "Не добавляем глобальный сброс с <code>!important</code> без понимания границ приложения."
---
```css
@media (prefers-reduced-motion: reduce) {
  .event-card {
    transition: none;
  }

  .notice {
    animation: none;
  }
}
```

---
layout: reference
kicker: Диагностика
title: От изменившегося условия к CSS-механизму
items:
  - { term: Страница, desc: "Крупная композиция меняется через @media" }
  - { term: Компонент, desc: "Внутренняя композиция меняется через @container" }
  - { term: Содержимое, desc: "min-inline-size, overflow-wrap и гибкие размеры устраняют переполнение" }
  - { term: Состояние, desc: "Псевдокласс и transition связывают два вычисленных значения" }
  - { term: Последовательность, desc: "@keyframes и animation описывают эффект во времени" }
  - { term: Предпочтение, desc: "prefers-reduced-motion сохраняет функцию без движения" }
---
<!-- 44 · Начинаем диагностику с владельца изменившегося условия. -->

---
layout: end
kicker: Следующая лекция
title: Когда CSS начинает расти
subtitle: "Сегодня мы выбирали условие и механизм. Дальше — организация правил, каскад, инструменты и архитектура CSS."
---
<!-- 45 · Вопросы. -->

---
layout: section
index: "A"
kicker: Приложение · вне основных 90 минут
title: Дополнительные условия современного CSS
subtitle: Системная цветовая схема, мобильная высота, safe area, @property и @supports.
---
<!-- A1 · Материал приложения не входит в тайминг основной лекции. -->

---
layout: code-explain
kicker: Системная цветовая схема
title: Палитра начинается с ролей, а не с замены цветов
notes:
  - "<code>color-scheme</code> сообщает браузеру о поддержке обеих схем."
  - "Пользовательские свойства называют поверхность, текст, границу и акцент."
  - "Ручной переключатель темы потребует состояния и JavaScript."
---
```css
:root {
  color-scheme: light dark;
  --surface: #fffdf9;
  --text: #1e1d1a;
  --border: #ded7ca;
  --accent: #b93f22;
}
```

---
layout: code-explain
kicker: Системное предпочтение
title: prefers-color-scheme меняет значения ролей
notes:
  - "Структура интерфейса остаётся той же."
  - "Проверяем контраст, фокус, границы и отключённые состояния."
  - "Это автоматическая реакция, а не сохранённый выбор пользователя."
---
```css
@media (prefers-color-scheme: dark) {
  :root {
    --surface: #1d1b18;
    --text: #f5efe5;
    --border: #514b42;
    --accent: #ff8b70;
  }
}
```

---
layout: code-explain
kicker: Мобильная область просмотра
title: Длинному содержимому нужен минимум видимой высоты
notes:
  - "<code>100vh</code> остаётся резервом для старого браузера."
  - "<code>100dvh</code> следует за текущей видимой областью."
  - "<code>min-height</code> разрешает блоку вырасти вместе с содержимым."
---
```css
.hero {
  min-height: 100vh;
  min-height: 100dvh;
}
```

---
layout: code-explain
kicker: Безопасная область
title: Системный отступ дополняет базовый
notes:
  - "Базовый <code>1rem</code> нужен всегда."
  - "<code>env(..., 0px)</code> добавляет системное значение, если оно существует."
  - "Механизм нужен элементам у физического края экрана, а не каждому блоку."
---
```css
.mobile-actions {
  padding-bottom: calc(
    1rem + env(safe-area-inset-bottom, 0px)
  );
}
```

---
layout: code-explain
kicker: @property
title: Регистрация сообщает браузеру тип пользовательского свойства
notes:
  - "Регистрация задаёт синтаксис, наследование и начальное значение."
  - "Браузер получает возможность предсказуемо интерполировать цвет."
  - "Это улучшение эффекта, а не обязательная функция интерфейса."
---
```css
@property --card-accent {
  syntax: "<color>";
  inherits: true;
  initial-value: #ee5a36;
}
```

---
layout: statement
kicker: Прогрессивное улучшение
title: Сначала рабочая базовая версия, затем <em>@supports</em>
---
<!-- A7 · Поддержка возможности и условие интерфейса — разные вопросы. -->
