<script setup lang="ts">
import { ref } from 'vue'
import LocalMeetup from './components/LocalMeetup.vue'
import LifecycleLab from './components/LifecycleLab.vue'
import SeatCounter from './components/SeatCounter.vue'
import SearchWorkspace from './components/SearchWorkspace.vue'
import WatcherLab from './components/WatcherLab.vue'
import PropsBoundaryLab from './components/PropsBoundaryLab.vue'
import LifecycleTreeLab from './components/LifecycleTreeLab.vue'
import RenderMechanismLab from './components/RenderMechanismLab.vue'
import ComposableHooksLab from './components/ComposableHooksLab.vue'
withDefaults(defineProps<{ mode?: string; base?: URL }>(), { mode: 'full', base: () => new URL(`${import.meta.env.BASE_URL}data/`, location.href) })
const tab = ref('local')
</script>
<template>
  <div class="meetup11">
    <div v-if="mode === 'full'" class="controls"><button type="button" :aria-pressed="tab === 'local'" @click="tab = 'local'">Локальная регистрация</button><button type="button" :aria-pressed="tab === 'search'" @click="tab = 'search'">Загрузка списка</button></div>
    <LocalMeetup v-if="mode === 'local' || mode === 'contract' || mode === 'full'" v-show="mode !== 'full' || tab === 'local'" :contract="mode === 'contract'" />
    <SearchWorkspace v-if="mode === 'search' || (mode === 'full' && tab === 'search')" :base="base" />
    <LifecycleLab v-if="mode === 'lifecycle'" />
    <LifecycleTreeLab v-if="mode === 'lifecycle-tree'" />
    <RenderMechanismLab v-if="mode === 'renderer'" />
    <WatcherLab v-if="mode === 'watch'" />
    <ComposableHooksLab v-if="mode === 'composable-hooks'" />
    <PropsBoundaryLab v-if="mode === 'props'" />
    <div v-if="mode === 'counters'" class="columns"><SeatCounter label="Экземпляр A" /><SeatCounter label="Экземпляр B" /></div>
  </div>
</template>
