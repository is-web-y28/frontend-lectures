import { readdir, readFile, mkdir, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { basename, join } from 'node:path'
import { parseArgs } from 'node:util'

const { values } = parseArgs({
  options: {
    base: { type: 'string' },
  },
})
if (!values.base?.startsWith('/') || values.base.startsWith('//') || /[?#]/.test(values.base)) {
  throw new Error('--base must be a site path, such as / or /repository/')
}

const base = `${values.base.replace(/\/+$/, '')}/`
const redirectParameter = '__slidev_route'
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
  const deckBase = `${base}${slug}/`
  const result = spawnSync('slidev', [
    'build',
    join(slidesDirectory, file),
    '--out', `dist/${slug}`,
    '--without-notes',
    '--base', deckBase,
  ], { stdio: 'inherit' })

  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)

  // Restore a Pages 404 redirect before the deferred Slidev module reads the URL.
  const indexPath = join(outputDirectory, slug, 'index.html')
  const indexHtml = await readFile(indexPath, 'utf8')
  const restoreRoute = `<script>
(() => {
  const route = new URL(location.href).searchParams.get(${JSON.stringify(redirectParameter)})
  if (route?.startsWith(${JSON.stringify(deckBase)}))
    history.replaceState(null, '', route)
})()
</script>`
  await writeFile(indexPath, indexHtml.replace('<head>', `<head>\n${restoreRoute}`))
}

const readme = await readFile('README.md', 'utf8')
const homepage = `---
---

${readme}`

await writeFile(join(outputDirectory, 'index.md'), homepage)

// GitHub Pages serves only the site's root 404.html, not each deck's 404.html.
await writeFile(join(outputDirectory, '404.html'), `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Страница не найдена</title>
  <script>
    const base = ${JSON.stringify(base)}
    const decks = ${JSON.stringify(slideFiles.map(file => basename(file, '.md')))}
    if (location.pathname.startsWith(base)) {
      const slug = location.pathname.slice(base.length).split('/')[0]
      if (decks.includes(slug)) {
        const destination = new URL(base + slug + '/', location.origin)
        destination.searchParams.set(${JSON.stringify(redirectParameter)}, location.pathname + location.search + location.hash)
        location.replace(destination.href)
      }
    }
  </script>
</head>
<body>
  <h1>Страница не найдена</h1>
  <p>Проверьте ссылку на презентацию.</p>
</body>
</html>
`)
