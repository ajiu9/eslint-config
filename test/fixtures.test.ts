import type { OptionsConfig, TypedFlatConfigItem } from '../src/types'

import { join, resolve } from 'node:path'
import { execa } from 'execa'
import fs from 'fs-extra'
import { glob } from 'tinyglobby'
import { beforeAll, it } from 'vitest'

beforeAll(async () => {
  await fs.rm('_fixtures', { recursive: true, force: true })
})
// afterAll(async () => {
//   await fs.rm('_fixtures', { recursive: true, force: true })
// })

runWithConfig('all', {
  vue: true,
  typescript: true,
})

runWithConfig('js', {
  vue: false,
  typescript: false,
})

runWithConfig('no-style', {
  typescript: true,
  stylistic: false,
  vue: true,
})

runWithConfig(
  'tab-double-quotes',
  {
    typescript: true,
    stylistic: {
      indent: 'tab',
      quotes: 'double',
    },
    vue: true,
  },
  {
    rules: {
      'style/no-mixed-spaces-and-tabs': 'off',
    },
  },
)

runWithConfig(
  'with-formatters',
  {
    typescript: true,
    vue: true,
    formatters: true,
  },
)

runWithConfig(
  'no-markdown-with-formatters',
  {
    markdown: false,
    vue: false,
    formatters: {
      markdown: true,
    },
  },
)

function runWithConfig(name: string, configs: OptionsConfig, ...items: TypedFlatConfigItem[]) {
  it.concurrent(name, async ({ expect }) => {
    const from = resolve('fixtures/input')
    const output = resolve('fixtures/output', name)
    const target = resolve('_fixtures', name)

    await fs.copy(from, target, {
      filter: (src) => {
        return !src.includes('node_modules')
      },
    })

    await fs.writeFile(join(target, 'eslint.config.js'), `
// @eslint-disable
import ajiu9 from '@ajiu9/eslint-config'
    
export default ajiu9(
  ${JSON.stringify(configs)},
    ...${JSON.stringify(items) ?? []},
    )
  `)

    await execa('npx', ['eslint', '.', '--fix'], {
      cwd: target,
      stdio: 'pipe',
    })

    const files = await glob('**/*', {
      ignore: [
        'node_modules',
        'eslint.config.js',
      ],
      cwd: target,
    })

    await Promise.all(files.map(async (file) => {
      const content = await fs.readFile(join(target, file), 'utf-8')
      const source = await fs.readFile(join(from, file), 'utf-8')
      const outputPath = join(output, file)
      if (content === source) {
        await fs.rm(outputPath, { force: true })
        return
      }
      await expect.soft(content).toMatchFileSnapshot(join(output, file))
    }))
  }, 30_000)
}
