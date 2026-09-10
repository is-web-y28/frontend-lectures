---
theme: default
colorSchema: auto
title: "Web и HTML"
info: |
  Первая лекция курса «Web-разработка: Frontend»: путь от URL до первого семантического HTML-документа.
highlighter: shiki
lineNumbers: true
transition: slide-left
mdc: true
---

# Web и HTML

<div class="lead">Нажали Enter. Что должно произойти, прежде чем появится первая страница?</div>

---
layout: center
class: text-center
---

## К концу лекции вы сможете

<div class="comparison text-left">
  <div class="card">
    <h3>Понимать Web</h3>
    <p>Связать URL, DNS, HTTP, сервер и браузер в одну модель.</p>
  </div>
  <div class="card">
    <h3>Создать документ</h3>
    <p>Написать <code>index.html</code>, открыть его в браузере и увидеть DOM.</p>
  </div>
</div>

<div class="comparison text-left" style="margin-top: 1.25rem">
  <div class="card">
    <h3>Описать содержание</h3>
    <p>Выбрать элементы HTML по назначению, а не по внешнему виду.</p>
  </div>
  <div class="card">
    <h3>Проверить основу</h3>
    <p>Убедиться, что документ понятен без CSS.</p>
  </div>
</div>

---

## С чего начинается frontend?

Не с кнопок и цветов, а с задачи человека в браузере.

<div class="card" style="margin-top: 1.5rem">
  Пользователь → браузер → сеть → сервер → данные → понятный интерфейс
</div>

<div v-click class="card" style="margin-top: 1.25rem">
  Интерфейс должен честно показывать не только результат, но и загрузку, ошибку, отсутствие данных и ограничение доступа.
</div>

---

## Кто отвечает за «Сохранить»?

<div class="comparison">
  <div class="card">
    <h3>HTML</h3>
    <pre><code>&lt;button&gt;Сохранить&lt;/button&gt;</code></pre>
    <p>Что это за элемент и какой у него смысл.</p>
  </div>
  <div class="card">
    <h3>CSS</h3>
    <pre><code>button { width: 100%; }</code></pre>
    <p>Как элемент выглядит и располагается.</p>
  </div>
</div>

<div class="card" style="margin-top: 1.25rem">
  <h3>JavaScript</h3>
  <pre><code>button.addEventListener('click', save)</code></pre>
  <p>Что произойдёт после действия пользователя.</p>
</div>


---

## Нажали Enter. Что дальше?

<RequestFlow />

---

## URL — инструкция для браузера

<UrlBreakdown />

---

## Проверка: что меняется внутри документа?

<Quiz
  question="Какой переход обычно не требует нового ответа сервера?"
  :options="[
    { label: 'С `day=2` на `day=3`', correct: false },
    { label: 'С `#workshops` на `#speakers`', correct: true },
    { label: 'С `events.example.org` на `schedule.example.org`', correct: false }
  ]"
  explanation="Фрагмент после `#` указывает место в уже загруженном документе. Параметр и хост участвуют в новом запросе."
/>
---

## Сначала найти сервер, потом попросить страницу

<div class="comparison">
  <div class="card">
    <h3>DNS</h3>
    <pre><code>events.example.org
      ↓
203.0.113.42</code></pre>
    <p>Помогает найти IP-адрес сервера по доменному имени.</p>
  </div>
  <div class="card">
    <h3>HTTP</h3>
    <pre><code>GET /program?day=2
      ↓
200 OK
&lt;!doctype html&gt;…</code></pre>
    <p>Соглашение о запросах и ответах между браузером и сервером.</p>
  </div>
</div>

<div class="card" style="margin-top: 1.25rem">
  HTML пришёл — это ещё не вся страница: браузер отдельно запросит стили, изображения, шрифты и скрипты.
</div>

---
layout: center
class: text-center
---

# HTML рассказывает о содержании

<div class="lead">Не рисует картинку страницы, а называет её части и смысл.</div>

---

## Сделаем один шаг — сразу посмотрим в браузер

```text
web-html-intro/
└── index.html
```

1. Создать файл.
2. Написать минимальный HTML.
3. Открыть его в браузере.
4. Изменить, сохранить и обновить страницу.
5. Проверить результат.

<div class="card" style="margin-top: 1.25rem">
  Изменить → сохранить → обновить → увидеть результат. Короткая обратная связь лучше большого HTML «на удачу».
</div>

---

## Первый HTML-документ

