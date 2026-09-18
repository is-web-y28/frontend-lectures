---
theme: slidev-theme-tahta
title: Основы CSS
themeConfig:
  variant: soft
kicker: "Лекция 2 · Web-разработка: Frontend"
layout: cover
subtitle: От семантического документа к предсказуемому оформлению
lineNumbers: true
transition: slide-left
---
---
layout: vs
kicker: Основа страницы
title: HTML и CSS решают <em>разные</em> задачи
label: Не подменяем одно другим
left:
  title: HTML
  items:
    - Ссылка ведёт к ресурсу
    - Кнопка запускает действие
    - Поле принимает данные
right:
  title: CSS
  items:
    - Цвет и типографика
    - Отступы и границы
    - Реакция на фокус и наведение
---
---
layout: default
kicker: Один документ
title: Базовое представление и авторский CSS
---
<DocumentStyleComparison class="full-area-component" />
<!-- Сначала сравните два варианта как один HTML-документ. У левого тоже есть базовые правила браузера; не возвращайтесь к этому сравнению при каждом новом свойстве. -->
---
layout: define
kicker: Термин
term: CSS
definition: Cascading Style Sheets (каскадные таблицы стилей) — язык, который
  описывает представление HTML-документа.
points:
  - К одному элементу подходят несколько правил
  - Браузер выбирает значения для каждого свойства
  - Порядок выбора называется каскадом
---

---
layout: agenda
kicker: Результат лекции
title: Шесть шагов при отладке CSS
items:
  - { topic: Декларация, desc: Значение свойства допустимо? }
  - { topic: Селектор, desc: Выбрать нужный элемент }
  - { topic: Каскад, desc: Объяснить итоговое значение свойства }
  - { topic: Наследование, desc: "Понять, что пришло от родителя" }
  - { topic: Состояние, desc: Проверить наведение и фокус }
  - { topic: Блочная модель, desc: Рассчитать размер элемента }
---
---
layout: code-explain
kicker: Внешние стили
title: Браузер загружает CSS как отдельный ресурс
notes:
  - <code>rel</code> сообщает тип связанного ресурса
  - <code>href</code> задаёт путь к файлу стилей
  - Пример находится в <code>slides/public/examples/02-css-basics/</code>
---
```html
<head>
  <link rel="stylesheet" href="styles.css">
</head>
```
<!-- Откройте slides/public/examples/02-css-basics/. В DevTools покажите, что stylesheet загрузился. -->
---
layout: default
kicker: Первое правило
title: Декларация меняет один аспект поверх базового вида
---
<CssPropertyPreview class="full-area-component" />
<!-- Нажмите свойства по очереди, затем «Базовый вид». HTML карточки не меняется; объявление меняет только один аспект уже оформленной карточки. -->
---
layout: code-explain
kicker: Значения
title: Свойства принимают значения разных категорий
notes:
  - "Ключевое слово: <code>none</code>"
  - "Длина: <code>20px</code> или <code>2rem</code>"
  - "Процент: <code>width: 100%</code>"
  - "Цвет: <code>#075985</code>"
  - "Составное значение: <code>1px solid #cbd5e1</code>"
---

```css
.card {
  /* Процент */
  width: 100%;
  /* Длина */
  padding: 20px;
  /* Цвет */
  color: #075985;
  /* Ключевое слово */
  text-decoration: none;
  /* Составное значение */
  border: 1px solid #cbd5e1;
}
```

<!--
Не превращайте слайд в каталог единиц. Эти категории уже встречаются в нашем примере.
-->

---
layout: code-explain
kicker: Диагностика
title: Недопустимое значение браузер игнорирует
notes:
  - Левое объявление применится
  - Правое не подходит свойству <code>font-size</code>
  - DevTools подсветит ошибку значения; в Styles объявления нет среди применённых
---

```css
h1 {
  /* допустимо */
  font-size: 20px;

  /* недопустимо — игнорируется */
  font-size: loud;
}
```

**DevTools:** выбрать `h1` → увидеть диагностическое сообщение о недопустимом значении и итоговые `20px` в Computed.

---
layout: default
kicker: DevTools
title: Браузер уже применяет CSS
---
- Крупный заголовок, синий цвет ссылки и отступы списка существуют до нашего файла.
- Их задаёт **user-agent stylesheet** — встроенная таблица стилей браузера.
- Во вкладке **Styles** видны применённые, зачёркнутые и недопустимые объявления.

