---
theme: slidev-theme-tahta
title: Вёрстка средствами CSS
themeConfig:
  variant: soft
kicker: "Лекция 3 · Web-разработка: Frontend"
layout: cover
subtitle: От отдельных коробок к системе расположения
lineNumbers: true
transition: slide-left
---
---
layout: statement
kicker: Переход от блок-модели
title: Мы знаем размер карточки. Но кто определяет её место?
---
---
layout: default
kicker: Результат прошлой лекции
title: Браузер уже располагает элементы
---
<NormalFlowDemo variant="flow" class="full-area-component" />
<!-- Добавьте текст в первую карточку: в normal flow вторая карточка сдвигается вниз. -->
---
layout: agenda
kicker: Модель лекции
title: Четыре вопроса о раскладке
items:
  - { topic: Модель, desc: В какой раскладке участвует элемент? }
  - { topic: Поток, desc: Остаётся ли он в нормальном потоке? }
  - { topic: Пространство, desc: Откуда берётся доступное пространство? }
  - { topic: Размер, desc: Кто управляет размером — элемент, родитель или оба? }
---
---
layout: default
kicker: Нормальный поток
title: Структура документа определяет порядок
---
HTML читается в порядке исходного кода. Браузер последовательно создаёт коробки и размещает их по правилам выбранной модели.

Нормальный поток — это базовое поведение, которое мы переопределяем только когда оно не подходит.

<!-- Напомнить: карточки из предыдущего слайда располагаются друг под другом по умолчанию. -->
---
layout: code-explain
kicker: Блочная коробка
title: block — новая строка и заполнение ширины
notes:
  - "Блочная коробка начинается с новой строки"
  - "Заполняет доступную ширину контейнера"
  - "Высота определяется содержимым"
---
```css
article {
  display: block;
}
```

<!-- Следующая карточка появляется после предыдущей. Изменение высоты одной сдвигает остальные. -->
---
layout: code-explain
kicker: Строчная коробка
title: inline — участие в строке текста
notes:
  - "Участвует в строке"
  - "Переносится вместе с текстом"
  - "width и height не работают как блочные"
---
```css
a {
  display: inline;
}
```

<!-- Несколько ссылок могут стоять на одной строке. -->
---
layout: two-cols
kicker: Строчно-блочная коробка
title: inline-block остаётся в строке, но получает размеры
---
```css
.tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
}
```

::right::

- Остаётся частью строки
- Получает прямоугольную коробку
- Работают размеры и вертикальные отступы

<!-- Тег остаётся в строке, но получает самостоятельные размеры. -->
---
layout: vs
kicker: Внутренний и внешний layout
title: display управляет двумя вещами
label: Box ↔ Children
left:
  title: Внешний вид коробки
  items:
    - "block — новая строка"
    - "inline — часть строки"
    - "inline-block — в строке с размерами"
right:
  title: Раскладка детей
  items:
    - "display: flex — дети как flex items"
    - "display: grid — дети как grid items"
    - "Только непосредственные потомки"
---
---
layout: two-cols
kicker: Проверка display
title: Что изменится при смене display?
---
Сначала предскажите результат для трёх значений `display`, затем проверьте его в интерактиве:

- `block` — новая строка и доступная ширина;
- `inline` — участие в строке без блочной геометрии;
- `inline-block` — участие в строке с собственной коробкой.

::right::

<NormalFlowDemo variant="display" class="full-area-component" />
<!-- После объяснения block, inline и inline-block предложите переключить варианты. -->
---
layout: code-explain
kicker: Размеры
title: auto — полноценное решение
notes:
  - "Блочный элемент с width: auto заполняет доступную ширину."
  - "Высота определяется содержимым."
  - "Фиксированная высота может привести к переполнению."
---
```css
.card {
  width: auto;
}
```

<!-- Без явной ширины браузер использует доступное пространство контейнера. -->
---
layout: reference
kicker: Единицы измерения
title: Единица выражает зависимость
items:
  - { term: px, desc: Фиксированное значение без зависимости }
  - { term: rem, desc: Зависит от размера шрифта корневого элемента }
  - { term: em, desc: Зависит от размера шрифта текущего элемента }
  - { term: %, desc: Доля соответствующего размера содержащего блока }
  - { term: "vw, vh", desc: Зависит от видимой области браузера }
  - { term: fr, desc: Доля свободного пространства в Grid }
