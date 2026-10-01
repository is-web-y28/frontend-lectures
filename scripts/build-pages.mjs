import { readdir, readFile, mkdir, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { basename, join } from 'node:path'

const repository = process.env.GITHUB_REPOSITORY
if (!repository) {
  throw new Error('GITHUB_REPOSITORY must be set (owner/repository)')
}

const repositoryName = repository.split('/').at(-1)
const slidesDirectory = 'slides'
const outputDirectory = join(slidesDirectory, 'dist')
await rm(outputDirectory, { recursive: true, force: true })
await mkdir(outputDirectory, { recursive: true })
const slideFiles = (await readdir(slidesDirectory))
  .filter((file) => file.endsWith('.md'))
  .sort((a, b) => a.localeCompare(b, 'en'))

if (slideFiles.length === 0) {
  throw new Error(`No Slidev decks found in ${slidesDirectory}/*.md`)
}

for (const file of slideFiles) {
  const slug = basename(file, '.md')
  const result = spawnSync('slidev', [
    'build',
    join(slidesDirectory, file),
    '--out', `dist/${slug}`,
    '--without-notes',
    '--base', `/${repositoryName}/${slug}/`,
  ], { stdio: 'inherit' })

  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

const readme = await readFile('README.md', 'utf8')
const homepage = `---
---

${readme}`

await writeFile(join(outputDirectory, 'index.md'), homepage)