<!-- Выберите h1 и ссылку в Elements. Покажите правила браузера и правило из styles.css. -->
---
layout: reference
kicker: Источники стилей
title: Стили приходят из трёх источников
items:
  - { term: Браузер, desc: User-agent stylesheet — встроенные правила браузера }
  - { term: Пользователь, desc: Пользовательская таблица стилей для собственных потребностей }
  - { term: Автор, desc: "Подключённые CSS-файлы, <code>&lt;style&gt;</code> и атрибут <code>style</code>" }
---
---
layout: code-explain
kicker: Авторские стили
title: Три способа подключить CSS
notes:
  - "Внешний файл: <code>&lt;link rel=&quot;stylesheet&quot;&gt;</code> — основной способ"
  - "<code>&lt;style&gt;</code>: правила только для текущего HTML-документа"
  - "Атрибут <code>style</code>: декларации только для одного элемента"
---
```html
<!-- Внешний файл -->
<link rel="stylesheet" href="styles.css">

<!-- Внутри документа -->
<style>
  h1 { color: #075985; }
</style>

<!-- У одного элемента -->
<h1 style="color: #075985;">Заголовок</h1>
```
<!-- Обычно выбираем внешний файл: его можно переиспользовать и кэшировать. style подходит для локального документа, атрибут style плохо переиспользуется. -->
---
layout: code
kicker: Селектор элемента
title: Выбрать все элементы данного типа
---
```css
h1 {
  color: #075985;
}

p {
  color: #334155;
}
```
<!-- Элементный селектор подходит для действительно общего правила: текста, заголовков, ссылок или кнопок. -->
---
layout: vs
kicker: Класс
title: Класс — авторская классификация или крючок
label: Не заменяет HTML
left:
  title: HTML сохраняет назначение
  items:
    - button.primary-action
    - article.event-card
    - a.nav-link
right:
  title: Класс помогает автору
  items:
    - Оформить вариант элемента
    - Выбрать группу элементов
    - Связать код с поведением позже
---
<!-- Класс не обязан означать только вид. Именные соглашения наподобие site-nav__link разберём в лекции 5; здесь используем нейтральный nav-link. -->
---
layout: code-explain
kicker: Другие селекторы
title: Иногда достаточно атрибута или идентификатора
notes:
  - <code>*</code> выбирает все элементы; используйте его осознанно
  - <code>#registration</code> выбирает элемент с уникальным идентификатором
  - <code>input[required]</code> выбирает элементы с указанным атрибутом
---
```css
* {
  box-sizing: border-box;
}

#registration {
  scroll-margin-top: 2rem;
}

input[required] {
  border-color: #075985;
}
```
<!-- Универсальный, ID- и атрибутный селекторы полезны, но не заменяют семантическую структуру HTML. -->
---
layout: code
kicker: Контекст
title: Пробел означает «потомок»
---
```css
nav a {
  color: #172033;
}

main a {
  color: #0369a1;
}
```
<!-- Контекст применяем, когда он действительно определяет роль. Не строим длинные маршруты из всей структуры документа. -->
---
layout: default
kicker: Без пробела и с пробелом
title: article.event-card — не article .event-card
---
```css
article.event-card { border-color: #075985; } /* сама статья с классом */
article .event-card { background: #e0f2fe; }  /* потомок с классом внутри статьи */
```

<SelectorRelationDemo class="full-area-component" />

<!-- Покажите пальцем: точка без пробела добавляет условие к тому же элементу; пробел переходит к потомку. -->
---
layout: code-explain
kicker: Комбинаторы
title: Связать элементы отношением
notes:
  - Пробел — любой потомок внутри элемента
  - <code>&gt;</code> — только непосредственный ребёнок
  - <code>+</code> — следующий соседний элемент
  - <code>~</code> — любой последующий сосед
---
```css
nav a { 
  color: #172033; 
}

article > header { 
  border-bottom: 1px solid #cbd5e1; 
}

h2 + ol {
  margin-top: 0.5rem; 
}

h2 ~ p {
  color: #475569;
}
```
<!-- Комбинатор описывает связь между частями селектора: вложенность или соседство. Не путайте > с пробелом: > ограничивает выбор непосредственными детьми. -->
---
layout: code
kicker: Сочетание
title: Запятая означает «или»
---
```css
button,
input,
textarea {
  font-size: 1rem;
}
```
<!-- Все перечисленные элементы получают одно намеренно выбранное правило. -->
---
layout: code-explain
kicker: Проверка
title: Что выберет каждый селектор?
notes:
  - <code>article</code> выбирает статьи по имени элемента
  - <code>.event-card</code> выбирает карточку по классу
  - <code>main a</code> выбирает ссылки внутри основной области
  - <code>.site-nav a</code> выбирает ссылки внутри навигации