```html
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

<div class="comparison" style="margin-top: 1rem">
  <div class="card"><code>title</code> меняет название вкладки.</div>
  <div class="card"><code>h1</code> меняет основное содержание страницы.</div>
</div>

---

## Браузер превращает текст в DOM

<HtmlDomExplorer />

Выберите строку HTML или узел DOM: браузер сохраняет их вложенность и свойства в дереве памяти.

---

## Прочитаем одну строку HTML

```html
<a href="/program">Программа</a>
```

<div class="comparison">
  <div class="card">
    <ul>
      <li><code>&lt;a&gt;</code> и <code>&lt;/a&gt;</code> — теги;</li>
      <li>вся запись — элемент <code>a</code>;</li>
      <li>«Программа» — содержимое.</li>
    </ul>
  </div>
  <div class="card">
    <ul>
      <li><code>href</code> — атрибут;</li>
      <li><code>/program</code> — его значение;</li>
      <li>атрибут уточняет свойства элемента.</li>
    </ul>
  </div>
</div>

---

## Проверка: что добавляет href?

<Quiz
  question="Что делает href в элементе ссылки?"
  :options="[
    { label: 'Задаёт адрес перехода', correct: true },
    { label: 'Делает текст синим', correct: false },
    { label: 'Добавляет обработчик нажатия', correct: false }
  ]"
  explanation="Атрибут href задаёт ресурс или место документа, куда ведёт ссылка. Оформление и поведение — задачи других слоёв."
/>

---

## Коробки внутри коробок: вложенность

```html
<p>Это <strong>важное</strong> сообщение.</p>
```

Элементы закрываются в обратном порядке вложенности.

```html
<!-- Некорректно -->
<p>Это <strong>важное</p></strong>
```

<div class="card" style="margin-top: 1rem">
  У <code>meta</code>, <code>link</code> и <code>img</code> нет содержимого и закрывающего тега. Отступы помогают прочитать структуру; макет появится на следующей лекции вместе с CSS.
</div>

---

## Паспорт документа

```html
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

- <code>doctype</code> — современный режим браузера;
- <code>lang</code> — основной язык документа;
- <code>head</code> — метаданные и связанные ресурсы;
- <code>body</code> — отображаемое содержание.

---

## Сначала содержание, а не карточки

### Страница мероприятия

- название и краткое описание;
- навигация;
- программа и докладчики;
- условия посещения;
- форма регистрации;
- контакты организатора.

<div class="card" style="margin-top: 1.25rem">
  Назовите части страницы вслух. Только затем выберите HTML-элементы — и лишь потом думайте об оформлении.
</div>

---

## Затем — честная карта страницы

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

<div class="lead" style="font-size: 1rem">Спросите не «какой тег я помню?», а «что это за часть страницы?»</div>

---

## Выбираем элемент по назначению

<div class="comparison">
  <div class="card">
    <h3>Крупные области</h3>
    <p><code>header</code>, <code>nav</code>, <code>main</code>, <code>footer</code> описывают роль области в документе.</p>
  </div>
  <div class="card">
    <h3>Содержание</h3>
    <p><code>article</code> — самостоятельный материал; <code>section</code> — отдельная тема; <code>aside</code> — дополнительная информация.</p>
  </div>
</div>

<div class="card" style="margin-top: 1.25rem">
  <code>div</code> — техническая группировка. Используйте его, когда ни один специальный элемент не описывает смысл лучше.
</div>

---

## Проверка: раздел или группировка?

<Quiz
  question="Какой элемент подходит для блока «Программа» с собственным заголовком?"
  :options="[
    { label: 'section', correct: true },
    { label: 'div', correct: false },
    { label: 'span', correct: false }
  ]"
  explanation="Это самостоятельная тема документа с заголовком, поэтому подходит section. Div оставляют для технической группировки."
/>

---

## Заголовки — оглавление страницы

```html
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

Уровень заголовка зависит от места темы в истории страницы, а не от желаемого размера шрифта.

---

## Чем заполнить эту структуру?

<div class="comparison">
  <div class="card">
    <h3>Блоки текста</h3>
    <ul>
      <li><code>p</code> — абзац;</li>
      <li><code>ul</code>, <code>ol</code>, <code>li</code> — списки;</li>
      <li><code>blockquote</code> — развёрнутая цитата.</li>
    </ul>
  </div>
  <div class="card">
    <h3>Смысл внутри текста</h3>
    <ul>
      <li><code>strong</code> — важность;</li>
      <li><code>em</code> — логическое ударение;</li>
      <li><code>del</code>/<code>ins</code> — редактура содержания.</li>
    </ul>
  </div>
</div>

---

## Ссылка ведёт. Кнопка действует.

<div class="comparison">
  <div class="card">
    <h3>Переход</h3>
    <pre><code>&lt;a href="#program"&gt;
  К программе
&lt;/a&gt;</code></pre>
    <p>Ссылка открывает ресурс или место в документе.</p>
  </div>
  <div class="card">
    <h3>Операция</h3>
    <pre><code>&lt;button type="button"&gt;
  Открыть фильтры
&lt;/button&gt;</code></pre>
    <p>Кнопка запускает действие на текущей странице.</p>
  </div>
</div>

---

## Проверка: переход или операция?

<Quiz
  question="Какой элемент нужен для действия «Открыть фильтры»?"
  :options="[
    { label: 'a с href', correct: false },
    { label: 'button', correct: true },
    { label: 'div с обработчиком', correct: false }
  ]"
  explanation="Фильтры открываются на текущей странице: это операция, а не переход к ресурсу."
/>

---

## Что потеряется, если изображение не видно?

```html
<figure>
  <img
    src="meetup.svg"
    alt="Спикер выступает перед аудиторией на конференции"
  >
  <figcaption>Открывающий доклад Frontend Meetup.</figcaption>
