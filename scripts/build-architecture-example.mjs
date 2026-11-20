import { cp, mkdir, rm } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const workspace = 'examples/12-vue-architecture'
const destination = 'slides/public/examples/12-vue-architecture'
const result = spawnSync('npm', ['run', 'build', '--workspace', workspace], { stdio: 'inherit' })

if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)

await rm(destination, { recursive: true, force: true })
await mkdir(destination, { recursive: true })
await cp(`${workspace}/dist`, destination, { recursive: true })
