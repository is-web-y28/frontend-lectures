import { cp, mkdir, rm } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'

const workspace = 'examples/08-tooling-typescript'
const destination = 'slides/public/examples/08-tooling-typescript'
const result = spawnSync('npm', ['run', 'build', '--workspace', workspace], { stdio: 'inherit' })

if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)

// Publish only a successfully checked and bundled example; source TS stays outside public.
await rm(destination, { recursive: true, force: true })
await mkdir(destination, { recursive: true })
await cp(`${workspace}/dist`, destination, { recursive: true })
