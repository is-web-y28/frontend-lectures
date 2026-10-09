<script setup lang="ts">
import { ref } from 'vue'

type Submission = {
  query: string
  updatesValue: string | null
  internalIncluded: boolean
}

const preview = ref<HTMLIFrameElement | null>(null)
const frameReady = ref(false)
const submissions = ref<Submission[]>([])
const exampleUrl = `${import.meta.env.BASE_URL}examples/01-web-html/index.html#registration`

function readSubmission() {
  const location = preview.value?.contentWindow?.location
  if (!location?.search) return

  const url = new URL(location.href)
  submissions.value.push({
    query: url.search,
    updatesValue: url.searchParams.get('updates'),
    internalIncluded: url.searchParams.has('internal'),
  })
  if (submissions.value.length > 2) submissions.value.shift()
}

function scrollToRegistration() {
  preview.value?.contentDocument?.getElementById('registration')?.scrollIntoView({ block: 'start' })
}

function handleLoad() {
  frameReady.value = true
  scrollToRegistration()
  readSubmission()
}

function fillExample() {
  const document = preview.value?.contentDocument
  const name = document?.querySelector<HTMLInputElement>('#name')
  const email = document?.querySelector<HTMLInputElement>('#email')
  const format = document?.querySelector<HTMLInputElement>('#registration input[name="format"][value="online"]')
  const level = document?.querySelector<HTMLSelectElement>('#level')
  const comment = document?.querySelector<HTMLTextAreaElement>('#comment')
  const updates = document?.querySelector<HTMLInputElement>('#registration input[name="updates"]')

  if (!name || !email || !format || !level || !comment || !updates) return

  name.value = 'Алексей'
  email.value = 'alexey@example.org'
  format.checked = true
  level.value = 'practitioner'
  comment.value = 'Будет ли запись докладов?'
  updates.checked = false
}
</script>

<template>
  <section class="html-form-submission-demo" aria-label="Нативная GET-отправка формы регистрации">
    <header class="demo-header">
      <div>
        <p class="eyebrow">Реальная форма во фрейме</p>
        <h3>Преподаватель: подготовить, отправить, сравнить URL</h3>
      </div>
      <button type="button" :disabled="!frameReady" @click="fillExample">
        Заполнить пример
      </button>
    </header>

    <div class="iframe-stage">
      <iframe
        ref="preview"
        :src="exampleUrl"
        title="Форма регистрации Frontend Meetup с нативной GET-отправкой"
        @load="handleLoad"
      ></iframe>
    </div>

    <section class="submission-readback" tabindex="0" aria-label="Последние URL после нативной GET-отправки" aria-live="polite" @keydown.stop>
      <p class="readback-title">Последние два URL из iframe после submit</p>
      <p v-if="submissions.length === 0" class="empty-state">Отправок ещё нет.</p>
      <ol v-else>
        <li v-for="(submission, index) in submissions" :key="`${index}-${submission.query}`">
          <code>{{ submission.query }}</code>
          <span>
            updates: {{ submission.updatesValue ?? 'отсутствует' }} · internal: {{ submission.internalIncluded ? 'есть' : 'отсутствует (disabled)' }}
          </span>
        </li>
      </ol>
    </section>
  </section>
</template>

<style scoped>
.html-form-submission-demo {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  min-width: 0;
  min-height: 0;
  width: 100%;
}

.demo-header {
  align-items: center;
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  flex-shrink: 0;
}

.eyebrow {
  color: var(--fg-dim);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  margin: 0 0 0.15rem;
  text-transform: uppercase;
}

h3 {
  color: var(--fg);
  font-size: 0.9rem;
  line-height: 1.2;
  margin: 0;
}

button {
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: var(--radius-sm);
  color: var(--surface-bg);
  cursor: pointer;
  flex: 0 0 auto;
  font: inherit;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.45rem 0.6rem;
}

button:focus-visible,
.submission-readback:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
}

button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.iframe-stage {
  flex: 1;
  min-height: 0;
  position: relative;
}

iframe {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: var(--radius-sm);
  height: 100%;
  inset: 0;
  position: absolute;
  width: 100%;
}

.submission-readback {
  background: var(--surface-bg);
  border: var(--surface-border);
  border-radius: var(--radius-sm);
  color: var(--fg);
  padding: 0.45rem 0.6rem;
  flex-shrink: 0;
  max-height: 7rem;
  overflow: auto;
}

.readback-title,
.empty-state {
  font-size: 0.72rem;
  margin: 0;
}

.readback-title {
  color: var(--fg-dim);
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.empty-state {
  color: var(--fg-dim);
}

ol {
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding-left: 1.2rem;
}

li {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-size: 0.68rem;
}

code {
  overflow-wrap: anywhere;
}

li span {
  color: var(--fg-dim);
}
</style>