---
```html {8,12|8|10,14|3,4}
<header>
  <nav class="site-nav" aria-label="Навигация">
    <a class="nav-link" href="#program">Программа</a>
    <a class="nav-link" href="#speakers">Докладчики</a>
  </nav>
</header>
<main>
  <article class="event-card">
    <h1>Frontend Meetup</h1>
    <a href="#program">Открыть программу</a>
  </article>
  <article class="registration-card">
    <h2>Регистрация</h2>
    <a href="#registration">Зарегистрироваться</a>
  </article>
</main>
```
<!-- Четыре клика последовательно показывают селектор справа и соответствующие ему строки HTML слева. -->
---
layout: default
kicker: Каскад
title: Браузер выбирает победителя для каждого свойства
---
<CascadePropertyMap class="full-area-component" />
<!-- Сначала назовите два подходящих правила, потом прочитайте Computed по строкам. Зачёркнутое значение color не отменяет thickness из того же правила. -->
---
layout: statement
kicker: Граница упрощения
title: Сегодня сравниваем обычные авторские объявления
---
В этой области для одного свойства сначала сравниваем специфичность, а при равенстве — порядок исходного кода.

Полный каскад учитывает и другие факторы. Их разберём позже; сейчас не смешиваем их с этой рабочей моделью.
---
layout: code
kicker: Порядок исходного кода
title: При равной специфичности побеждает более позднее объявление
---
```css
.event-card {
  border-color: #cbd5e1;
}

.event-card {
  border-color: #7dd3fc;
}
```
<!-- Не исправляйте дубликаты !important. Сначала удалите устаревшее или разведите роли правил. -->
---
layout: code-explain
kicker: Наследование
title: Собственное значение ребёнка важнее унаследованного
notes:
  - <code>color</code> обычно наследуется от <code>body</code>
  - Объявление для <code>a</code> задано прямо ссылке
  - Специфичность <code>body</code> здесь не соревнуется с <code>a</code>
---
```css
body#page {
  color: #172033;
}

a {
  color: #075985;
}
```

Ссылка синяя: её собственное `color` выигрывает у унаследованного, даже если селектор родителя выглядит сильнее.
---
layout: define
kicker: Механизм CSS
term: Наследование
definition: Некоторые свойства приходят к потомку от родителя, если для потомка не задано собственное значение.
points:
  - color и font-family обычно наследуются
  - margin, padding, border и width обычно не наследуются
  - Базовую типографику удобно задать один раз
---
---
layout: code
kicker: Форма
title: Наследование шрифта лучше выразить явно
---
```css
button,
input,
textarea,
select {
  font: inherit;
}
```
<!-- Элементы управления могут сохранить браузерный шрифт, поэтому явно наследуем только нужное свойство. -->
---
layout: reference
kicker: Сила селектора
title: Три уровня для первого приближения
items:
  - { term: a, desc: Селектор элемента }
  - { term: .nav-link, desc: Селектор класса — сильнее элемента }
  - { term: "#main-menu", desc: Селектор id="main-menu" — сильнее класса }
---
---
layout: code
kicker: Счётчики
title: Сначала id, затем классы, затем элементы
---
```css
main a {}             /* 0–0–2 */
.site-nav a {}        /* 0–1–1 */
#main-menu a {}       /* 1–0–1 */
```
<!-- Поэтому .site-nav a сильнее main a, а #main-menu a сильнее обоих — в границах обычных авторских объявлений. -->
---
layout: steps
kicker: Вместо !important
title: Диагностируем конфликт
steps:
  - { title: Выбрать элемент, desc: Открыть его в DevTools }
  - { title: Найти зачёркнутое объявление, desc: Увидеть, что проиграло }
  - { title: Найти победителя, desc: Проверить свойство, селектор и порядок }
  - { title: Исправить причину, desc: Изменить правило или удалить лишнее }
---
---
layout: default
kicker: Проверка
title: Какое правило победит?
---
```css
main a { color: #0369a1; }
.notice a { color: #b45309; }
```

Для ссылки внутри `<main class="notice">` победит `.notice a`.