</figure>
```

- <code>src</code> — путь к файлу;
- <code>alt</code> — полезный смысл изображения;
- <code>alt=""</code> — для декоративного изображения без самостоятельной информации;
- <code>figure</code> и <code>figcaption</code> связывают иллюстрацию и подпись.


---

## Проверка: какой alt передаёт смысл?

<Quiz
  question="Какую текстовую альтернативу дать изображению спикера?"
  :options="[
    { label: 'meetup.svg', correct: false },
    { label: 'Спикер выступает перед аудиторией на конференции', correct: true },
    { label: 'Красивая картинка', correct: false }
  ]"
  explanation="Alt передаёт полезную информацию изображения, а не имя файла и не субъективную оценку."
/>
---

## Форма — разговор с пользователем

```html
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

<div class="card" style="margin-top: 1rem">
  <code>label</code> даёт полю имя; <code>for</code> связывает его с <code>id</code>; <code>name</code> задаёт имя передаваемого значения.
</div>

---

## Проверка: что связывает подпись и поле?

<Quiz
  question="Что нужно связать у label и input?"
  :options="[
    { label: 'for у label и id у input', correct: true },
    { label: 'class у label и class у input', correct: false },
    { label: 'placeholder и type', correct: false }
  ]"
  explanation="Значение for ссылается на id поля. Так поле получает понятное имя и фокус при нажатии на подпись."
/>

---

## Сначала нативный HTML

<div class="comparison">
  <div class="card">
    <h3>Нативный элемент</h3>
    <pre><code>&lt;button&gt;Зарегистрироваться&lt;/button&gt;</code></pre>
    <p>Уже имеет роль, фокус и ожидаемую клавиатурную работу.</p>
  </div>
  <div class="card">
    <h3>Имитация</h3>
    <pre><code>&lt;div role="button"&gt;
  Зарегистрироваться
&lt;/div&gt;</code></pre>
    <p>Нужно самостоятельно реализовать недостающее поведение.</p>
  </div>
</div>

<div class="card" style="margin-top: 1.25rem">
  Правило: сначала подходящий нативный элемент. ARIA добавляем, только когда HTML не выражает нужное поведение.
</div>

---

## Снимите CSS: понятна ли страница?

<div class="card" style="margin: 0.75rem 0">
  Сначала назовите: где навигация, основной материал, дополнительная информация и форма. Затем откройте исходный код.
</div>

<iframe class="demo-frame" src="/examples/01-web-html/index.html" title="Семантическая HTML-страница мероприятия"></iframe>

<div class="lead" style="font-size: 1rem">Открыть исходный код: <a href="/examples/01-web-html/index.html" target="_blank">/examples/01-web-html/index.html</a></div>

---

## Пять вопросов к HTML-документу

<ul class="checklist">
  <li>Есть <code>doctype</code>, <code>html</code>, <code>head</code> и <code>body</code>.</li>
  <li>Указаны язык, кодировка и осмысленный <code>title</code>.</li>
  <li>Крупные области и темы выражены семантическими элементами.</li>
  <li>Заголовки образуют логичную иерархию.</li>
  <li>Ссылка ведёт, кнопка выполняет действие, поле имеет подпись.</li>
  <li>У содержательных изображений есть подходящий <code>alt</code>.</li>
</ul>

---

## Полезные ссылки по HTML

<div class="comparison">
  <div class="card">
    <h3>Дока</h3>
    <p>Русскоязычные статьи, примеры и справочник по HTML.</p>
    <a href="https://doka.guide/html/" target="_blank" rel="noreferrer">doka.guide/html/</a>
  </div>
  <div class="card">
    <h3>MDN Web Docs</h3>
    <p>Руководства и подробная справка по элементам и атрибутам HTML.</p>
    <a href="https://developer.mozilla.org/ru/docs/Web/HTML" target="_blank" rel="noreferrer">developer.mozilla.org/ru/docs/Web/HTML</a>
  </div>
</div>

<div class="card" style="margin-top: 1.25rem">
  <h3>HTML Living Standard</h3>
  <p>Нормативная спецификация HTML от WHATWG. Открывайте её, когда нужна точная формулировка поведения платформы.</p>
  <a href="https://html.spec.whatwg.org/multipage/" target="_blank" rel="noreferrer">html.spec.whatwg.org/multipage/</a>
</div>

---
layout: center
class: text-center
---

# Вопросы?