---
---
layout: vs
kicker: rem против em
title: <code>rem</code> и <code>em</code> отвечают на разные вопросы
label: Стабильность vs адаптивность
left:
  title: <code>rem</code> — стабильно
  items:
    - "Зависит от <br><code>html { font-size }</code>"
    - "Одно значение для всей страницы"
    - "Идеально для пространства"
  label: ".card { padding: 1.5rem; }"
right:
  title: <code>em</code> — адаптивно
  items:
    - "Зависит от шрифта текущего элемента"
    - "Компонент масштабируется с текстом"
    - "Риск вложенного масштабирования"
  label: ".badge { padding: 0.25em; }"
---

---
layout: code-explain
kicker: Проблемы вложенности
title: em масштабируется повторно внутри увеличенного шрифта
notes:
  - "1.2em на элементе"
  - "Вложенный элемент получает ещё ×1.2"
  - "Результат: 1,44 — не ошибка, но нужно помнить"
---
```css
.list {
  font-size: 1.2em;
}
```

<!-- Вложенный список получает увеличенный шрифт ещё раз. -->
---
layout: code-explain
kicker: Процент и viewport
title: Зависимость от контейнера vs зависимость от экрана
notes:
  - "% — доля соответствующего размера содержащего блока."
  - "vh — доля высоты viewport."
---

```css
.card {
  /* половина содержащего блока */
  width: 50%;
}

.hero {
  /* половина viewport */
  min-height: 50vh;
}
```

<!--
Для обычных отступов vh не нужен. Он полезен для полноэкранных секций.
-->

---
layout: two-cols
kicker: fr в Grid
title: Свободное пространство после gap и фиксированных размеров
---
```css
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
}
```

::right::

- `fr` — доля свободного пространства grid-контейнера
- Сначала вычитаются `gap` и фиксированные размеры

<!-- fr — единица Grid, а не Flexbox. Вторая колонка получает в два раза больше оставшегося пространства. -->
---
layout: panels
kicker: Выберите единицу
title: Решите по задаче, а не по памяти
panels:
  - { title: "Тонкая граница", body: "1px" }
  - { title: "Пространство карточки", body: "1.5rem" }
  - { title: "Badge рядом с текстом", body: "0.25em" }
  - { title: "Половина контейнера", body: "50%" }
  - { title: "Доля grid-колонки", body: "1fr" }
---

d

---
layout: reference
kicker: Выход из потока
title: "Позиционирование: поток и система координат"
items:
  - { term: static, desc: "Остаётся в потоке; смещения игнорируются" }
  - { term: relative, desc: "Сохраняет место и задаёт containing block" }
  - { term: absolute, desc: "Выходит из потока; привязан к containing block" }
  - { term: fixed, desc: "Обычно привязан к viewport" }
  - { term: sticky, desc: "Остаётся в потоке до порога прокрутки" }
---
---
layout: code-explain
kicker: static
title: Стандартное положение в потоке
notes:
  - "Значение по умолчанию"
  - "inset и top/left не работают"
---
```css
.element {
  position: static;
}
```

<!-- Элемент остаётся на своём месте. Свойства смещения игнорируются. -->
---
layout: code-explain
kicker: relative
title: Сохраняет место в потоке
notes:
  - "Место не освобождается"
  - "Визуальное смещение не влияет на соседей"
  - "Создаёт containing block для absolute-потомков"
---
```css
.card {
  position: relative;
}
```

<!-- Элемент остаётся на своём месте в потоке. Соседи не сдвигаются. -->
---
layout: default
kicker: Absolute positioning
title: Выходит из потока, привязывается к предку
---
<PositioningPlayground class="full-area-component" />
<!-- Выберите sticky и нажмите «Прокрутить +96px». Затем сравните absolute и fixed при той же прокрутке: absolute уезжает, fixed остаётся. Переключите z-index с 1 на 10 и покажите, как Child перекрывает Layer. -->
---
layout: code-explain
kicker: fixed
title: Обычно привязан к viewport
notes:
  - "Также выходит из потока."
  - "При прокрутке обычно остаётся на месте."
  - "Некоторые свойства предков могут изменить containing block."
---
```css
.fab {
  position: fixed;
  inset-block-end: 1rem;
  inset-inline-end: 1rem;
}
```

