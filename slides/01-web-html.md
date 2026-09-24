---
theme: "slidev-theme-tahta"
title: "Web и HTML"
themeConfig:
  variant: "soft"
kicker: "Лекция 1 · Web-разработка: Frontend"
layout: "cover"
subtitle: "От адреса в браузере к первому семантическому HTML-документу"
lineNumbers: true
transition: "slide-left"
---
---
layout: "agenda"
kicker: "Результат лекции"
title: "К концу занятия вы сможете"
items:
  - { topic: "Понимать Web", desc: "Связать URL, DNS, HTTP, сервер и браузер в одну модель"}
  - { topic: "Создать документ", desc: "Написать index.html, открыть его в браузере и увидеть DOM"}
  - { topic: "Описать содержание", desc: "Выбрать HTML-элементы по назначению, а не по внешнему виду"}
  - { topic: "Проверить основу", desc: "Убедиться, что документ понятен без CSS"}
---
---
layout: "statement"
kicker: "Начинаем с задачи"
title: "Frontend начинается не с кнопок и цветов, а с человека в браузере."
---
---
layout: "feature"
kicker: "Три ответственности"
title: "Кто отвечает за «Сохранить»?"
columns: 3
features:
  - { icon: "lucide:braces", title: "HTML", desc: "Что это за элемент и какой у него смысл."}
  - { icon: "lucide:palette", title: "CSS", desc: "Как элемент выглядит и располагается."}
  - { icon: "lucide:zap", title: "JavaScript", desc: "Что произойдёт после действия пользователя."}
---
<!-- Сначала спросить: «Что здесь изменит цвет кнопки? А что сделает её кнопкой?» После двух-трёх ответов назвать CSS, HTML и JavaScript. -->
---
layout: "default"
kicker: "Путь запроса"
title: "Нажали Enter. Что дальше?"
---
<RequestFlow class="full-area-component" />
<!-- На каждом клике попросить аудиторию закончить фразу: «Теперь браузер знает…», «Теперь браузер просит…», «Теперь сервер возвращает…». -->
---
layout: "default"
kicker: "Адрес ресурса"
title: "URL — инструкция для браузера"
---
<UrlBreakdown class="full-area-component" />
<!-- Разобрать схему, хост, путь, параметр и фрагмент. Спросить, что изменится при другом разделе статьи и при другом теге. -->
---
layout: "default"
kicker: "Проверка"
title: "Что меняется внутри документа?"
---
<Quiz
  question="Какой переход обычно не требует нового ответа сервера?"
  :options="[
    { label: 'С `day=2` на `day=3`', correct: false },
    { label: 'С `#workshops` на `#speakers`', correct: true },
    { label: 'С `events.example.org` на `schedule.example.org`', correct: false }
  ]"
  explanation="Фрагмент после `#` указывает место в уже загруженном документе. Параметр и хост участвуют в новом запросе."
/>
<!-- После выбора связать правильный ответ с тем, что фрагмент обрабатывает браузер, а не сервер. -->
---
layout: "vs"
kicker: "Сеть и протокол"
title: "Сначала найти сервер, потом попросить страницу"
label: "Адрес → запрос"
left:
  title: "DNS"
  items:
    - "events.example.org → IP-адрес"
    - "Находит сервер по доменному имени"
right:
  title: "HTTP"
  items:
    - "GET /program?day=2 → 200 OK"
    - "Соглашение о запросах и ответах"
---
<!-- HTML пришёл — это ещё не вся страница: браузер отдельно запросит стили, изображения, шрифты и скрипты. -->
---
layout: "section"
index: "01"
kicker: "HTML"
title: "Документ называет содержание"
subtitle: "Не рисует картинку страницы, а описывает её части и смысл."
---
---
layout: "steps"
kicker: "Рабочий цикл"
title: "Сделаем один шаг — сразу посмотрим в браузер"
steps:
  - { title: "Создать файл", desc: "web-html-intro/index.html"}
  - { title: "Написать HTML", desc: "Начать с минимального документа"}
  - { title: "Открыть", desc: "Увидеть результат в браузере"}
  - { title: "Изменить и проверить", desc: "Сохранить, обновить, увидеть результат"}
---
<!-- Открыть редактор. Создать папку и файл на экране вместе с аудиторией. Короткая обратная связь лучше большого HTML «на удачу». -->
---
layout: "code-explain"
kicker: "Первый файл"
title: "Первый HTML-документ"
notes:
  - "<code>lang</code> задаёт основной язык документа."
  - "<code>title</code> меняет название вкладки."
  - "<code>h1</code> — основное содержание страницы."
