---
theme: slidev-theme-tahta
title: Современный CSS
themeConfig:
  variant: soft
kicker: "Лекция 4 · Web-разработка: Frontend"
layout: cover
subtitle: От раскладки к правилам, устойчивым к изменению условий
lineNumbers: true
transition: slide-left
---

<!-- cover -->

---

layout: statement
kicker: Продолжение лекции 3
title: Раскладка задаёт отношения. Современный CSS задаёт <em>условия</em>, когда они меняются
---

<!-- no slide body -->

---

layout: agenda
kicker: Результат лекции
title: Четыре источника изменений интерфейса
items:

- { topic: Пространство, desc: Гибкие размеры, Grid и media queries }
- { topic: Повторение, desc: CSS custom properties дают решению имя }
- { topic: Состояние, desc: Transform и transition сообщают об действии }
- { topic: Предпочтение, desc: reduced motion сохраняет смысл без эффекта }

---

<!-- no slide body -->

---

layout: default
kicker: Наблюдаемая проблема
title: Одна страница, разные условия
---

<ResponsiveLayoutDemo class="full-area-component" />
<!-- Сначала выберите «Широко», затем «Узко» и «Крупный текст». Не называйте CSS до ответа аудитории: нужно сформулировать наблюдаемую проблему. -->
---
layout: statement
kicker: Breakpoint
title: Не устройства ломаются — ломаются <em>компоненты</em>
---
<!-- no slide body -->
---
layout: code-explain
kicker: Mobile-first
title: Базовая версия должна быть читаемой уже в одну колонку
notes:
  - "Grid без <code>grid-template-columns</code> создаёт одну колонку."
  - "Порядок программы и регистрации уже полезен без условия по ширине."
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
    - Действие регистрации после содержания
    - Порядок чтения в normal flow
right:
  title: Можно менять
  items:
    - Количество колонок
    - Плотность отступов
    - Второстепенный декор
---
<!-- no slide body -->
---
layout: default
kicker: Задача до механизма
title: Назовите проблему, не CSS-свойство
---
<div class="diagnosis-grid full-area-component">
  <ResponsiveLayoutDemo initial-mode="narrow" compact />
  <Quiz
    question="Что именно перестало работать?"
    :options="[
      { label: 'Нужен breakpoint для планшета', correct: false },
      { label: 'Карточка стала слишком узкой для заголовка', correct: true },
      { label: 'Нужно скопировать CSS из шаблона', correct: false }
    ]"
    explanation="Breakpoint появляется из наблюдаемой поломки компонента, а не из названия устройства."
  />
</div>
<!-- Сначала сравните узкую сцену слева с формулировками справа. Верный вариант открывается только после обсуждения. -->
---
layout: reference
kicker: До нового breakpoint
title: Четыре проверки в порядке стоимости
items:
  - { term: "1. Normal flow", desc: "Одна колонка уже сохраняет читаемость?" }
  - { term: "2. Flexbox", desc: "Группа может перенестись или изменить направление?" }
  - { term: "3. Grid", desc: "Независимые карточки выберут число колонок через minmax() и auto-fit?" }
  - { term: "4. @media", desc: "Нужно менять правило: зоны, направление, порядок или видимость декора?" }
---
<!-- no slide body -->
---
layout: code-explain
kicker: Media query
title: Условие добавляет правило к базовой раскладке
notes:
  - "До <code>48rem</code> у Grid одна колонка из базового правила."
  - "После условия Grid получает две одинаковые колонки."
  - "<code>48rem</code> — точка, где обе зоны в этом компоненте остаются читаемыми."
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

````
---
layout: code-explain
kicker: Mobile-first
title: При достаточной ширине группа действий становится строкой
notes:
  - "Базово у каждой кнопки есть собственная строка."
  - "Условие меняет отношение группы — <code>flex-direction</code>."
  - "<code>min-width</code> описывает появление возможности, а не каталог устройств."