<!-- Подходит для независимой кнопки или уведомления, но не для основной раскладки страницы. -->
---
layout: code-explain
kicker: sticky
title: Начинается в потоке, прилипает при прокрутке
notes:
  - "Порог задаётся через top или inset-block-start."
  - "Работает в пределах ближайшего scroll container."
---
```css
.schedule__day {
  position: sticky;
  top: 1rem;
}
```

<!-- Sticky сохраняет место в раскладке и удерживается до границы своего контейнера. -->
---
layout: two-cols
kicker: z-index
title: Порядок перекрытия, а не раскладка
---
```css
.badge {
  position: absolute;
  z-index: 10;
}
```

::right::

- `z-index` управляет порядком наложения внутри stacking context
- Работает и для flex/grid items, не только для positioned elements
- Не перемещает элементы в потоке

<!-- z-index меняет слой наложения. Он не исправляет неправильный layout. -->
---
layout: default
kicker: Мини-задача
title: Почему badge оказался в углу страницы?
---
```css
.badge {
  position: absolute;
  top: 0;
  right: 0;
}
```

**Причина:** у badge `position: absolute`, но карточка не создаёт containing block.

**Решение:** добавить `.card { position: relative; }`.

<!-- Студенты должны назвать containing block и решение до показа ответа. -->
---
layout: statement
kicker: Одномерная раскладка
title: Flexbox — оси, выравнивание и пространство
---
---
layout: code-explain
kicker: Контейнер и элементы
title: Flexbox управляет только прямыми потомками
notes:
  - "display: flex на родителе"
  - ".actions__link и .actions__button становятся flex items"
  - "Вложенный span внутри ссылки не становится flex item"
---

```css
.actions {
  display: flex;
}

/* 
  Только .actions__link 
  и .actions__button — flex items
 */
```

<!--
Flexbox не управляет вложенным содержимым.
-->

---
layout: code-explain
kicker: Оси
title: flex-direction определяет оси
notes:
  - "row — основная ось горизонтальна"
  - "column — основная ось вертикальна"
  - "align-items всегда поперёк main axis"
---
```css
.actions {
  display: flex;
  flex-direction: row;       /* по умолчанию */
}

.list {
  display: flex;
  flex-direction: column;    /* вертикально */
}
```

<!-- При column основная ось становится вертикальной, а поперечной — горизонтальной. -->
---
layout: two-cols
kicker: Выравнивание
title: justify по основной оси, align — поперёк
---
```css
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

::right::

- `justify-content` распределяет свободное пространство
- `align-items` выравнивает по поперечной оси

<!-- Поменять flex-direction и показать: при column justify-content работает вертикально, а align-items — горизонтально. -->
---
layout: code-explain
kicker: Промежутки и перенос
title: gap задаёт расстояние между элементами, wrap — разрешает перенос
notes:
  - "`gap` не добавляет отступ по краям"
  - "`flex-wrap: wrap` разрешает перенос на новую строку"
---
```css
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
```

<!-- Уменьшить ширину контейнера: элементы переносятся на новую строку, gap сохраняется между всеми элементами. -->
---
layout: code-explain
kicker: Размер элементов
title: basis, grow и shrink делят пространство
notes:
  - "basis — начальный размер по основной оси"
  - "grow — доля свободного пространства при расширении"
  - "shrink — уменьшение при нехватке места"
---
```css
.card {
  flex: 1 1 16rem;
}
```

<!-- `flex` — сокращение flex-grow flex-shrink flex-basis. Здесь: растягиваться, сжиматься, начинать от 16rem. -->
---
layout: default
kicker: Практика
title: Соберите строку навигации с кнопками
---
Сначала предскажите, что произойдёт при смене направления, выравнивания и ширины контейнера.

<FlexPlayground class="full-area-component" />
<!-- Показать row, space-between, wrap и уменьшить доступную ширину. Решение строится через оси и свободное пространство. -->
---
layout: default
kicker: Осевая проверка
title: flex-direction меняет оси, а не смысл свойств
---
```css
.card-group {
  display: flex;
  flex-direction: column;
  align-items: stretch;     /* растягивает по горизонтали */
}
```
<!-- При column main axis вертикален, cross axis горизонтален. align-items: stretch растягивает элементы по горизонтали. -->
---
layout: statement
kicker: Двумерная раскладка
title: Grid — строки, колонки и пространство
---
---
layout: code-explain
kicker: Треки
title: grid-template-columns задаёт колонки контейнера
notes:
  - "12rem — фиксированная ширина"
  - "1fr — доля свободного пространства"
---
```css
.schedule {
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: 1rem;
}
```

<!-- Первая колонка фиксирована. Вторая растягивается на оставшееся пространство. -->
---
layout: code-explain
kicker: fr в действии
title: fr — доля свободного пространства после gap
notes:
  - "fr зависит от доступного пространства grid-контейнера."
  - "Сначала вычитаются gap и другие фиксированные размеры."
---
```css
.cards {
  display: grid;
  grid-template-columns: 1fr 2fr;
}
```

<!-- Вторая колонка получает в два раза больше оставшегося пространства, но не обязательно в два раза больше всей ширины. -->
---
layout: two-cols
kicker: Повторение треков
title: repeat() сокращает описание одинаковых колонок
---
```css
.cards {
  grid-template-columns: repeat(3, 1fr);
}
```

::right::

- `repeat(3, 1fr)` = `1fr 1fr 1fr`

<!-- Три одинаковые колонки — одна строка вместо трёх. -->
---
layout: default
kicker: Автоматическое размещение
title: Grid расставляет элементы по очереди
---
```html
<div class="gallery">
  <section>1</section>
  <section>2</section>
  <section>3</section>
  <section>4</section>
  <section>5</section>
  <section>6</section>