---
```html {2|5|8|}
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <title>Моя первая страница</title>
  </head>
  <body>
    <h1>Привет, Web!</h1>
  </body>
</html>
```
<!-- Дать студентам создать файл, заменить заголовок на свой и проверить одновременно страницу и название вкладки. -->
---
layout: "default"
kicker: "Модель браузера"
title: "Браузер превращает текст в DOM"
---
<HtmlDomExplorer class="full-area-component" />
<!-- Выберите строку HTML или узел DOM: браузер сохраняет их вложенность и свойства в дереве памяти. Затем открыть Elements и показать подсветку h1 на странице. -->
---
layout: "code-explain"
kicker: "Анатомия элемента"
title: "Прочитаем одну строку HTML"
notes:
  - "<code>&lt;a&gt;</code> и <code>&lt;/a&gt;</code> — теги; вся запись — элемент."
  - "«Программа» — содержимое элемента."
  - "<code>href</code> — атрибут; <code>/program</code> — его значение."
---
```html {1,5|4|2}
<a
  href="/program"
>
  Программа
</a>
```
<!-- Не перегружать терминами: сразу связать элемент с содержанием, а атрибут — с настройкой элемента. -->
---
layout: "default"
kicker: "Проверка"
title: "Что добавляет href?"
---
<Quiz
  question="Что делает href в элементе ссылки?"
  :options="[
    { label: 'Задаёт адрес перехода', correct: true },
    { label: 'Делает текст синим', correct: false },
    { label: 'Добавляет обработчик нажатия', correct: false }
  ]"
  explanation="Атрибут href задаёт ресурс или место документа, куда ведёт ссылка. Оформление и поведение — задачи других слоёв."
/>
<!-- После проверки вернуться к трём слоям: HTML задаёт назначение, CSS — представление, JavaScript — поведение. -->
---
layout: "code-explain"
kicker: "Вложенность"
title: "Коробки внутри коробок"
notes:
  - "Элементы закрываются в обратном порядке вложенности."
  - "<code>meta</code>, <code>link</code> и <code>img</code> не содержат вложенного текста и не имеют закрывающего тега."
  - "Отступы помогают прочитать структуру."
---
```html {1,4|7-9|12-14}
<p>Это <strong>важное</strong> сообщение.</p>

<!-- Некорректно: порядок закрытия -->
<p>Это <strong>важное</p></strong>

<!-- Без содержания и закрывающего тега -->
<meta charset="utf-8">
<link rel="stylesheet" href="styles.css">
<img src="avatar.jpg" alt="">

<!-- Отступ показывает вложенность -->
<ul>
  <li>Первый пункт</li>
</ul>
```
<!-- Попросить аудиторию найти, какой элемент закрыт не в том порядке. -->
---
layout: "code-explain"
kicker: "Метаданные"
title: "Паспорт документа"
notes:
  - "<code>doctype</code> включает современный режим браузера."
  - "<code>lang</code> задаёт основной язык документа."
  - "<code>head</code> содержит метаданные и связанные ресурсы; <code>body</code> — отображаемое содержание."
---
```html {1|2|3,8}
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frontend Meetup</title>
  </head>
  <body>…</body>
</html>
```
<!-- Попросить студентов поставить язык своего примера и написать конкретный title. -->
---
layout: "agenda"
kicker: "Сначала содержание"
title: "Страница мероприятия"
items:
  - { topic: "Введение", desc: "Название и краткое описание"}
  - { topic: "Навигация", desc: "Ссылки на разделы страницы"}
  - { topic: "Программа", desc: "Докладчики и расписание"}
  - { topic: "Условия", desc: "Посещение и регистрация"}
  - { topic: "Контакты", desc: "Организатор и способ связи"}
---
<!-- Назовите части страницы вслух. Только затем выбирайте HTML-элементы — и лишь потом думайте об оформлении. -->
---
layout: "code"
kicker: "Структура страницы"
title: "Затем — честная карта страницы"
---
```html
<body>
  <header><nav>…</nav></header>
  <main>
    <article>
      <h1>Frontend Meetup</h1>
      <section>…</section>
      <section>…</section>
    </article>
    <aside>…</aside>
  </main>
  <footer>…</footer>
</body>
```
<!-- Спросите не «какой тег я помню?», а «что это за часть страницы?». -->
---
layout: "columns"
kicker: "Семантика"
title: "Выбираем элемент по назначению"
columns:
  - { title: "Крупные области", items: ["<code>header</code>, <code>nav</code>, <code>main</code>, <code>footer</code>", "Описывают роль области в документе"]}
  - { title: "Содержание", items: ["<code>article</code> — самостоятельный материал", "<code>section</code> — отдельная тема", "<code>aside</code> — дополнительная информация"]}
  - { title: "Группировка", items: ["<code>div</code> — техническая группировка", "Использовать, когда специальный элемент не описывает смысл лучше"]}