---
```css
.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 36rem) {
  .actions {
    align-items: center;
    flex-direction: row;
  }
}
````

---

layout: define
kicker: Единица условия
term: Breakpoint
definition: Ширина, на которой текущая композиция перестала выполнять свою задачу.
points:

- "<code>rem</code> связан с размером текста: при увеличении шрифта условие сработает раньше."
- "<code>px</code> остаётся уместным для физического размера, например границы в 1px."
- "Число не переносится автоматически в другой компонент."

---

<!-- no slide body -->

---

layout: default
kicker: Проверка в DevTools
title: Меняется только представление, не документ
---

<ResponsiveLayoutDemo initial-mode="wide" class="full-area-component" />
<!-- Сузьте сцену до конфликтующих зон и верните широкий режим. Назовите неизменные вещи: Grid, HTML и документный порядок. -->
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
    - Ширина скрывает проблему структуры
right:
  title: Рабочий ответ
  items:
    - Меняем раскладку или плотность
    - Оставляем содержание доступным
    - Скрываем только необязательный декор
---
<!-- no slide body -->
---
layout: default
kicker: Задача до решения
title: Когда группе действий стать строкой?
---
<Quiz
  question="Две кнопки должны быть вертикально на узкой ширине и рядом, когда подписи помещаются. Что меняет breakpoint?"
  :options="[
    { label: 'Только color', correct: false },
    { label: 'flex-direction у группы действий', correct: true },
    { label: 'display: none у второй кнопки', correct: false }
  ]"
  explanation="Базовая версия уже работает без query; при наблюдаемой ширине меняется именно отношение внутри группы."
/>
<!-- Сначала дайте парам выбрать ширину и объяснить её. Затем откройте ответ; код на слайде 11 — один из возможных синтаксисов. -->
---
layout: section
index: "02"
kicker: Адаптивность без media query
title: Сначала выразить ограничение напрямую
---
<!-- no slide body -->
---
layout: code-explain
kicker: Гибкое медиа
title: Изображение не должно выходить за карточку
notes:
  - "<code>max-width: 100%</code> ограничивает изображение шириной контейнера."
  - "Изображение может быть меньше естественного размера, но не шире карточки."
  - "<code>height: auto</code> сохраняет пропорции."
---
```css
.event-card img {
  display: block;
  height: auto;
  max-width: 100%;
}
```
---
layout: code-explain
kicker: Intrinsic Grid
title: Независимые карточки сами выбирают число колонок
notes:
  - "<code>16rem</code> — минимальная полезная ширина одной карточки."
  - "<code>1fr</code> разрешает карточке расти в свободном пространстве."
  - "<code>auto-fit</code> создаёт столько колонок, сколько помещается."
---
```css
.cards {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
}
```
---
layout: code-explain
kicker: Ограниченный размер
title: clamp() задаёт диапазон, а не один размер
notes:
  - "Первый аргумент — минимум: заголовок не станет меньше <code>2rem</code>."
  - "Средний аргумент растёт вместе с viewport в допустимой области."
  - "Последний аргумент — максимум: заголовок не превысит <code>4rem</code>."
---
```css
.page-title {
  font-size: clamp(2rem, 5vw, 4rem);
}
```
---
layout: default
kicker: Прогноз до решения
title: Что требует условия, а что — ограничения?
---
<Quiz
  question="Карточки должны добавлять колонки только при полезной ширине. Первый выбор?"
  :options="[
    { label: 'max-width: 100% у карточек', correct: false },
    { label: 'repeat(auto-fit, minmax(...)) в Grid', correct: true },
    { label: 'media query на каждую ширину устройства', correct: false }
  ]"
  explanation="У независимых карточек Grid уже умеет выбрать устойчивую геометрию. Media query оставляем для реальной смены композиции страницы."
/>
<!-- После ответа вернитесь к фото и расписанию: фото ограничивает max-width, две смысловые зоны страницы требуют media query. -->
---
layout: steps
kicker: Выбор механизма
title: "Адаптивная раскладка: сначала ограничение, затем условие"
steps:
  - { title: Сохранить flow, desc: Одна колонка и ограниченное медиа уже читаемы }
  - { title: Выбрать раскладку, desc: Flexbox или Grid описывает отношения }
  - { title: Добавить @media, desc: Только при реальной смене композиции }
  - { title: Проверить, desc: Узкая, широкая ширина и увеличенный текст }
---
<!-- no slide body -->
---
layout: section
index: "03"
kicker: CSS custom properties
title: Повторяющееся решение заслуживает имени
---
<!-- no slide body -->
---
layout: code-explain
kicker: Общие роли
title: Значения становятся локальными токенами
notes:
  - "<code>:root</code> — место для действительно общих значений страницы."
  - "Имена описывают роль: отступ, поверхность, граница, accent."
  - "Не каждое число становится переменной: нужен повтор, роль или ожидаемое совместное изменение."
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
layout: code-explain
kicker: Наследование
title: Значение карточки доступно её потомкам
notes:
  - "<code>--accent</code> определён на карточке и наследуется бейджем."
  - "У workshop-варианта новое значение затрагивает только его поддерево."
  - "Это значение вычисляется браузером с учётом наследования и каскада."
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

````
---
layout: reference
kicker: Область переменной
title: Имя живёт у ближайшего общего предка потребителей
items:
  - { term: ":root", desc: Решение действительно общее для страницы }
  - { term: ".event-card", desc: Роль относится к карточке и её потомкам }
  - { term: ".button", desc: Значение нужно одному компоненту }
  - { term: "Не --blue-1", desc: Набор без ролей не объясняет назначение значения }
---
<!-- no slide body -->
---
layout: code-explain
kicker: Fallback
title: Запасное значение — не способ скрыть обязательную ошибку
notes:
  - "<code>1rem</code> сработает, когда <code>--card-padding</code> действительно не определён."
  - "Fallback уместен для необязательного внешнего контракта."
  - "Если переменная обязательна, определите её явно и увидьте опечатку в DevTools."
---
```css
.event-card {
  padding: var(--card-padding, 1rem);
}
````