</div>
```
<!-- Grid размещает элементы по очереди: слева направо, сверху вниз. Добавленная карточка появляется после предыдущей — без ручного изменения CSS. -->
---
layout: code-explain
kicker: span и линии
title: Элемент может занять несколько треков
notes:
  - "span — занять N колонок"
  - "1 / 3 — от линии 1 до линии 3"
---
```css
.featured {
  grid-column: span 2;   /* или "1 / 3" */
}
```

<!-- Первый элемент занимает две колонки. Остальные размещаются после него автоматически. -->
---
layout: code-explain
kicker: Именованные области
title: Описать каркас страницы в одном месте
notes:
  - "Каждая строка в кавычках описывает одну строку сетки"
  - "grid-area привязывает элемент к имени"
---
```css
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "nav    main"
    "footer footer";
}

.page__header { grid-area: header; }
.page__nav    { grid-area: nav; }
.page__main   { grid-area: main; }
.page__footer { grid-area: footer; }
```

<!-- Когда структура стабильна и двумерна, области дают читаемую карту. Не использовать для каждой карточки. -->
---
layout: default
kicker: Интерактив
title: Попробуйте сами — добавьте карточку, смените колонки
---
<GridPlayground class="full-area-component" />
<!-- Добавьте карточку, поменяйте число колонок на 2 и 4, включите span 2. -->
---
layout: default
kicker: Сборка страницы
title: Frontend Meetup использует несколько моделей
---
<MeetupLayoutDemo class="full-area-component" />
<!-- Найдите поток, Flexbox, Grid, absolute badge и sticky-заголовок в одном примере. -->
---
layout: vs
kicker: Алгоритм выбора
title: От простого к нужному
label: Задача → механизм
left:
  title: Сначала оставить поток
  items:
    - "Элементы следуют содержанию → normal flow"
    - "Проблема только в размере → проверить единицы"
right:
  title: Добавить нужную модель
  items:
    - "Одна ось или группа → Flexbox"
    - "Строки и колонки вместе → Grid"
    - "Наложение или привязка → positioning"
---
---
layout: panels
kicker: Проверка
title: Первые четыре вопроса при отладке раскладки
panels:
  - { title: "1", body: "Какой layout mode у родителя?" }
  - { title: "2", body: "Элемент — прямой ребёнок контейнера?" }
  - { title: "3", body: "Элемент в нормальном потоке?" }
  - { title: "4", body: "От чего считаются координаты?" }
---
---
layout: panels
kicker: Проверка
title: Ещё четыре вопроса при отладке раскладки
panels:
  - { title: "5", body: "Какая сейчас основная ось?" }
  - { title: "6", body: "Откуда берётся свободное пространство?" }
  - { title: "7", body: "Порядок визуальный и DOM совпадают?" }
  - { title: "8", body: "Что показывают Flexbox/Grid overlays в DevTools?" }
---
---
layout: statement
kicker: Главный вывод лекции
title: Хорошая раскладка описывает отношения, а не координаты
---
---
layout: end
title: Вопросы?
---