---
<!-- Попросить аудиторию назвать ещё две части, которые могут понадобиться странице мероприятия. -->
---
layout: "default"
kicker: "Проверка"
title: "Раздел или группировка?"
---
<Quiz
  question="Какой элемент подходит для блока «Программа» с собственным заголовком?"
  :options="[
    { label: 'section', correct: true },
    { label: 'div', correct: false },
    { label: 'span', correct: false }
  ]"
  explanation="Это самостоятельная тема документа с заголовком, поэтому подходит section. Div оставляют для технической группировки."
/>
<!-- После ответа вернуться к вопросу о назначении, а не к списку известных тегов. -->
---
layout: "code-explain"
kicker: "Структура документа"
title: "Заголовки — оглавление страницы"
notes:
  - "<code>h1</code> — название основного материала."
  - "<code>h2</code> — крупная тема внутри него."
  - "<code>h3</code> — подраздел темы."
  - "Уровень зависит от места в истории страницы, а не от желаемого размера шрифта."
---
```html {2|4,8|5|2-5,8}
<main>
  <h1>Frontend Meetup</h1>
  <section>
    <h2>Программа</h2>
    <h3>Практики интерфейсов</h3>
  </section>
  <section>
    <h2>Регистрация</h2>
  </section>
</main>
```
<!-- Открыть созданную страницу и попросить назвать назначение её частей без опоры на оформление. -->
---
layout: "columns"
kicker: "Содержимое"
title: "Чем заполнить эту структуру?"
columns:
  - { title: "Блоки текста", items: ["<code>p</code> — абзац", "<code>ul</code>, <code>ol</code>, <code>li</code> — списки", "<code>blockquote</code> — развёрнутая цитата"]}
  - { title: "Смысл внутри текста", items: ["<code>strong</code> — важность", "<code>em</code> — логическое ударение", "<code>del</code>/<code>ins</code> — редактура содержания"]}
---
<!-- Попросить сопоставить знакомые фрагменты с типом содержания: абзац, список, цитата или логическое выделение. -->
---
layout: "vs"
kicker: "Интерактивные элементы"
title: "Ссылка ведёт. Кнопка действует."
label: "Назначение"
left:
  title: "Переход"
  items:
    - "<code>&lt;a href=&quot;#program&quot;&gt;К программе&lt;/a&gt;</code>"
    - "Открывает ресурс или место в документе"
right:
  title: "Операция"
  items:
    - "<code>&lt;button type=&quot;button&quot;&gt;Открыть фильтры&lt;/button&gt;</code>"
    - "Запускает действие на текущей странице"
---
<!-- Спросить: «Где сегодня вы уже использовали ссылку, кнопку или форму?» Для каждого примера коротко назвать действие: переход, операция или ввод данных. -->
---
layout: "default"
kicker: "Проверка"
title: "Переход или операция?"
---
<Quiz
  question="Какой элемент нужен для действия «Открыть фильтры»?"
  :options="[
    { label: 'a с href', correct: false },
    { label: 'button', correct: true },
    { label: 'div с обработчиком', correct: false }
  ]"
  explanation="Фильтры открываются на текущей странице: это операция, а не переход к ресурсу."
/>
<!-- После ответа назвать риск имитации кнопки через div: придётся самостоятельно воспроизводить нативное поведение. -->
---
layout: "code-explain"
kicker: "Изображение"
title: "Что потеряется, если изображение не видно?"
notes:
  - "<code>src</code> — путь к файлу."
  - "<code>alt</code> передаёт полезный смысл изображения."
  - "<code>alt=&quot;&quot;</code> — для декоративного изображения без самостоятельной информации."
  - "<code>figure</code> и <code>figcaption</code> связывают иллюстрацию и подпись."
---
```html {3|4|10|1,6,7}
<figure>
  <img
    src="meetup.svg"
    alt="Спикер выступает перед аудиторией на конференции"
  >
  <figcaption>Открывающий доклад Frontend Meetup.</figcaption>
</figure>

<!-- Декоративное изображение -->
<img src="divider.svg" alt="">
```
<!-- Попросить назвать, что потеряет пользователь без изображения. Затем сравнить полезную альтернативу с именем файла. -->
---
layout: "default"
kicker: "Проверка"
title: "Какой alt передаёт смысл?"
---
<Quiz
  question="Какую текстовую альтернативу дать изображению спикера?"
  :options="[
    { label: 'meetup.svg', correct: false },
    { label: 'Спикер выступает перед аудиторией на конференции', correct: true },
    { label: 'Красивая картинка', correct: false }
  ]"
  explanation="Alt передаёт полезную информацию изображения, а не имя файла и не субъективную оценку."
