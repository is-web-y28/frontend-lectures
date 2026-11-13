import { createApp } from 'vue'
import App from './App.vue'
import './styles.css'

const modes = new Set(['full', 'local', 'contract', 'counters', 'props', 'lifecycle', 'lifecycle-tree', 'renderer', 'composable-hooks', 'watch', 'search'])
const requested = new URLSearchParams(location.search).get('demo') ?? 'full'
createApp(App, { mode: modes.has(requested) ? requested : 'full' }).mount('#app')