---

layout: default
kicker: Задача до решения
title: Четыре числа — это четыре решения?
---

<Quiz
  question="Что стоит вынести в custom property первым?"
  :options="[
    { label: 'Каждое число, которое встретилось в CSS', correct: false },
    { label: 'Повторяющийся отступ карточек с одной ролью', correct: true },
    { label: 'Единственный случайный margin без повторов', correct: false }
  ]"
  explanation="Переменная полезна для повторяющегося решения с понятной ролью. Иначе имя только утяжеляет код."
/>
<!-- После ответа попросите назвать предка для accent карточки и для общего отступа страницы. -->

---

layout: section
index: "04"
kicker: Motion как обратная связь
title: Визуально сдвинуть — не значит переложить
---

<!-- no slide body -->

---

layout: code-explain
kicker: Document flow и transform
title: Соседи реагируют только на изменение раскладки
notes:

- "<code>margin-top</code> меняет геометрию: соседние карточки сдвигаются."
- "<code>transform</code> меняет только визуальное представление."
- "Для hover-ответа transform обычно точнее: сетка не дрожит."

---

```css
/* соседние элементы реагируют */
.event-card:hover {
  margin-top: -0.25rem;
}

/* только визуальный сдвиг */
.event-card:hover {
  transform: translateY(-0.25rem);
}
```

---

layout: code-explain
kicker: Transition
title: Переход принадлежит базовому состоянию
notes:

- "Перечисляем только свойства, которые хотим анимировать."
- "Базовое состояние обеспечивает плавный вход и выход из hover."
- "<code>:focus-within</code> даёт сопоставимый ответ, когда фокус на действии внутри карточки."

---

```css
.event-card {
  transition:
    box-shadow 180ms ease,
    transform 180ms ease;
}

.event-card:hover,
.event-card:focus-within {
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
  transform: translateY(-0.25rem);
}
```

---

layout: default
kicker: Проверка состояния
title: Мышь — не единственный путь к интерактивности
---

<MotionPreferenceDemo class="full-area-component" />
<!-- Наведите указатель на карточку, перейдите по Tab на ссылку и переключите «Меньше движения». Эффект меняется, но видимый фокус, текст и действие остаются. -->
---
layout: default
kicker: Задача до решения
title: Что должно анимироваться у карточки?
---
<Quiz
  question="Выберите безопасную motion-обратную связь для небольшой интерактивной карточки."
  :options="[
    { label: 'Краткий transform: translateY()', correct: true },
    { label: 'Постоянное движение без действия пользователя', correct: false },
    { label: 'height: auto как первый visual effect', correct: false }
  ]"
  explanation="Движение должно подтверждать уже понятное изменение состояния, а не создавать или скрывать смысл интерфейса."
/>
<!-- Вариант с box-shadow тоже допустим; здесь цель — отделить краткую обратную связь от постоянного отвлечения. -->
---
layout: code-explain
kicker: Keyframes
title: Явная последовательность для появления понятного сообщения
notes:
  - "<code>from</code> и <code>to</code> описывают два кадра эффекта."
  - "Текст уведомления существует в документе независимо от animation."
  - "<code>both</code> сохраняет нужные крайние значения на этапах проигрывания."
