<script setup lang="ts">
import { provide } from 'vue'
import { emptyRegistrationsApi, registrationsApiKey } from '@/features/registrations'
import RegistrationsPage from './RegistrationsPage.vue'

provide(registrationsApiKey, emptyRegistrationsApi)
</script>

<template>
  <p class="diagnostic">Стенд: ближайший provider возвращает пустой массив</p>
  <RegistrationsPage event-id="frontend-meetup" />
</template>