/>
<!-- Зафиксировать: альтернативный текст описывает значимую информацию, а не внешний вид ради внешнего вида. -->
---
layout: "code-explain"
kicker: "Формы"
title: "Форма — разговор с пользователем"
notes:
  - "<code>label</code> даёт полю имя."
  - "<code>for</code> связывает подпись с <code>id</code> поля."
  - "<code>name</code> задаёт имя передаваемого значения."
  - "<code>autocomplete</code> и <code>required</code> уточняют ожидаемый ввод."
---
```html {3,7|3,4,7,8|4,8|4,8}
<form>
  <p>
    <label for="name">Имя</label>
    <input id="name" name="name" autocomplete="name" required>
  </p>
  <p>
    <label for="email">Электронная почта</label>
    <input id="email" name="email" type="email" autocomplete="email" required>
  </p>
  <button type="submit">Зарегистрироваться</button>
</form>
```
<!-- Дать студентам добавить форму регистрации с полями «Имя», «Электронная почта» и кнопкой. Проверить label, name и type="submit". -->
---
layout: "default"
kicker: "Проверка"
title: "Что связывает подпись и поле?"
---
<Quiz
  question="Что нужно связать у label и input?"
  :options="[
    { label: 'for у label и id у input', correct: true },
    { label: 'class у label и class у input', correct: false },
    { label: 'placeholder и type', correct: false }
  ]"
  explanation="Значение for ссылается на id поля. Так поле получает понятное имя и фокус при нажатии на подпись."
/>
<!-- Попросить одного студента объяснить связь for и id. -->
---
layout: "vs"
kicker: "Доступность по умолчанию"
title: "Сначала нативный HTML"
label: "Меньше ручной работы"
left:
  title: "Нативный элемент"
  items:
    - "<code>&lt;button&gt;Зарегистрироваться&lt;/button&gt;</code>"
    - "Уже имеет роль, фокус и ожидаемую клавиатурную работу"
right:
  title: "Имитация"
  items:
    - "<code>&lt;div role=&quot;button&quot;&gt;…&lt;/div&gt;</code>"
    - "Нужно самостоятельно реализовать недостающее поведение"
---
<!-- Правило: сначала подходящий нативный элемент. ARIA добавляем, только когда HTML не выражает нужное поведение. -->
---
layout: "default"
kicker: "Проверка результата"
title: "Снимите CSS: понятна ли страница?"
---
<SemanticDocumentPreview class="full-area-component" />
<!-- Сначала назовите: где навигация, основной материал, дополнительная информация и форма. Затем откройте исходный код. -->
---
layout: "reference"
kicker: "Перед сдачей"
title: "Пять вопросов к HTML-документу"
items:
  - { term: "Каркас", desc: "Есть doctype, html, head и body"}
  - { term: "Метаданные", desc: "Указаны язык, кодировка и осмысленный title"}
  - { term: "Семантика", desc: "Крупные области и темы выражены подходящими элементами"}
  - { term: "Иерархия", desc: "Заголовки образуют логичную структуру"}
  - { term: "Управление", desc: "Ссылка ведёт, кнопка действует, поле имеет подпись"}
  - { term: "Изображения", desc: "У содержательных изображений есть подходящий alt"}
---
---
layout: "panels"
kicker: "Продолжить самостоятельно"
title: "Полезные ссылки по HTML"
panels:
  - { title: "Дока", body: "Русскоязычные статьи, примеры и справочник.<br><a href=&quot;https://doka.guide/html/&quot; target=&quot;_blank&quot; rel=&quot;noreferrer&quot;>doka.guide/html/</a>"}
  - { title: "MDN Web Docs", body: "Руководства и подробная справка по элементам и атрибутам.<br><a href=&quot;https://developer.mozilla.org/ru/docs/Web/HTML&quot; target=&quot;_blank&quot; rel=&quot;noreferrer&quot;>developer.mozilla.org/ru/docs/Web/HTML</a>"}
  - { title: "HTML Living Standard", body: "Нормативная спецификация HTML от WHATWG.<br><a href=&quot;https://html.spec.whatwg.org/multipage/&quot; target=&quot;_blank&quot; rel=&quot;noreferrer&quot;>html.spec.whatwg.org/multipage/</a>"}
---
---
layout: "statement"
kicker: "Следующая лекция"
title: "HTML описывает содержание. Дальше CSS задаст ему представление."
---
---
layout: "end"
title: "Вопросы?"
---