---
```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(0.5rem); }
  to   { opacity: 1; transform: translateY(0); }
}

.notice {
animation: reveal 240ms ease-out both;
}

````
---
layout: panels
kicker: Граница motion
title: Анимация не должна быть единственным носителем смысла
panels:
  - { icon: "lucide:triangle-alert", title: Плохо, items: ["Ошибка только через тряску", "Ожидание появления содержания", "Непрерывное декоративное движение"] }
  - { icon: "lucide:bell", title: Хорошо, items: ["Появление уже понятного уведомления", "Ответ на нажатие", "Изменение интерактивного состояния"] }
---
<!-- no slide body -->
---
layout: code-explain
kicker: Предпочтение пользователя
title: В reduced-motion отключается эффект, не интерфейс
notes:
  - "Уведомление, кнопка, текст и порядок остаются."
  - "Отключаем transition и animation только у затронутых компонентов."
  - "Не добавляем глобальный reset с <code>!important</code> без понимания границ приложения."
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
````

---

layout: default
kicker: Проверка reduced motion
title: Понятен ли интерфейс без декоративного движения?
---

<MotionPreferenceDemo initial-reduced class="full-area-component" />
<!-- Включите обычный и reduced-motion режимы. Проверьте: интерактивность карточки, читаемость сообщения и сохранение видимого фокуса. -->
---
layout: panels
kicker: Один компонент, четыре условия
title: Frontend Meetup остаётся понятным при изменениях
panels:
  - { icon: "lucide:columns-3", title: Доступная ширина, items: ["Grid с minmax() выбирает колонки карточек"] }
  - { icon: "lucide:git-branch", title: Смена композиции, items: ["Media query перестраивает связанные зоны"] }
  - { icon: "lucide:variable", title: Повторяющиеся роли, items: ["Custom properties хранят общие отступы и accent"] }
  - { icon: "lucide:accessibility", title: Предпочтение пользователя, items: ["Reduced motion оставляет функцию без эффекта"] }
---
<!-- no slide body -->
---
layout: steps
kicker: Диагностика
title: От наблюдаемого условия к CSS-решению
steps:
  - { title: Что изменилось?, desc: Ширина, текст, предпочтение или состояние? }
  - { title: Можно без query?, desc: Normal flow, Flexbox или intrinsic Grid уже достаточно? }
  - { title: Чьё условие?, desc: Страница выбирает @media, карточка — @container }
  - { title: Что сохраняем?, desc: Смысл, фокус, контраст и повторяющиеся роли }
---
<!-- no slide body -->
---
layout: panels
kicker: Финальная практика · 4 минуты
title: Сделайте карточки устойчивыми
panels:
  - { icon: "lucide:image", title: Медиа и Grid, items: ["Ограничить изображение", "Карточки без фиксированного числа колонок"] }
  - { icon: "lucide:split", title: Композиция, items: ["Группа действий: колонка → строка", "Назвать наблюдаемый breakpoint"] }
  - { icon: "lucide:variable", title: Роли, items: ["Accent", "Два уровня отступов"] }
  - { icon: "lucide:mouse-pointer-2", title: Состояние, items: ["Hover и keyboard focus", "Reduced-motion без потери функции"] }
---
<!-- После каждого изменения студент называет условие, которое оно обрабатывает. Не выдавайте «правильный CSS» до объяснения причины. -->
---
layout: statement
kicker: Итог основной части
title: Вопросы?
---
<!-- no slide body -->
---
layout: section
index: "Доп."
kicker: Факультатив · 60 минут
title: Продвинутые условия — не новые фреймворки
subtitle: Container queries, системная схема, mobile viewport и @property.
---
<!-- no slide body -->
---
layout: statement
kicker: Container queries
title: Viewport не всегда знает ширину <em>компонента</em>
---
<!-- no slide body -->
---
layout: code-explain
kicker: Сначала объявляем контейнер
title: Потомки получают право спросить его inline-size
notes:
  - "<code>inline-size</code> — термин API; в обычном горизонтальном документе это ширина."
  - "Контейнером становится сама карточка."
  - "Внутреннее содержимое остаётся в обычном Grid до выполнения условия."
---
```css
.event-card {
  container-type: inline-size;
}

.event-card__body {
display: grid;
gap: 1rem;
}

