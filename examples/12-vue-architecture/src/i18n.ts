import { createI18n } from 'vue-i18n'

const messages = {
  ru: {
    nav: 'Навигация', schedule: 'Расписание', language: 'Язык', dependency: 'Подмена клиента',
    local: 'Локальные заявки', api: 'Заявки из API', eventMissing: 'Событие не найдено',
    pageMissing: 'Страница не найдена', name: 'Имя', seatCount: 'Число мест',
    add: 'Добавить', remove: 'Удалить', removeNamed: 'Удалить заявку: {name}',
    localTotal: 'Локальные заявки: {seats}', seats: '{count} место | {count} места | {count} мест',
    minSeats: 'От двух мест', allSeats: 'Все заявки', rowsEmpty: 'Заявок пока нет',
    filteredEmpty: 'По этому фильтру заявок нет', loading: 'Загрузка…',
    refreshing: 'Обновляем список…', refresh: 'Обновить', retry: 'Повторить',
    unavailable: 'Источник временно недоступен', loadError: 'Не удалось прочитать список',
  },
  en: {
    nav: 'Navigation', schedule: 'Schedule', language: 'Language', dependency: 'Swap the client',
    local: 'Local registrations', api: 'API registrations', eventMissing: 'Event not found',
    pageMissing: 'Page not found', name: 'Name', seatCount: 'Number of seats',
    add: 'Add', remove: 'Remove', removeNamed: 'Remove registration: {name}',
    localTotal: 'Local registrations: {seats}', seats: '{count} seat | {count} seats',
    minSeats: 'Two seats or more', allSeats: 'All registrations', rowsEmpty: 'No registrations yet',
    filteredEmpty: 'No registrations match this filter', loading: 'Loading…',
    refreshing: 'Refreshing the list…', refresh: 'Refresh', retry: 'Retry',
    unavailable: 'The source is temporarily unavailable', loadError: 'Could not load the list',
  },
}

const russianPlurals = new Intl.PluralRules('ru')

export function makeI18n(omitEnglishFilter = false) {
  const en: Partial<typeof messages.en> = { ...messages.en }
  if (omitEnglishFilter) delete en.minSeats

  return createI18n({
    legacy: false,
    locale: 'ru',
    fallbackLocale: 'ru',
    messages: { ru: messages.ru, en },
    pluralRules: {
      ru: choice => {
        const category = russianPlurals.select(choice)
        return category === 'one' ? 0 : category === 'few' ? 1 : 2
      },
    },
    datetimeFormats: {
      ru: { schedule: { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Moscow' } },
      en: { schedule: { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Moscow' } },
    },
    numberFormats: {
      ru: { integer: { maximumFractionDigits: 0 } },
      en: { integer: { maximumFractionDigits: 0 } },
    },
  })
}
