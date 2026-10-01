import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import sass from 'sass'
import tailwindcss from '@tailwindcss/postcss'

const exampleDirectory = resolve('slides/public/examples/05-css-organization')
const sourceDirectory = resolve(exampleDirectory, 'source')
const generatedDirectory = resolve(exampleDirectory, 'generated')

const writeGenerated = async (filename, contents) => {
  const destination = resolve(generatedDirectory, filename)
  await mkdir(dirname(destination), { recursive: true })
  await writeFile(destination, contents)
  console.log(`wrote ${destination}`)
}

await rm(generatedDirectory, { recursive: true, force: true })
await mkdir(generatedDirectory, { recursive: true })

const sassResult = sass.compile(resolve(sourceDirectory, 'meetup.scss'), {
  style: 'expanded',
  loadPaths: [sourceDirectory],
})
await writeGenerated('meetup.css', sassResult.css)

const prefixesSource = resolve(sourceDirectory, 'prefixes.css')
const prefixesResult = await postcss([
  autoprefixer({
    overrideBrowserslist: ['Safari 8'],
  }),
]).process(await readFile(prefixesSource, 'utf8'), {
  from: prefixesSource,
  to: resolve(generatedDirectory, 'prefixes.css'),
})
await writeGenerated('prefixes.css', prefixesResult.css)

const tailwindSource = resolve(sourceDirectory, 'tailwind.css')
const tailwindResult = await postcss([tailwindcss()]).process(
  await readFile(tailwindSource, 'utf8'),
  {
    from: tailwindSource,
    to: resolve(generatedDirectory, 'tailwind.css'),
  },
)
await writeGenerated('tailwind.css', tailwindResult.css)

const bootstrapSource = resolve('node_modules/bootstrap/dist/css/bootstrap.css')
const bootstrapDestination = resolve(generatedDirectory, 'bootstrap.css')
await cp(bootstrapSource, bootstrapDestination)
console.log(`copied ${bootstrapSource} → ${bootstrapDestination}`)