````
---
layout: code-explain
kicker: Условие компонента
title: Query меняет потомка, не измеряемый контейнер
notes:
  - "До <code>38rem</code> изображение и текст идут друг за другом."
  - "После условия изображение получает колонку, текст — оставшееся место."
  - "Нельзя измерять <code>.event-card</code> и в том же условии менять её собственный размер: это создаёт цикл."
---
```css
@container (min-width: 38rem) {
  .event-card__body {
    align-items: center;
    grid-template-columns: 9rem 1fr;
  }
}
````

---

layout: reference
kicker: Владелец условия
title: Media query и container query не конкурируют
items:

- { term: "@media", desc: Основные зоны страницы становятся одной или двумя колонками }
- { term: "@container", desc: Карточка меняет внутреннюю композицию в разных родителях }
- { term: "auto-fit + minmax()", desc: Независимые карточки сами выбирают число колонок }
- { term: "Не query", desc: Ограничение или normal flow уже сохраняют читаемость }

---

<!-- no slide body -->

---

layout: default
kicker: "Практика: одна карточка в двух контейнерах"
title: Одинаковый viewport, разная ширина компонента
---

<ContainerQueryDemo class="full-area-component" />
<!-- Покажите, что широкая карточка меняет только внутреннюю композицию. Узкая остаётся читаемой без отдельного viewport breakpoint. -->
---
layout: code-explain
kicker: Системная светлая и тёмная схема
title: Палитра — это роли, а не замена всех цветов
notes:
  - "<code>color-scheme</code> сообщает браузеру о поддержке обеих схем."
  - "Значения называют роли: поверхность, текст, граница, accent."
  - "Это продолжение custom properties из основной лекции, а не ручной переключатель темы."
---
```css
:root {
  color-scheme: light dark;
  --surface: #fffdf9;
  --surface-raised: #ffffff;
  --text: #1e1d1a;
  --border: #ded7ca;
  --accent: #b93f22;
}
```
---
layout: code-explain
kicker: Предпочтение цветовой схемы
title: Браузер сообщает системное предпочтение
notes:
  - "В условии меняются значения ролей, а не структура интерфейса."
  - "Здесь нет кнопки темы, событий и сохранения настройки."
  - "Проверяем контраст текста, фокус, границу и disabled-состояние."
---
```css
@media (prefers-color-scheme: dark) {
  :root {
    --surface: #1d1b18;
    --surface-raised: #292621;
    --text: #f5efe5;
    --border: #514b42;
    --accent: #ff8b70;
  }
}
```
---
layout: code-explain
kicker: Mobile viewport
title: Для длинного содержимого нужен минимум видимой высоты
notes:
  - "Первая строка — fallback для браузера без <code>dvh</code>."
  - "<code>100dvh</code> следует за текущей видимой областью mobile-браузера."
  - "<code>min-height</code> позволяет герою вырасти; <code>height</code> может обрезать содержание."
---
```css
.hero {
  min-height: 100vh;
  min-height: 100dvh;
}
```
---
layout: code-explain
kicker: Safe area
title: Системный inset дополняет базовый отступ
notes:
  - "<code>1rem</code> нужен всегда — это базовый отступ."
  - "<code>env(..., 0px)</code> добавляет системное значение, когда оно есть."
  - "Подходит закреплённой нижней панели, плавающей кнопке и полноэкранным действиям."
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
title: Обычная custom property не обязана иметь известный браузеру тип
notes:
  - "Регистрация задаёт синтаксис, наследование и начальное значение."
  - "После неё браузер знает, что <code>--card-accent</code> — цвет."
  - "Это улучшение интерполяции, а не обязательная функция интерфейса."
---
```css
@property --card-accent {
  syntax: "<color>";
  inherits: true;
  initial-value: #ee5a36;
}
```
---
layout: code-explain
kicker: Прогрессивное улучшение
title: Типизированная custom property может анимироваться предсказуемо
notes:
  - "Граница видна и без поддержки <code>@property</code>."
  - "При поддержке цвет плавно интерполируется."
  - "Не строим обязательную навигацию, ошибку или подтверждение на одной только animation."
---
```css
.event-card {
  --card-accent: #ee5a36;
  border-left: 0.3rem solid var(--card-accent);
  transition: --card-accent 180ms ease;
}

.event-card:hover {
--card-accent: #16827a;
}

```
---
layout: end
title: Условие выбираем по владельцу решения
subtitle: Страница → @media · компонент → @container · системная роль → prefers-color-scheme · улучшение motion → @property
---
<!-- no slide body -->
```
