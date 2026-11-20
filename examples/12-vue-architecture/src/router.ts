import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'
import type { DemoMode } from './demo'
import SchedulePage from './pages/SchedulePage.vue'
import EventPage from './pages/EventPage.vue'
import RegistrationsPage from './pages/RegistrationsPage.vue'
import DependencyPage from './pages/DependencyPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

const initialRoutes: Partial<Record<DemoMode, string>> = {
  routes: '/events/frontend-meetup/registrations',
  'page-state': '/events/frontend-meetup',
  store: '/events/frontend-meetup',
  api: '/events/frontend-meetup/registrations',
  dependency: '/dependency',
  contract: '/events/frontend-meetup/registrations',
  fallback: '/events/frontend-meetup/registrations?minSeats=2',
}

function eventProps(route: RouteLocationNormalized) {
  const eventId = route.params.eventId
  return { eventId: typeof eventId === 'string' ? eventId : '' }
}

export function makeRouter(mode: DemoMode) {
  const router = createRouter({
    history: import.meta.env.MODE === 'history'
      ? createWebHistory(import.meta.env.BASE_URL)
      : createWebHashHistory(),
    routes: [
      { path: '/', redirect: initialRoutes[mode] ?? '/schedule' },
      { path: '/schedule', name: 'schedule', component: SchedulePage },
      { path: '/events/:eventId', name: 'event', component: EventPage, props: eventProps },
      { path: '/events/:eventId/registrations', name: 'registrations', component: RegistrationsPage, props: eventProps },
      { path: '/dependency', name: 'dependency', component: DependencyPage },
      { path: '/:pathMatch(.*)*', component: NotFoundPage },
    ],
  })
  return router
}