<!-- Класс делает второй селектор специфичнее. При равенстве специфичности смотрим на порядок строк. -->
---
layout: code
kicker: Состояние элемента
title: Псевдокласс начинается с двоеточия
---
```css
a:hover { text-decoration: underline; }
a:focus-visible { outline: 3px solid #075985; }
button:active { transform: scale(0.98); }
input:invalid { border-color: #dc2626; }
```
<!-- Наведение, клавиатурный фокус и нажатие — разные состояния. Сегодня подробно разбираем первые три. -->
---
layout: default
kicker: Доступность
title: Состояния можно увидеть и с мышью, и с клавиатурой
---
<InteractiveStateDemo class="full-area-component" />
<!-- Наведите указатель, перейдите к кнопке клавишей Tab и удерживайте Enter либо пробел. Каждое состояние реально временное; после отпускания active исчезает. -->
---
layout: code
kicker: Доступность
title: hover не заменяет focus-visible
---
```css
a {
  color: #0369a1;
}

a:hover {
  color: #075985;
}

a:focus-visible {
  outline: 3px solid #075985;
  outline-offset: 3px;
}
```
<!-- Пользователь с клавиатурой не вызывает hover. Не убираем outline без заметной замены. -->
---
layout: statement
kicker: Проверка доступности
title: Нажмите Tab. Всегда ли видно, где сейчас фокус?
---
---
layout: define
kicker: Геометрия CSS
term: Блочная модель
definition: Каждый элемент образует прямоугольную область из content, padding, border и margin.
points:
  - content — содержимое
  - padding — внутренний отступ
  - border — граница
  - margin — внешний отступ
---
---
layout: default
kicker: Геометрия CSS
title: У каждой области своё назначение
---
<BlockModelDiagram class="full-area-component" />
<!-- Каждый клик по слайду последовательно подсвечивает content, padding, border и margin. Связывайте область с её функцией: текст, внутреннее пространство, граница, расстояние до соседей. -->
---
layout: code-explain
kicker: Карточка
title: Сокращённые записи читаем по частям
notes:
  - "<code>border: 1px solid #cbd5e1</code> задаёт ширину, стиль и цвет границы"
  - "<code>margin: 16px 0</code> означает сверху/снизу 16px, слева/справа 0"
  - "Одно значение <code>padding: 20px</code> применяется ко всем четырём сторонам"
---
```css
.event-card {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  margin: 16px 0;
  padding: 20px;
}
```
<!-- Фон занимает content и padding, но не margin. В DevTools откройте Computed и подсветите каждую область блочной модели. -->
---
layout: vs
kicker: Расчёт ширины
title: content-box и border-box считают по-разному
label: "width: 100%"
left:
  title: content-box
  subtitle: Значение width — только content
  items:
    - Padding добавляется с двух сторон
    - Border увеличивает видимый размер
    - Видимая ширина может выйти за родителя
right:
  title: border-box
  subtitle: Width включает content, padding и border
  items:
    - Размер элемента предсказуемее
    - Отступ не делает её шире
    - Раскладка остаётся темой следующей лекции
---
---
layout: code
kicker: Базовое правило
title: Включить padding и border в объявленный размер
---
```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```
<!-- * выбирает все элементы. ::before и ::after — будущие декоративные части элементов; правило заранее задаёт им ту же модель расчёта. -->
---
layout: fact
kicker: Проверка расчёта
value: "342"
unit: px
label: "Видимая ширина при content-box: width 300px + padding 20px × 2 + border 1px × 2"
---
---
layout: reference
kicker: Перед отладкой
title: Шесть шагов при отладке CSS
items:
  - { term: Декларация, desc: Значение допустимо для свойства? }
  - { term: Селектор, desc: Он выбирает нужный элемент? }
  - { term: Каскад, desc: Не переопределяет ли свойство другое правило? }
  - { term: Наследование, desc: Значение пришло от родителя или задано ребёнку? }
  - { term: Состояние, desc: "Видно ли focus, а не только hover?" }
  - {
      term: Размер,
      desc: "Как padding, border, margin и box-sizing влияют на размер?"
    }
---

---
layout: panels
kicker: Мини-проверка
title: Назовите первый диагностический шаг
panels:
  - { title: "font-size: loud", body: Проверить допустимость значения в DevTools }
  - {
      title: Цвет ссылки,
      body: "Проверить селектор, специфичность и порядок правил"
    }
  - {
      title: Шрифт кнопки,
      body: "Проверить наследование или добавить font: inherit"
    }
  - { title: Прокрутка у карточки, body: Проверить блочную модель и box-sizing }
---

---
layout: statement
kicker: Следующая лекция
title: Мы научились менять размеры и отступы. Дальше — научимся располагать элементы на странице.
---
---
layout: end
class: text-center
title: Вопросы?
---
